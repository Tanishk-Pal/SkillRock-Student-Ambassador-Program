import { describe, it } from 'node:test';
import assert from 'node:assert';
import {
  getActivityPoints,
  normalizeActivityType,
  calculateBadgeTier,
  calculateEarnedBadges,
  calculateNextBadgeProgress,
  checkCertificateEligibility,
  compareAmbassadors,
  assignRanks,
  ActivityType,
  RankableAmbassador,
} from '../services/scoringService';

describe('Adversarial Scoring Suite 1: Extreme Point Values & Uncapped Accumulation (1,600+ Limit Removal)', () => {
  it('ADV-1.1: Points calculation must scale to extreme numbers without capping at 1,600 or any ceiling', () => {
    // 5,000 points
    const pts5k = 5000;
    assert.strictEqual(calculateBadgeTier(pts5k), 'SkillRock Champ');
    assert.deepStrictEqual(calculateEarnedBadges(pts5k), [
      'The Explorer',
      'The Trailblazer',
      'The Changemaker',
      'SkillRock Champ',
    ]);
    const progress5k = calculateNextBadgeProgress(pts5k);
    assert.strictEqual(progress5k.currentTier, 'SkillRock Champ');
    assert.strictEqual(progress5k.nextTier, null);
    assert.strictEqual(progress5k.pointsNeeded, 0);
    assert.strictEqual(progress5k.progressPercent, 100);

    // 20,000 points
    const pts20k = 20000;
    assert.strictEqual(calculateBadgeTier(pts20k), 'SkillRock Champ');
    assert.deepStrictEqual(calculateEarnedBadges(pts20k), [
      'The Explorer',
      'The Trailblazer',
      'The Changemaker',
      'SkillRock Champ',
    ]);
    const progress20k = calculateNextBadgeProgress(pts20k);
    assert.strictEqual(progress20k.progressPercent, 100);
    assert.strictEqual(progress20k.pointsNeeded, 0);

    // 100,000 points
    const pts100k = 100000;
    assert.strictEqual(calculateBadgeTier(pts100k), 'SkillRock Champ');
    assert.deepStrictEqual(calculateEarnedBadges(pts100k), [
      'The Explorer',
      'The Trailblazer',
      'The Changemaker',
      'SkillRock Champ',
    ]);

    // 1,000,000 points
    const pts1M = 1000000;
    assert.strictEqual(calculateBadgeTier(pts1M), 'SkillRock Champ');
  });

  it('ADV-1.2: Massive activity accumulation (10,000 events) must compute exact sum uncapped', () => {
    // 4,000 Study Jams (150 pts each) = 600,000
    // 4,000 Workshops (120 pts each) = 480,000
    // 2,000 Hackathons (250 pts each) = 500,000
    // Total = 1,580,000 points across 10,000 activities
    const events: { type: ActivityType; count: number }[] = [
      { type: 'study_jam', count: 4000 },
      { type: 'workshop', count: 4000 },
      { type: 'hackathon_mentored', count: 2000 },
    ];

    let totalPoints = 0;
    for (const e of events) {
      totalPoints += getActivityPoints(e.type) * e.count;
    }

    assert.strictEqual(totalPoints, 1580000);
    assert(totalPoints > 1600, 'Points must far exceed the 1,600 ceiling');
    assert.strictEqual(calculateBadgeTier(totalPoints), 'SkillRock Champ');
  });

  it('ADV-1.3: Number.MAX_SAFE_INTEGER must not cause integer overflow or NaN in scoring functions', () => {
    const extremeMax = Number.MAX_SAFE_INTEGER;
    assert.strictEqual(calculateBadgeTier(extremeMax), 'SkillRock Champ');
    assert.deepStrictEqual(calculateEarnedBadges(extremeMax), [
      'The Explorer',
      'The Trailblazer',
      'The Changemaker',
      'SkillRock Champ',
    ]);
    const progress = calculateNextBadgeProgress(extremeMax);
    assert.strictEqual(progress.progressPercent, 100);
    assert.strictEqual(progress.pointsNeeded, 0);
  });
});

