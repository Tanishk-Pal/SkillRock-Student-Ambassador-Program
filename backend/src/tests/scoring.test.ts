import { describe, it, after, beforeEach } from 'node:test';
import assert from 'node:assert';
import {
  getActivityPoints,
  normalizeActivityType,
  recalculateAmbassador,
  ActivityType,
} from '../services/scoringService';
import { ActivityLog } from '../models/ActivityLog';
import { Ambassador } from '../models/Ambassador';

describe('Suite 1: Scoring Matrix & Uncapped Accumulation', () => {
  it('1.1: should award exact points for all canonical activity types', () => {
    assert.strictEqual(getActivityPoints('study_jam'), 150, 'study_jam must be 150 pts');
    assert.strictEqual(getActivityPoints('workshop'), 120, 'workshop must be 120 pts');
    assert.strictEqual(getActivityPoints('student_onboarded'), 20, 'student_onboarded must be 20 pts');
    assert.strictEqual(getActivityPoints('hackathon_mentored'), 250, 'hackathon_mentored must be 250 pts');
    assert.strictEqual(getActivityPoints('tech_blog'), 100, 'tech_blog must be 100 pts');
    assert.strictEqual(getActivityPoints('project_showcase'), 180, 'project_showcase must be 180 pts');
  });

  it('1.2: should return 0 points for unknown or invalid activity types', () => {
    assert.strictEqual(getActivityPoints('unknown_activity' as any), 0);
    assert.strictEqual(getActivityPoints('' as any), 0);
  });

  it('1.3: should normalize diverse string formats into canonical activity identifiers', () => {
    assert.strictEqual(normalizeActivityType('study_jam'), 'study_jam');
    assert.strictEqual(normalizeActivityType('STUDY_JAM'), 'study_jam');
    assert.strictEqual(normalizeActivityType('study-jam'), 'study_jam');
    assert.strictEqual(normalizeActivityType('workshop'), 'workshop');
    assert.strictEqual(normalizeActivityType('Student Onboarded'), 'student_onboarded');
    assert.strictEqual(normalizeActivityType('hackathon-mentored'), 'hackathon_mentored');
    assert.strictEqual(normalizeActivityType('invalid_type_name'), null);
    assert.strictEqual(normalizeActivityType(''), null);
  });

  it('1.4: should calculate accumulated points accurately across distinct activities', () => {
    const activities: { type: ActivityType; count: number }[] = [
      { type: 'study_jam', count: 2 }, // 2 * 150 = 300
      { type: 'workshop', count: 1 }, // 1 * 120 = 120
      { type: 'student_onboarded', count: 5 }, // 5 * 20 = 100
      { type: 'hackathon_mentored', count: 1 }, // 1 * 250 = 250
    ];

    const total = activities.reduce((sum, item) => {
      return sum + getActivityPoints(item.type) * item.count;
    }, 0);

    assert.strictEqual(total, 770, 'Calculated total must equal 770 points');
  });

  it('1.5: CRITICAL REQUIREMENT - should calculate uncapped scores surpassing the 1,600-point ceiling', () => {
    // 7 Hackathons = 1,750 points (surpasses legacy 1,600 limit)
    const hackathonTotal = getActivityPoints('hackathon_mentored') * 7;
    assert.strictEqual(hackathonTotal, 1750);
    assert(hackathonTotal > 1600, 'Points must exceed the legacy 1600 ceiling without being capped');

    // High engagement scenario: 15 Study Jams + 10 Workshops + 4 Hackathons = 4,450 points
    const highEngagementTotal =
      getActivityPoints('study_jam') * 15 +
      getActivityPoints('workshop') * 10 +
      getActivityPoints('hackathon_mentored') * 4;

    assert.strictEqual(highEngagementTotal, 4450);
    assert(highEngagementTotal > 1600, 'Score accumulation must remain uncapped');
  });

  it('1.6: should handle edge case of empty activity log returning 0 points', () => {
    const emptyLog: ActivityType[] = [];
    const total = emptyLog.reduce((sum, type) => sum + getActivityPoints(type), 0);
    assert.strictEqual(total, 0, 'Empty log must yield 0 points');
  });
});

