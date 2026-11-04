import { describe, it } from 'node:test';
import assert from 'node:assert';
import {
  calculateBadgeTier,
  calculateEarnedBadges,
  calculateNextBadgeProgress,
} from '../services/scoringService';

describe('Suite 2: Badge Tier Boundary Calculations', () => {
  it('2.1: should return null for scores below 200 points', () => {
    assert.strictEqual(calculateBadgeTier(0), null);
    assert.strictEqual(calculateBadgeTier(50), null);
    assert.strictEqual(calculateBadgeTier(199), null, '199 pts must not qualify for The Explorer');
  });

  it('2.2: should award "The Explorer" badge tier at exact boundary of 200 points up to 599 points', () => {
    assert.strictEqual(calculateBadgeTier(200), 'The Explorer', '200 pts must award The Explorer');
    assert.strictEqual(calculateBadgeTier(201), 'The Explorer');
    assert.strictEqual(calculateBadgeTier(450), 'The Explorer');
    assert.strictEqual(calculateBadgeTier(599), 'The Explorer', '599 pts must remain The Explorer');
  });

  it('2.3: should award "The Trailblazer" badge tier at exact boundary of 600 points up to 1,199 points', () => {
    assert.strictEqual(calculateBadgeTier(600), 'The Trailblazer', '600 pts must award The Trailblazer');
    assert.strictEqual(calculateBadgeTier(601), 'The Trailblazer');
    assert.strictEqual(calculateBadgeTier(950), 'The Trailblazer');
    assert.strictEqual(calculateBadgeTier(1199), 'The Trailblazer', '1199 pts must remain The Trailblazer');
  });

  it('2.4: should award "The Changemaker" badge tier at exact boundary of 1,200 points up to 1,999 points', () => {
    assert.strictEqual(calculateBadgeTier(1200), 'The Changemaker', '1200 pts must award The Changemaker');
    assert.strictEqual(calculateBadgeTier(1201), 'The Changemaker');
    assert.strictEqual(calculateBadgeTier(1600), 'The Changemaker');
    assert.strictEqual(calculateBadgeTier(1999), 'The Changemaker', '1999 pts must remain The Changemaker');
  });

  it('2.5: should award "SkillRock Champ" badge tier at 2,000 points and beyond (uncapped)', () => {
    assert.strictEqual(calculateBadgeTier(2000), 'SkillRock Champ', '2000 pts must award SkillRock Champ');
    assert.strictEqual(calculateBadgeTier(2001), 'SkillRock Champ');
    assert.strictEqual(calculateBadgeTier(3500), 'SkillRock Champ');
    assert.strictEqual(calculateBadgeTier(10000), 'SkillRock Champ');
  });

  it('2.6: should return correct cumulative badge array for earned milestones', () => {
    assert.deepStrictEqual(calculateEarnedBadges(100), []);
    assert.deepStrictEqual(calculateEarnedBadges(200), ['The Explorer']);
    assert.deepStrictEqual(calculateEarnedBadges(550), ['The Explorer']);
    assert.deepStrictEqual(calculateEarnedBadges(600), ['The Explorer', 'The Trailblazer']);
    assert.deepStrictEqual(calculateEarnedBadges(1200), [
      'The Explorer',
      'The Trailblazer',
      'The Changemaker',
    ]);
    assert.deepStrictEqual(calculateEarnedBadges(2400), [
      'The Explorer',
      'The Trailblazer',
      'The Changemaker',
      'SkillRock Champ',
    ]);
  });

  it('2.7: should calculate progress metrics towards the next badge tier accurately', () => {
    // Case A: 100 points (midway to The Explorer)
    const p1 = calculateNextBadgeProgress(100);
    assert.strictEqual(p1.currentTier, null);
    assert.strictEqual(p1.nextTier, 'The Explorer');
    assert.strictEqual(p1.pointsNeeded, 100);
    assert.strictEqual(p1.progressPercent, 50);

    // Case B: 400 points (midway between 200 and 600)
    const p2 = calculateNextBadgeProgress(400);
    assert.strictEqual(p2.currentTier, 'The Explorer');
    assert.strictEqual(p2.nextTier, 'The Trailblazer');
    assert.strictEqual(p2.pointsNeeded, 200);
    assert.strictEqual(p2.progressPercent, 50);

    // Case C: 900 points (midway between 600 and 1200)
    const p3 = calculateNextBadgeProgress(900);
    assert.strictEqual(p3.currentTier, 'The Trailblazer');
    assert.strictEqual(p3.nextTier, 'The Changemaker');
    assert.strictEqual(p3.pointsNeeded, 300);
    assert.strictEqual(p3.progressPercent, 50);

    // Case D: 1600 points (midway between 1200 and 2000)
    const p4 = calculateNextBadgeProgress(1600);
    assert.strictEqual(p4.currentTier, 'The Changemaker');
    assert.strictEqual(p4.nextTier, 'SkillRock Champ');
    assert.strictEqual(p4.pointsNeeded, 400);
    assert.strictEqual(p4.progressPercent, 50);

    // Case E: 2500 points (SkillRock Champ pinnacle achieved)
    const p5 = calculateNextBadgeProgress(2500);
    assert.strictEqual(p5.currentTier, 'SkillRock Champ');
    assert.strictEqual(p5.nextTier, null);
    assert.strictEqual(p5.pointsNeeded, 0);
    assert.strictEqual(p5.progressPercent, 100);
  });
});