describe('Adversarial Scoring Suite 2: Exact Badge Boundary Conditions (The 1-Point Differential)', () => {
  it('ADV-2.1: 199 vs 200 boundary ("The Explorer")', () => {
    // 199 Points: BELOW threshold
    assert.strictEqual(calculateBadgeTier(199), null, '199 points must NOT qualify for The Explorer');
    assert.deepStrictEqual(calculateEarnedBadges(199), [], '199 points must have 0 earned badges');
    const p199 = calculateNextBadgeProgress(199);
    assert.strictEqual(p199.currentTier, null);
    assert.strictEqual(p199.nextTier, 'The Explorer');
    assert.strictEqual(p199.pointsNeeded, 1, 'Needs exactly 1 point to reach The Explorer');
    assert.strictEqual(p199.progressPercent, 99, '199/200 must floor to 99%');

    // 200 Points: EXACT threshold
    assert.strictEqual(calculateBadgeTier(200), 'The Explorer', '200 points MUST qualify for The Explorer');
    assert.deepStrictEqual(calculateEarnedBadges(200), ['The Explorer'], '200 points must award The Explorer');
    const p200 = calculateNextBadgeProgress(200);
    assert.strictEqual(p200.currentTier, 'The Explorer');
    assert.strictEqual(p200.nextTier, 'The Trailblazer');
    assert.strictEqual(p200.pointsNeeded, 400, 'Needs 400 points to reach The Trailblazer (600 - 200)');
    assert.strictEqual(p200.progressPercent, 0, 'At exactly 200, progress towards Trailblazer is 0%');

    // 201 Points: JUST ABOVE threshold
    assert.strictEqual(calculateBadgeTier(201), 'The Explorer');
    assert.deepStrictEqual(calculateEarnedBadges(201), ['The Explorer']);
    const p201 = calculateNextBadgeProgress(201);
    assert.strictEqual(p201.currentTier, 'The Explorer');
    assert.strictEqual(p201.pointsNeeded, 399);
  });

  it('ADV-2.2: 599 vs 600 boundary ("The Trailblazer")', () => {
    // 599 Points: Highest Explorer
    assert.strictEqual(calculateBadgeTier(599), 'The Explorer');
    assert.deepStrictEqual(calculateEarnedBadges(599), ['The Explorer']);
    const p599 = calculateNextBadgeProgress(599);
    assert.strictEqual(p599.currentTier, 'The Explorer');
    assert.strictEqual(p599.nextTier, 'The Trailblazer');
    assert.strictEqual(p599.pointsNeeded, 1);
    assert.strictEqual(p599.progressPercent, 99, '(599 - 200)/400 = 399/400 = 99.75% -> 99%');

    // 600 Points: EXACT Trailblazer
    assert.strictEqual(calculateBadgeTier(600), 'The Trailblazer');
    assert.deepStrictEqual(calculateEarnedBadges(600), ['The Explorer', 'The Trailblazer']);
    const p600 = calculateNextBadgeProgress(600);
    assert.strictEqual(p600.currentTier, 'The Trailblazer');
    assert.strictEqual(p600.nextTier, 'The Changemaker');
    assert.strictEqual(p600.pointsNeeded, 600, 'Needs 600 points to reach The Changemaker (1200 - 600)');
    assert.strictEqual(p600.progressPercent, 0);

    // 601 Points: JUST ABOVE Trailblazer
    assert.strictEqual(calculateBadgeTier(601), 'The Trailblazer');
    assert.deepStrictEqual(calculateEarnedBadges(601), ['The Explorer', 'The Trailblazer']);
  });

  it('ADV-2.3: 1199 vs 1200 boundary ("The Changemaker")', () => {
    // 1199 Points: Highest Trailblazer
    assert.strictEqual(calculateBadgeTier(1199), 'The Trailblazer');
    assert.deepStrictEqual(calculateEarnedBadges(1199), ['The Explorer', 'The Trailblazer']);
    const p1199 = calculateNextBadgeProgress(1199);
    assert.strictEqual(p1199.currentTier, 'The Trailblazer');
    assert.strictEqual(p1199.nextTier, 'The Changemaker');
    assert.strictEqual(p1199.pointsNeeded, 1);
    assert.strictEqual(p1199.progressPercent, 99, '(1199 - 600)/600 = 599/600 -> 99%');

    // 1200 Points: EXACT Changemaker
    assert.strictEqual(calculateBadgeTier(1200), 'The Changemaker');
    assert.deepStrictEqual(calculateEarnedBadges(1200), [
      'The Explorer',
      'The Trailblazer',
      'The Changemaker',
    ]);
    const p1200 = calculateNextBadgeProgress(1200);
    assert.strictEqual(p1200.currentTier, 'The Changemaker');
    assert.strictEqual(p1200.nextTier, 'SkillRock Champ');
    assert.strictEqual(p1200.pointsNeeded, 800, 'Needs 800 points to reach SkillRock Champ (2000 - 1200)');
    assert.strictEqual(p1200.progressPercent, 0);

    // 1201 Points: JUST ABOVE Changemaker
    assert.strictEqual(calculateBadgeTier(1201), 'The Changemaker');
  });

  it('ADV-2.4: 1599, 1600, 1601 (Legacy 1600 ceiling boundary verification)', () => {
    // Verify that exactly at and around legacy 1600, system is smoothly progressing in Changemaker tier
    assert.strictEqual(calculateBadgeTier(1599), 'The Changemaker');
    assert.strictEqual(calculateBadgeTier(1600), 'The Changemaker');
    assert.strictEqual(calculateBadgeTier(1601), 'The Changemaker');

    const p1600 = calculateNextBadgeProgress(1600);
    assert.strictEqual(p1600.currentTier, 'The Changemaker');
    assert.strictEqual(p1600.nextTier, 'SkillRock Champ');
    assert.strictEqual(p1600.pointsNeeded, 400);
    assert.strictEqual(p1600.progressPercent, 50, '(1600 - 1200)/800 = 400/800 = 50%');
  });

  it('ADV-2.5: 1999 vs 2000 boundary ("SkillRock Champ")', () => {
    // 1999 Points: Highest Changemaker
    assert.strictEqual(calculateBadgeTier(1999), 'The Changemaker');
    assert.deepStrictEqual(calculateEarnedBadges(1999), [
      'The Explorer',
      'The Trailblazer',
      'The Changemaker',
    ]);
    const p1999 = calculateNextBadgeProgress(1999);
    assert.strictEqual(p1999.currentTier, 'The Changemaker');
    assert.strictEqual(p1999.nextTier, 'SkillRock Champ');
    assert.strictEqual(p1999.pointsNeeded, 1);
    assert.strictEqual(p1999.progressPercent, 99, '(1999 - 1200)/800 = 799/800 -> 99%');

    // 2000 Points: EXACT SkillRock Champ
    assert.strictEqual(calculateBadgeTier(2000), 'SkillRock Champ');
    assert.deepStrictEqual(calculateEarnedBadges(2000), [
      'The Explorer',
      'The Trailblazer',
      'The Changemaker',
      'SkillRock Champ',
    ]);
    const p2000 = calculateNextBadgeProgress(2000);
    assert.strictEqual(p2000.currentTier, 'SkillRock Champ');
    assert.strictEqual(p2000.nextTier, null);
    assert.strictEqual(p2000.pointsNeeded, 0);
    assert.strictEqual(p2000.progressPercent, 100);

    // 2001 Points: Above SkillRock Champ
    assert.strictEqual(calculateBadgeTier(2001), 'SkillRock Champ');
    assert.deepStrictEqual(calculateEarnedBadges(2001), [
      'The Explorer',
      'The Trailblazer',
      'The Changemaker',
      'SkillRock Champ',
    ]);
  });
});