describe('Suite 2: Ambassador Score & Badge Recalculation (recalculateAmbassador)', () => {
  // Preserve original Mongoose model static methods
  const origActivityLogFind = ActivityLog.find;
  const origAmbassadorFindById = Ambassador.findById;
  const origAmbassadorFindByIdAndUpdate = Ambassador.findByIdAndUpdate;

  let capturedPayload: any = null;
  let capturedAmbassadorId: string | null = null;
  let mockActivityLogs: any[] = [];
  let mockAmbassadorDoc: any = null;

  beforeEach(() => {
    capturedPayload = null;
    capturedAmbassadorId = null;
    mockActivityLogs = [];
    mockAmbassadorDoc = { certificateStatus: 'pending' };

    (ActivityLog as any).find = async (_filter: any) => {
      return [...mockActivityLogs];
    };

    (Ambassador as any).findById = async (_id: string) => {
      return mockAmbassadorDoc ? { _id, ...mockAmbassadorDoc } : null;
    };

    (Ambassador as any).findByIdAndUpdate = async (id: string, payload: any, _options: any) => {
      capturedAmbassadorId = id;
      capturedPayload = payload;
      if (!mockAmbassadorDoc) return null;
      return { _id: id, ...mockAmbassadorDoc, ...payload };
    };
  });

  after(() => {
    // Restore original Mongoose methods
    ActivityLog.find = origActivityLogFind;
    Ambassador.findById = origAmbassadorFindById;
    Ambassador.findByIdAndUpdate = origAmbassadorFindByIdAndUpdate;
  });

  it('2.1: should assign badgeTier: null and badges: [] when totalPoints is 0 (empty activity log)', async () => {
    mockActivityLogs = [];
    const result = await recalculateAmbassador('amb_0');

    assert(result !== null);
    assert.strictEqual(capturedAmbassadorId, 'amb_0');
    assert.strictEqual(capturedPayload.totalPoints, 0);
    assert.strictEqual(capturedPayload.activitiesCount, 0);
    assert.strictEqual(capturedPayload.badgeTier, null, 'badgeTier must be null for 0 points');
    assert.deepStrictEqual(capturedPayload.badges, [], 'badges must be empty array for 0 points');
    assert.strictEqual(capturedPayload.certificateStatus, 'pending');
  });

  it('2.2: CRITICAL - should assign badgeTier: null and badges: [] when totalPoints is 50 (< 200)', async () => {
    mockActivityLogs = [
      {
        pointsAwarded: 50,
        status: 'verified',
        verifiedAt: new Date('2026-03-01T10:00:00Z'),
        activityName: 'Student Onboarding Drive',
      },
    ];
    const result = await recalculateAmbassador('amb_50');

    assert(result !== null);
    assert.strictEqual(capturedAmbassadorId, 'amb_50');
    assert.strictEqual(capturedPayload.totalPoints, 50);
    assert.strictEqual(capturedPayload.activitiesCount, 1);
    assert.strictEqual(
      capturedPayload.badgeTier,
      null,
      'badgeTier must be null when totalPoints=50 (< 200 pts); fallback to "The Explorer" must not occur'
    );
    assert.deepStrictEqual(capturedPayload.badges, [], 'badges must be empty array for 50 points');
    assert.strictEqual(capturedPayload.recentActivity, 'Student Onboarding Drive');
    assert.strictEqual(capturedPayload.certificateStatus, 'pending');
  });

  it('2.3: should assign badgeTier: null and badges: [] at exact upper boundary of 199 points (< 200)', async () => {
    mockActivityLogs = [
      {
        pointsAwarded: 120,
        status: 'verified',
        verifiedAt: new Date('2026-03-01T10:00:00Z'),
        activityName: 'Git Workshop',
      },
      {
        pointsAwarded: 79,
        status: 'verified',
        verifiedAt: new Date('2026-03-05T14:00:00Z'),
        activityName: 'Campus Study Jam',
      },
    ];
    const result = await recalculateAmbassador('amb_199');

    assert(result !== null);
    assert.strictEqual(capturedAmbassadorId, 'amb_199');
    assert.strictEqual(capturedPayload.totalPoints, 199);
    assert.strictEqual(capturedPayload.activitiesCount, 2);
    assert.strictEqual(
      capturedPayload.badgeTier,
      null,
      'badgeTier must be null for 199 points (1 point below The Explorer threshold)'
    );
    assert.deepStrictEqual(capturedPayload.badges, [], 'badges must be empty array for 199 points');
    assert.strictEqual(capturedPayload.recentActivity, 'Campus Study Jam');
    assert.strictEqual(
      capturedPayload.certificateStatus,
      'pending',
      'Certificate status must remain pending when totalPoints < 200 even if activitiesCount >= 2'
    );
  });

  it('2.4: should award badgeTier: "The Explorer" and badges: ["The Explorer"] at exact boundary of 200 points', async () => {
    mockActivityLogs = [
      {
        pointsAwarded: 100,
        status: 'verified',
        verifiedAt: new Date('2026-03-01T10:00:00Z'),
        activityName: 'Tech Blog Part 1',
      },
      {
        pointsAwarded: 100,
        status: 'verified',
        verifiedAt: new Date('2026-03-08T10:00:00Z'),
        activityName: 'Tech Blog Part 2',
      },
    ];
    const result = await recalculateAmbassador('amb_200');

    assert(result !== null);
    assert.strictEqual(capturedAmbassadorId, 'amb_200');
    assert.strictEqual(capturedPayload.totalPoints, 200);
    assert.strictEqual(capturedPayload.activitiesCount, 2);
    assert.strictEqual(capturedPayload.badgeTier, 'The Explorer');
    assert.deepStrictEqual(capturedPayload.badges, ['The Explorer']);
    assert.strictEqual(capturedPayload.recentActivity, 'Tech Blog Part 2');
    assert.strictEqual(
      capturedPayload.certificateStatus,
      'eligible',
      'Certificate status must transition to eligible at 200 pts and 2 activities'
    );
  });

  it('2.5: should award "The Trailblazer" and cumulative badges when totalPoints reaches 600', async () => {
    mockActivityLogs = [
      { pointsAwarded: 250, status: 'verified', verifiedAt: new Date('2026-02-01T10:00:00Z'), activityName: 'Hackathon 1' },
      { pointsAwarded: 250, status: 'verified', verifiedAt: new Date('2026-02-15T10:00:00Z'), activityName: 'Hackathon 2' },
      { pointsAwarded: 100, status: 'verified', verifiedAt: new Date('2026-03-01T10:00:00Z'), activityName: 'Tech Blog' },
    ];
    await recalculateAmbassador('amb_600');

    assert.strictEqual(capturedPayload.totalPoints, 600);
    assert.strictEqual(capturedPayload.badgeTier, 'The Trailblazer');
    assert.deepStrictEqual(capturedPayload.badges, ['The Explorer', 'The Trailblazer']);
  });

  it('2.6: should award "The Changemaker" and cumulative badges when totalPoints reaches 1,200', async () => {
    mockActivityLogs = [
      { pointsAwarded: 600, status: 'verified', verifiedAt: new Date('2026-02-01T10:00:00Z'), activityName: 'Activities Part 1' },
      { pointsAwarded: 600, status: 'verified', verifiedAt: new Date('2026-03-01T10:00:00Z'), activityName: 'Activities Part 2' },
    ];
    await recalculateAmbassador('amb_1200');

    assert.strictEqual(capturedPayload.totalPoints, 1200);
    assert.strictEqual(capturedPayload.badgeTier, 'The Changemaker');
    assert.deepStrictEqual(capturedPayload.badges, ['The Explorer', 'The Trailblazer', 'The Changemaker']);
  });

  it('2.7: should award "SkillRock Champ" and all 4 cumulative badges when totalPoints reaches 2,000', async () => {
    mockActivityLogs = [
      { pointsAwarded: 1000, status: 'verified', verifiedAt: new Date('2026-02-01T10:00:00Z'), activityName: 'Major Milestone A' },
      { pointsAwarded: 1000, status: 'verified', verifiedAt: new Date('2026-03-01T10:00:00Z'), activityName: 'Major Milestone B' },
    ];
    await recalculateAmbassador('amb_2000');

    assert.strictEqual(capturedPayload.totalPoints, 2000);
    assert.strictEqual(capturedPayload.badgeTier, 'SkillRock Champ');
    assert.deepStrictEqual(capturedPayload.badges, [
      'The Explorer',
      'The Trailblazer',
      'The Changemaker',
      'SkillRock Champ',
    ]);
  });

  it('2.8: should support uncapped points accumulation far exceeding 1,600 (e.g. 50,000 pts)', async () => {
    // 200 Hackathons @ 250 = 50,000 points
    mockActivityLogs = Array.from({ length: 200 }, (_, i) => ({
      pointsAwarded: 250,
      status: 'verified',
      verifiedAt: new Date(2026, 0, 1 + (i % 30)),
      activityName: `Hackathon ${i + 1}`,
    }));
    await recalculateAmbassador('amb_50k');

    assert.strictEqual(capturedPayload.totalPoints, 50000);
    assert.strictEqual(capturedPayload.activitiesCount, 200);
    assert.strictEqual(capturedPayload.badgeTier, 'SkillRock Champ');
    assert.deepStrictEqual(capturedPayload.badges, [
      'The Explorer',
      'The Trailblazer',
      'The Changemaker',
      'SkillRock Champ',
    ]);
  });

  it('2.9: should preserve certificateStatus when already "issued" and not overwrite it', async () => {
    mockAmbassadorDoc = {
      certificateStatus: 'issued',
      certificateId: 'SSAP-2026-CERT-042',
    };
    mockActivityLogs = [
      { pointsAwarded: 300, status: 'verified', verifiedAt: new Date(), activityName: 'Extra Event' },
    ];
    await recalculateAmbassador('amb_already_issued');

    assert.strictEqual(
      capturedPayload.certificateStatus,
      undefined,
      'recalculateAmbassador must not include certificateStatus in update payload when document is already issued'
    );
  });

  it('2.10: should return null gracefully if ambassador document does not exist', async () => {
    mockAmbassadorDoc = null;
    mockActivityLogs = [];
    const result = await recalculateAmbassador('non_existent_ambassador_id');

    assert.strictEqual(result, null);
  });
});
