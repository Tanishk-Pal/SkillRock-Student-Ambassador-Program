import { Ambassador, IAmbassador, BadgeTier } from '../models/Ambassador';
import { ActivityLog, ActivityType } from '../models/ActivityLog';

// Re-export ActivityType & BadgeTier for convenience
export { ActivityType, BadgeTier };

export interface BadgeDefinition {
  tier: BadgeTier;
  minPoints: number;
  description: string;
}

export interface RankableAmbassador {
  _id?: any;
  totalPoints: number;
  activitiesCount: number;
  joinedAt: Date | string;
}

export interface NextBadgeProgress {
  currentTier: BadgeTier | null;
  nextTier: BadgeTier | null;
  currentPoints: number;
  nextTierMinPoints: number | null;
  pointsNeeded: number;
  progressPercent: number;
}

export interface ProgramStatsData {
  totalAmbassadors: number;
  totalPointsAwarded: number;
  totalEventsHosted: number;
  topBadgeHolders: {
    skillRockChamp: number;
    theChangemaker: number;
    theTrailblazer: number;
    theExplorer: number;
  };
}

// ─── Constants ─────────────────────────────────────────────────────────

export const ACTIVITY_POINTS: Record<ActivityType, number> = {
  study_jam: 150,
  workshop: 120,
  student_onboarded: 20,
  student_onboarding: 20,
  hackathon_mentored: 250,
  hackathon: 250,
  tech_blog: 100,
  tech_article: 100,
  project_showcase: 180,
  campus_demo: 180,
  peer_mentorship: 100,
};

export const ACTIVITY_LABELS: Record<string, string> = {
  study_jam: 'Campus Study Jam',
  workshop: 'Technical Workshop',
  student_onboarded: 'Student Onboarded',
  student_onboarding: 'Student Onboarding',
  hackathon_mentored: 'Hackathon Mentored',
  hackathon: 'Campus Hackathon',
  tech_blog: 'Tech Blog / Article',
  tech_article: 'Technical Article',
  project_showcase: 'Project Showcase',
  campus_demo: 'Campus Demo',
  peer_mentorship: 'Peer Mentorship',
};

export const BADGE_TIERS: BadgeDefinition[] = [
  {
    tier: 'The Explorer',
    minPoints: 200,
    description: 'Initiated campus presence and peer learning circles',
  },
  {
    tier: 'The Trailblazer',
    minPoints: 600,
    description: 'Accelerated campus engagement with workshops and student onboarding',
  },
  {
    tier: 'The Changemaker',
    minPoints: 1200,
    description: 'Demonstrated leadership across multiple high-impact campus tech initiatives',
  },
  {
    tier: 'SkillRock Champ',
    minPoints: 2000,
    description: 'Elite student ambassador driving sustained impact and peer excellence',
  },
];

// ─── Pure Business Logic Functions ────────────────────────────────────

/**
 * Returns the points awarded for a given activity type.
 */
export function getActivityPoints(type: ActivityType): number {
  if (!type || typeof type !== 'string') return 0;
  return ACTIVITY_POINTS[type] || 0;
}

/**
 * Normalizes raw string input to valid ActivityType or null.
 */
export function normalizeActivityType(raw: string): ActivityType | null {
  if (!raw || typeof raw !== 'string') return null;
  const cleaned = raw.trim().toLowerCase().replace(/[\s-]+/g, '_');
  if (cleaned in ACTIVITY_POINTS) {
    return cleaned as ActivityType;
  }
  return null;
}

/**
 * Calculates the highest qualified badge tier based on total points.
 * Returns null if points < 200.
 */
export function calculateBadgeTier(points: number): BadgeTier | null {
  if (points >= 2000) return 'SkillRock Champ';
  if (points >= 1200) return 'The Changemaker';
  if (points >= 600) return 'The Trailblazer';
  if (points >= 200) return 'The Explorer';
  return null;
}

/**
 * Returns all cumulative badges earned for a given point total.
 */
export function calculateEarnedBadges(points: number): BadgeTier[] {
  const earned: BadgeTier[] = [];
  if (points >= 200) earned.push('The Explorer');
  if (points >= 600) earned.push('The Trailblazer');
  if (points >= 1200) earned.push('The Changemaker');
  if (points >= 2000) earned.push('SkillRock Champ');
  return earned;
}

/**
 * Calculates progress towards the next badge tier for UI progress indicators.
 */