describe('Adversarial Scoring Suite 3: Rank Sorting & 4-Tier Tie-Breaking Determinism', () => {
  it('ADV-3.1: Tier 1 dominance - higher totalPoints overrides higher activities and earlier join date', () => {
    const ambHighPts: RankableAmbassador = {
      _id: 'user_high_pts',
      totalPoints: 5000,
      activitiesCount: 2, // low activity
      joinedAt: '2026-03-01T00:00:00Z', // late joiner
    };
    const ambLowPts: RankableAmbassador = {
      _id: 'user_low_pts',
      totalPoints: 4999,
      activitiesCount: 50, // high activity
      joinedAt: '2025-01-01T00:00:00Z', // veteran joiner
    };

    assert(compareAmbassadors(ambHighPts, ambLowPts) < 0, 'User with 5000 pts must rank ahead of 4999 pts');
    assert(compareAmbassadors(ambLowPts, ambHighPts) > 0, 'Antisymmetric property must hold');
  });

  it('ADV-3.2: Tier 2 tie-breaking - identical points (e.g. 2,400) broken strictly by activitiesCount DESC', () => {
    const amb15Acts: RankableAmbassador = {
      _id: 'user_15_acts',
      totalPoints: 2400,
      activitiesCount: 15,
      joinedAt: '2026-02-15T00:00:00Z',
    };
    const amb14Acts: RankableAmbassador = {
      _id: 'user_14_acts',
      totalPoints: 2400,
      activitiesCount: 14,
      joinedAt: '2026-01-01T00:00:00Z', // earlier joiner
    };

    assert(compareAmbassadors(amb15Acts, amb14Acts) < 0, '15 activities must defeat 14 activities on tied points');
  });

  it('ADV-3.3: Tier 3 tie-breaking - identical points AND activities broken strictly by joinedAt ASC (seniority)', () => {
    // Testing millisecond-level seniority
    const ambSenior: RankableAmbassador = {
      _id: 'senior_amb',
      totalPoints: 1800,
      activitiesCount: 10,
      joinedAt: '2026-01-10T12:00:00.000Z',
    };
    const ambJunior: RankableAmbassador = {
      _id: 'junior_amb',
      totalPoints: 1800,
      activitiesCount: 10,
      joinedAt: '2026-01-10T12:00:00.001Z', // 1 millisecond later
    };

    assert(compareAmbassadors(ambSenior, ambJunior) < 0, 'Seniority of 1ms must break tie in favor of earlier joined');

    // Testing Date object vs string
    const ambDateObj: RankableAmbassador = {
      _id: 'date_obj',
      totalPoints: 1800,
      activitiesCount: 10,
      joinedAt: new Date('2026-01-05T00:00:00Z'),
    };
    const ambDateStr: RankableAmbassador = {
      _id: 'date_str',
      totalPoints: 1800,
      activitiesCount: 10,
      joinedAt: '2026-01-06T00:00:00Z',
    };
    assert(compareAmbassadors(ambDateObj, ambDateStr) < 0, 'Date object vs string comparison must resolve correctly');
  });

  it('ADV-3.4: Tier 4 tie-breaking - identical points, activities AND joinedAt broken strictly by _id ASC', () => {
    const identicalTime = '2026-01-01T00:00:00.000Z';
    const ambA: RankableAmbassador = {
      _id: '60c72b2f9b1d8b2bad000001',
      totalPoints: 1500,
      activitiesCount: 8,
      joinedAt: identicalTime,
    };
    const ambB: RankableAmbassador = {
      _id: '60c72b2f9b1d8b2bad000002',
      totalPoints: 1500,
      activitiesCount: 8,
      joinedAt: identicalTime,
    };

    assert(compareAmbassadors(ambA, ambB) < 0, '_id 000001 must rank ahead of 000002');
    assert(compareAmbassadors(ambB, ambA) > 0, '_id 000002 must rank behind 000001');

    // Exactly identical in every single property including _id
    assert.strictEqual(compareAmbassadors(ambA, ambA), 0, 'Identical objects must return 0');
  });

  it('ADV-3.5: Large Cohort Ranking Invariant (200 ambassadors with tied points and dates)', () => {
    const cohort: (RankableAmbassador & { id: number })[] = [];
    // Generate 200 ambassadors with varied and overlapping points
    for (let i = 0; i < 200; i++) {
      cohort.push({
        id: i,
        _id: `amb_${String(i).padStart(4, '0')}`,
        totalPoints: (i % 20) * 100, // 0 to 1900 pts with lots of ties
        activitiesCount: (i % 5) * 2,
        joinedAt: new Date(2026, 0, 1 + (i % 10)).toISOString(),
      });
    }

    // Shuffle cohort to simulate random DB retrieval
    const shuffled = [...cohort].sort(() => Math.random() - 0.5);
    const ranked = assignRanks(shuffled);

    // Verify invariants:
    assert.strictEqual(ranked.length, 200, 'All 200 ambassadors must be present in output');

    for (let i = 0; i < ranked.length; i++) {
      // 1. Ranks must be strictly 1-indexed sequential integers with zero gaps and zero duplicates
      assert.strictEqual(ranked[i].rank, i + 1, `Rank at index ${i} must be ${i + 1}`);

      // 2. Strict non-decreasing order: every ranked[i] must be ranked equal or better than ranked[i+1]
      if (i < ranked.length - 1) {
        const cmp = compareAmbassadors(ranked[i], ranked[i + 1]);
        assert(
          cmp <= 0,
          `Ambassador at rank ${ranked[i].rank} must rank ahead of or equal to rank ${ranked[i + 1].rank}`
        );
      }
    }
  });
});

