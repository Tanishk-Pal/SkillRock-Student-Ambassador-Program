import { Request, Response } from 'express';
import { Ambassador } from '../models/Ambassador';
import { ActivityLog } from '../models/ActivityLog';

/**
 * Escapes characters with special meaning in regular expressions
 * to prevent SyntaxError exceptions (HTTP 500) and ReDoS vulnerabilities
 * when constructing RegExp from untrusted user input.
 *
 * @param str The raw input string
 * @returns The escaped string safe for new RegExp()
 */
export const escapeRegex = (str: string): string => {
  if (typeof str !== 'string') return '';
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

/**
 * GET /api/leaderboard
 * Paginated, ranked listing with multi-field search and filters.
 */
export const getLeaderboard = async (req: Request, res: Response): Promise<Response> => {
  try {
    const {
      page = '1',
      limit = '20',
      search = '',
      college,
      state,
      badge,
      sortBy = 'points',
    } = req.query;

    const pageNum = Math.max(parseInt(page as string, 10) || 1, 1);
    const limitNum = Math.min(Math.max(parseInt(limit as string, 10) || 20, 1), 100);
    const skip = (pageNum - 1) * limitNum;

    const filter: Record<string, any> = {};

    // Text search on name, college, city
    if (search && typeof search === 'string' && search.trim() !== '') {
      const searchRegex = new RegExp(escapeRegex(search.trim()), 'i');
      filter.$or = [
        { name: searchRegex },
        { college: searchRegex },
        { city: searchRegex },
      ];
    }

    // Specific filters
    if (college && typeof college === 'string' && college.trim() !== '') {
      filter.college = new RegExp(escapeRegex(college.trim()), 'i');
    }

    if (state && typeof state === 'string' && state.trim() !== '') {
      filter.state = new RegExp(escapeRegex(state.trim()), 'i');
    }

    // Badge filter (matches ambassadors possessing the badge in their earned badges list)
    if (badge && typeof badge === 'string' && badge.trim() !== '') {
      filter.badges = badge.trim();
    }

    // Dynamic sort configuration
    let sortCriteria: Record<string, any> = {
      totalPoints: -1,
      activitiesCount: -1,
      joinedAt: 1,
      _id: 1,
    };

    if (sortBy === 'recent') {
      sortCriteria = { updatedAt: -1, joinedAt: -1 };
    } else if (sortBy === 'rank') {
      sortCriteria = { totalPoints: -1 };
    }

    const [ambassadors, totalAmbassadors] = await Promise.all([
      Ambassador.find(filter)
        .sort(sortCriteria)
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Ambassador.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(totalAmbassadors / limitNum) || 1;

    // Transform response items adhering strictly to PROJECT.md contract
    const formattedAmbassadors = ambassadors.map((amb: any, index: number) => ({
      id: amb._id.toString(),
      rank: amb.currentRank || skip + index + 1,
      name: amb.name,
      avatar:
        amb.avatar ||
        `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(amb.name)}`,
      college: amb.college,
      city: amb.city,
      state: amb.state,
      totalPoints: amb.totalPoints,
      badgeTier: amb.badgeTier || null,
      badges: amb.badges || [],
      activitiesCount: amb.activitiesCount || 0,
      recentActivity: amb.recentActivity || 'Completed Campus Activity',
    }));

    return res.json({
      success: true,
      data: {
        ambassadors: formattedAmbassadors,
        pagination: {
          currentPage: pageNum,
          totalPages,
          totalAmbassadors,
          hasNext: pageNum < totalPages,
          hasPrev: pageNum > 1,
        },
      },
    });
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch leaderboard data',
    });
  }
};

/**
 * GET /api/leaderboard/stats
 * Aggregate program metrics for the stats banner and homepage preview.
 */
export const getLeaderboardStats = async (_req: Request, res: Response): Promise<Response> => {
  try {
    const [totalAmbassadors, pointsAgg, totalEvents, badgeCounts] = await Promise.all([
      Ambassador.countDocuments(),
      Ambassador.aggregate([
        { $group: { _id: null, totalPoints: { $sum: '$totalPoints' } } },
      ]),
      Ambassador.aggregate([
        { $group: { _id: null, totalActivities: { $sum: '$activitiesCount' } } },
      ]),
      Ambassador.aggregate([
        {
          $facet: {
            skillRockChamp: [{ $match: { badges: 'SkillRock Champ' } }, { $count: 'count' }],
            theChangemaker: [{ $match: { badges: 'The Changemaker' } }, { $count: 'count' }],
            theTrailblazer: [{ $match: { badges: 'The Trailblazer' } }, { $count: 'count' }],
            theExplorer: [{ $match: { badges: 'The Explorer' } }, { $count: 'count' }],
          },
        },
      ]),
    ]);

    const totalPointsAwarded = pointsAgg[0]?.totalPoints || 0;
    const totalEventsHosted = totalEvents[0]?.totalActivities || 0;

    const topBadgeHolders = {
      skillRockChamp: badgeCounts[0]?.skillRockChamp[0]?.count || 0,
      theChangemaker: badgeCounts[0]?.theChangemaker[0]?.count || 0,
      theTrailblazer: badgeCounts[0]?.theTrailblazer[0]?.count || 0,
      theExplorer: badgeCounts[0]?.theExplorer[0]?.count || 0,
    };

    return res.json({
      success: true,
      data: {
        totalAmbassadors,
        totalPointsAwarded,
        totalEventsHosted,
        topBadgeHolders,
      },
    });
  } catch (error) {
    console.error('Error fetching leaderboard stats:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch leaderboard statistics',
    });
  }
};

/**
 * GET /api/leaderboard/:id
 * Retrieve a single ambassador's complete profile and recent activity history.
 */
export const getAmbassadorById = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;

    // Validate MongoDB ObjectId
    if (!id || !/^[0-9a-fA-F]{24}$/.test(id)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid ambassador ID format',
      });
    }

    const ambassador = await Ambassador.findById(id).lean();
    if (!ambassador) {
      return res.status(404).json({
        success: false,
        error: 'Ambassador not found',
      });
    }

    // Fetch up to 10 most recent verified activities
    const recentActivitiesDocs = await ActivityLog.find({
      ambassadorId: ambassador._id,
      status: 'verified',
    })
      .sort({ verifiedAt: -1 })
      .limit(10)
      .lean();

    const recentActivities = recentActivitiesDocs.map((act: any) => ({
      id: act._id.toString(),
      activityType: act.activityType,
      activityName: act.activityName || act.title || 'Campus Activity',
      pointsAwarded: act.pointsAwarded,
      description: act.description,
      verifiedAt: act.verifiedAt,
    }));

    return res.json({
      success: true,
      data: {
        id: ambassador._id.toString(),
        rank: ambassador.currentRank || 1,
        name: ambassador.name,
        email: ambassador.email,
        college: ambassador.college,
        city: ambassador.city,
        state: ambassador.state,
        avatar: ambassador.avatar,
        totalPoints: ambassador.totalPoints,
        badgeTier: ambassador.badgeTier || null,
        badges: ambassador.badges || [],
        activitiesCount: ambassador.activitiesCount || 0,
        recentActivity: ambassador.recentActivity,
        certificateStatus: ambassador.certificateStatus || 'pending',
        certificateId: ambassador.certificateId || null,
        joinedAt: ambassador.joinedAt,
        recentActivities,
      },
    });
  } catch (error) {
    console.error('Error fetching ambassador by id:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch ambassador details',
    });
  }
};