export function calculateNextBadgeProgress(points: number): NextBadgeProgress {
  if (points < 200) {
    return {
      currentTier: null,
      nextTier: 'The Explorer',
      currentPoints: points,
      nextTierMinPoints: 200,
      pointsNeeded: 200 - points,
      progressPercent: Math.min(Math.max(Math.floor((points / 200) * 100), 0), 100),
    };
  }

  if (points < 600) {
    return {
      currentTier: 'The Explorer',
      nextTier: 'The Trailblazer',
      currentPoints: points,
      nextTierMinPoints: 600,
      pointsNeeded: 600 - points,
      progressPercent: Math.min(Math.max(Math.floor(((points - 200) / 400) * 100), 0), 100),
    };
  }

  if (points < 1200) {
    return {
      currentTier: 'The Trailblazer',
      nextTier: 'The Changemaker',
      currentPoints: points,
      nextTierMinPoints: 1200,
      pointsNeeded: 1200 - points,
      progressPercent: Math.min(Math.max(Math.floor(((points - 600) / 600) * 100), 0), 100),
    };
  }

  if (points < 2000) {
    return {
      currentTier: 'The Changemaker',
      nextTier: 'SkillRock Champ',
      currentPoints: points,
      nextTierMinPoints: 2000,
      pointsNeeded: 2000 - points,
      progressPercent: Math.min(Math.max(Math.floor(((points - 1200) / 800) * 100), 0), 100),
    };
  }

  return {
    currentTier: 'SkillRock Champ',
    nextTier: null,
    currentPoints: points,
    nextTierMinPoints: null,
    pointsNeeded: 0,
    progressPercent: 100,
  };
}

/**
 * Determines 4-month certificate eligibility based on points and activities.
 */
export function checkCertificateEligibility(
  totalPoints: number,
  activitiesCount: number
): { isEligible: boolean; status: 'pending' | 'eligible' } {
  if (totalPoints >= 200 && activitiesCount >= 2) {
    return { isEligible: true, status: 'eligible' };
  }
  return { isEligible: false, status: 'pending' };
}

/**
 * 4-step lexicographical comparator implementing strict tie-breaking logic:
 * 1. totalPoints (descending)
 * 2. activitiesCount (descending)
 * 3. joinedAt (ascending: earlier joins first)
 * 4. _id fallback (ascending)
 */
export function compareAmbassadors<T extends RankableAmbassador>(a: T, b: T): number {
  if (b.totalPoints !== a.totalPoints) {
    return b.totalPoints - a.totalPoints;
  }
  if (b.activitiesCount !== a.activitiesCount) {
    return b.activitiesCount - a.activitiesCount;
  }
  const timeA = new Date(a.joinedAt).getTime();
  const timeB = new Date(b.joinedAt).getTime();
  if (timeA !== timeB) {
    return timeA - timeB;
  }
  return String(a._id || '').localeCompare(String(b._id || ''));
}

/**
 * Sorts an array of ambassadors using tie-breaking logic and assigns ranks (1-indexed).
 */
export function assignRanks<T extends RankableAmbassador>(ambassadors: T[]): (T & { rank: number })[] {
  const sorted = [...ambassadors].sort(compareAmbassadors);
  return sorted.map((amb, index) => ({
    ...amb,
    rank: index + 1,
  }));
}

// ─── Database Operations & Synchronization ────────────────────────────

/**
 * Recalculates totalPoints, activitiesCount, badgeTier, and badges for an ambassador
 * from their verified ActivityLog entries, and updates the Ambassador document.
 */
export async function recalculateAmbassador(ambassadorId: string): Promise<IAmbassador | null> {
  const logs = await ActivityLog.find({ ambassadorId, status: 'verified' });
  const totalPoints = logs.reduce((sum, log) => sum + (log.pointsAwarded || 0), 0);
  const activitiesCount = logs.length;
  const badgeTier = calculateBadgeTier(totalPoints);
  const badges = calculateEarnedBadges(totalPoints);
  const recentLog = logs.sort((a, b) => new Date(b.verifiedAt).getTime() - new Date(a.verifiedAt).getTime())[0];
  const recentActivity = recentLog ? (recentLog.activityName || recentLog.title || recentLog.description) : undefined;

  const updatePayload: Record<string, any> = {
    totalPoints,
    activitiesCount,
    badgeTier,
    badges,
  };

  if (recentActivity) {
    updatePayload.recentActivity = recentActivity;
  }

  // Update certificate status if eligible and not already issued
  const currentDoc = await Ambassador.findById(ambassadorId);
  if (currentDoc && currentDoc.certificateStatus !== 'issued') {
    const { status } = checkCertificateEligibility(totalPoints, activitiesCount);
    updatePayload.certificateStatus = status;
  }

  return Ambassador.findByIdAndUpdate(ambassadorId, updatePayload, { new: true });
}

/**
 * Synchronizes the `currentRank` field across all ambassadors in the database
 * according to the canonical tie-breaking sort order.
 */
export async function recalculateAllRanks(): Promise<void> {
  const ambassadors = await Ambassador.find()
    .sort({ totalPoints: -1, activitiesCount: -1, joinedAt: 1, _id: 1 })
    .select('_id currentRank');

  const bulkOps = ambassadors.map((amb, index) => ({
    updateOne: {
      filter: { _id: amb._id },
      update: { $set: { currentRank: index + 1 } },
    },
  }));

  if (bulkOps.length > 0) {
    await Ambassador.bulkWrite(bulkOps);
  }
}