describe('Adversarial Scoring Suite 4: Certificate Eligibility Boundary Matrix', () => {
  it('ADV-4.1: Dual-condition boundary checks (points >= 200 AND activities >= 2)', () => {
    // Test matrix
    const matrix = [
      { points: 0, activities: 0, eligible: false },
      { points: 199, activities: 2, eligible: false }, // points fail
      { points: 199, activities: 50, eligible: false }, // high activities, points fail
      { points: 200, activities: 0, eligible: false }, // activities fail
      { points: 200, activities: 1, eligible: false }, // activities fail (needs >= 2)
      { points: 200, activities: 2, eligible: true }, // EXACT DUAL BOUNDARY
      { points: 200, activities: 3, eligible: true },
      { points: 201, activities: 2, eligible: true },
      { points: 50000, activities: 1, eligible: false }, // massive points, but only 1 activity
      { points: 50000, activities: 2, eligible: true },
      { points: 100000, activities: 100, eligible: true },
    ];

    for (const testCase of matrix) {
      const res = checkCertificateEligibility(testCase.points, testCase.activities);
      assert.strictEqual(
        res.isEligible,
        testCase.eligible,
        `Expected eligible=${testCase.eligible} for points=${testCase.points}, activities=${testCase.activities}`
      );
      assert.strictEqual(
        res.status,
        testCase.eligible ? 'eligible' : 'pending',
        `Expected status='${testCase.eligible ? 'eligible' : 'pending'}' for points=${testCase.points}`
      );
    }
  });
});

