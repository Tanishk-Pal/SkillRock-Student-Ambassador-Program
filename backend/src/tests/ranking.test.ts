import { describe, it } from 'node:test';
import assert from 'node:assert';
import {
  compareAmbassadors,
  assignRanks,
  RankableAmbassador,
} from '../services/scoringService';

describe('Suite 3: Leaderboard Sorting & 4-Tier Tie-Breaking Order', () => {
  it('3.1: should rank ambassador with higher totalPoints higher', () => {
    const ambA: RankableAmbassador = {
      _id: 'amb_1',
      totalPoints: 2450,
      activitiesCount: 10,
      joinedAt: new Date('2026-02-01'),
    };
    const ambB: RankableAmbassador = {
      _id: 'amb_2',
      totalPoints: 1800,
      activitiesCount: 15,
      joinedAt: new Date('2026-01-01'),
    };

    const diff = compareAmbassadors(ambA, ambB);
    assert(diff < 0, 'ambA (2450 pts) must sort before ambB (1800 pts)');
  });

  it('3.2: should break ties on activitiesCount (descending) when totalPoints are equal', () => {
    const ambA: RankableAmbassador = {
      _id: 'amb_high_act',
      totalPoints: 1200,
      activitiesCount: 12,
      joinedAt: new Date('2026-02-01'),
    };
    const ambB: RankableAmbassador = {
      _id: 'amb_low_act',
      totalPoints: 1200,
      activitiesCount: 8,
      joinedAt: new Date('2026-01-01'),
    };

    const diff = compareAmbassadors(ambA, ambB);
    assert(diff < 0, 'ambA with 12 activities must rank higher than ambB with 8 activities');
  });

  it('3.3: should break ties on joinedAt (ascending / seniority) when points and activities match', () => {
    const ambSenior: RankableAmbassador = {
      _id: 'amb_senior',
      totalPoints: 1200,
      activitiesCount: 10,
      joinedAt: new Date('2026-01-10T00:00:00Z'),
    };
    const ambJunior: RankableAmbassador = {
      _id: 'amb_junior',
      totalPoints: 1200,
      activitiesCount: 10,
      joinedAt: new Date('2026-02-15T00:00:00Z'),
    };

    const diff = compareAmbassadors(ambSenior, ambJunior);
    assert(diff < 0, 'ambSenior who joined earlier must rank ahead of ambJunior');
  });

  it('3.4: should use _id fallback for 100% deterministic ranking when all attributes match', () => {
    const joined = new Date('2026-01-15T00:00:00Z');
    const amb1: RankableAmbassador = {
      _id: 'aaa_001',
      totalPoints: 800,
      activitiesCount: 5,
      joinedAt: joined,
    };
    const amb2: RankableAmbassador = {
      _id: 'zzz_999',
      totalPoints: 800,
      activitiesCount: 5,
      joinedAt: joined,
    };

    const diff = compareAmbassadors(amb1, amb2);
    assert(diff < 0, 'aaa_001 must rank ahead of zzz_999 deterministically');
  });

  it('3.5: should assign 1-indexed sequential ranks correctly across a cohort', () => {
    const cohort: (RankableAmbassador & { name: string })[] = [
      { name: 'Diana', totalPoints: 1200, activitiesCount: 8, joinedAt: new Date('2026-01-01') },
      { name: 'Alice', totalPoints: 2400, activitiesCount: 18, joinedAt: new Date('2026-01-01') },
      { name: 'Charlie', totalPoints: 1200, activitiesCount: 12, joinedAt: new Date('2026-01-01') },
      { name: 'Bob', totalPoints: 1900, activitiesCount: 14, joinedAt: new Date('2026-01-01') },
    ];

    const ranked = assignRanks(cohort);

    assert.strictEqual(ranked[0].name, 'Alice', 'Rank 1 must be Alice (2400 pts)');
    assert.strictEqual(ranked[0].rank, 1);

    assert.strictEqual(ranked[1].name, 'Bob', 'Rank 2 must be Bob (1900 pts)');
    assert.strictEqual(ranked[1].rank, 2);

    assert.strictEqual(ranked[2].name, 'Charlie', 'Rank 3 must be Charlie (1200 pts, 12 acts)');
    assert.strictEqual(ranked[2].rank, 3);

    assert.strictEqual(ranked[3].name, 'Diana', 'Rank 4 must be Diana (1200 pts, 8 acts)');
    assert.strictEqual(ranked[3].rank, 4);
  });
});