describe('Adversarial Scoring Suite 5: Robustness, Negative Values & Type Edge Cases', () => {
  it('ADV-5.1: Negative and zero point handling in badge calculations', () => {
    assert.strictEqual(calculateBadgeTier(0), null);
    assert.strictEqual(calculateBadgeTier(-50), null);
    assert.deepStrictEqual(calculateEarnedBadges(-100), []);

    // Next badge progress for negative points should clamp progressPercent to 0 (never negative)
    const progNeg = calculateNextBadgeProgress(-50);
    assert.strictEqual(progNeg.currentTier, null);
    assert.strictEqual(progNeg.nextTier, 'The Explorer');
    assert.strictEqual(progNeg.progressPercent, 0, 'Progress percentage must not be negative');
    assert.strictEqual(progNeg.pointsNeeded, 250, '200 - (-50) = 250');
  });

  it('ADV-5.2: Fractional points boundary tests', () => {
    // 199.9 vs 200.0
    assert.strictEqual(calculateBadgeTier(199.9), null, '199.9 is strictly < 200');
    assert.strictEqual(calculateBadgeTier(200.0), 'The Explorer');

    // 599.9 vs 600.0
    assert.strictEqual(calculateBadgeTier(599.9), 'The Explorer');
    assert.strictEqual(calculateBadgeTier(600.0), 'The Trailblazer');

    // 1199.9 vs 1200.0
    assert.strictEqual(calculateBadgeTier(1199.9), 'The Trailblazer');
    assert.strictEqual(calculateBadgeTier(1200.0), 'The Changemaker');

    // 1999.9 vs 2000.0
    assert.strictEqual(calculateBadgeTier(1999.9), 'The Changemaker');
    assert.strictEqual(calculateBadgeTier(2000.0), 'SkillRock Champ');
  });

  it('ADV-5.3: String normalization edge cases', () => {
    assert.strictEqual(normalizeActivityType('  STUDY--JAM  '), 'study_jam');
    assert.strictEqual(normalizeActivityType('CAMPUS DEMO'), 'campus_demo');
    assert.strictEqual(normalizeActivityType('peer-mentorship'), 'peer_mentorship');
    assert.strictEqual(normalizeActivityType(''), null);
    assert.strictEqual(normalizeActivityType(null as any), null);
    assert.strictEqual(normalizeActivityType(undefined as any), null);
    assert.strictEqual(normalizeActivityType(12345 as any), null);
  });
});
