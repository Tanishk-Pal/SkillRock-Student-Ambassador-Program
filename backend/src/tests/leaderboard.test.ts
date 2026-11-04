import { describe, it, before, after } from 'node:test';
import assert from 'node:assert';
import { getLeaderboard, getLeaderboardStats } from '../controllers/leaderboardController';
import { Ambassador } from '../models/Ambassador';
import { createMockRequest, createMockResponse } from './mockHelper';

// Fixture dataset representing realistic student ambassadors
const FIXTURE_AMBASSADORS = [
  {
    _id: '663e8a1f4b2c1d0012a4b801',
    name: 'Aarav Patel',
    email: 'aarav.patel@iitb.ac.in',
    college: 'IIT Bombay',
    city: 'Mumbai',
    state: 'Maharashtra',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aarav',
    totalPoints: 2450,
    currentRank: 1,
    badgeTier: 'SkillRock Champ',
    badges: ['The Explorer', 'The Trailblazer', 'The Changemaker', 'SkillRock Champ'],
    activitiesCount: 18,
    recentActivity: 'Hosted Campus AI Study Jam',
    joinedAt: new Date('2026-01-01T00:00:00Z'),
  },
  {
    _id: '663e8a1f4b2c1d0012a4b802',
    name: 'Priya Sharma',
    email: 'priya.sharma@pilani.bits-pilani.ac.in',
    college: 'BITS Pilani',
    city: 'Pilani',
    state: 'Rajasthan',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Priya',
    totalPoints: 1850,
    currentRank: 2,
    badgeTier: 'The Changemaker',
    badges: ['The Explorer', 'The Trailblazer', 'The Changemaker'],
    activitiesCount: 15,
    recentActivity: 'Led Web Dev Workshop',
    joinedAt: new Date('2026-01-05T00:00:00Z'),
  },
  {
    _id: '663e8a1f4b2c1d0012a4b803',
    name: 'Rohan Verma',
    email: 'rohan.verma@iitd.ac.in',
    college: 'IIT Delhi',
    city: 'New Delhi',
    state: 'Delhi',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rohan',
    totalPoints: 950,
    currentRank: 3,
    badgeTier: 'The Trailblazer',
    badges: ['The Explorer', 'The Trailblazer'],
    activitiesCount: 7,
    recentActivity: 'Onboarded 10 Students',
    joinedAt: new Date('2026-01-10T00:00:00Z'),
  },
  {
    _id: '663e8a1f4b2c1d0012a4b804',
    name: 'Ananya Iyer',
    email: 'ananya.iyer@nitt.edu',
    college: 'NIT Trichy',
    city: 'Tiruchirappalli',
    state: 'Tamil Nadu',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ananya',
    totalPoints: 350,
    currentRank: 4,
    badgeTier: 'The Explorer',
    badges: ['The Explorer'],
    activitiesCount: 3,
    recentActivity: 'Published Technical Article',
    joinedAt: new Date('2026-01-15T00:00:00Z'),
  },
];

// Helper to filter fixtures in accordance with Mongoose query filters
function matchesFilter(amb: any, filter: Record<string, any>): boolean {
  if (!filter || Object.keys(filter).length === 0) return true;

  // Text search on name, college, city ($or clause)
  if (filter.$or && Array.isArray(filter.$or)) {
    const orMatched = filter.$or.some((clause: any) => {
      if (clause.name instanceof RegExp && clause.name.test(amb.name)) return true;
      if (clause.college instanceof RegExp && clause.college.test(amb.college)) return true;
      if (clause.city instanceof RegExp && clause.city.test(amb.city)) return true;
      return false;
    });
    if (!orMatched) return false;
  }

  // Specific college filter
  if (filter.college) {
    if (filter.college instanceof RegExp) {
      if (!filter.college.test(amb.college)) return false;
    } else if (amb.college !== filter.college) {
      return false;
    }
  }

  // Specific state filter
  if (filter.state) {
    if (filter.state instanceof RegExp) {
      if (!filter.state.test(amb.state)) return false;
    } else if (amb.state !== filter.state) {
      return false;
    }
  }

  // Badge filter
  if (filter.badges) {
    if (!amb.badges || !amb.badges.includes(filter.badges)) {
      return false;
    }
  }

  return true;
}

// Preserve original Mongoose model functions
const origFind = Ambassador.find;
const origCountDocuments = Ambassador.countDocuments;
const origAggregate = Ambassador.aggregate;

function setupLeaderboardMocks() {
  (Ambassador as any).find = function (filter: any = {}) {
    let skipCount = 0;
    let limitCount = 20;
    let sortCriteria: any = null;

    const queryChain: any = {
      sort(criteria: any) {
        sortCriteria = criteria;
        return queryChain;
      },
      skip(n: number) {
        skipCount = n;
        return queryChain;
      },
      limit(n: number) {
        limitCount = n;
        return queryChain;
      },
      lean() {
        let results = FIXTURE_AMBASSADORS.filter((a) => matchesFilter(a, filter));
        if (sortCriteria) {
          if (sortCriteria.updatedAt) {
            results.sort((a, b) => b.joinedAt.getTime() - a.joinedAt.getTime());
          } else {
            results.sort((a, b) => {
              if (b.totalPoints !== a.totalPoints) return b.totalPoints - a.totalPoints;
              if (b.activitiesCount !== a.activitiesCount) return b.activitiesCount - a.activitiesCount;
              return a.joinedAt.getTime() - b.joinedAt.getTime();
            });
          }
        }
        return Promise.resolve(results.slice(skipCount, skipCount + limitCount));
      },
    };
    return queryChain;
  };

  (Ambassador as any).countDocuments = function (filter: any = {}) {
    const count = FIXTURE_AMBASSADORS.filter((a) => matchesFilter(a, filter)).length;
    return Promise.resolve(count);
  };

  (Ambassador as any).aggregate = function (pipeline: any[]) {
    if (pipeline[0]?.$group?.totalPoints) {
      const sum = FIXTURE_AMBASSADORS.reduce((acc, a) => acc + a.totalPoints, 0);
      return Promise.resolve([{ _id: null, totalPoints: sum }]);
    }
    if (pipeline[0]?.$group?.totalActivities) {
      const sum = FIXTURE_AMBASSADORS.reduce((acc, a) => acc + a.activitiesCount, 0);
      return Promise.resolve([{ _id: null, totalActivities: sum }]);
    }
    if (pipeline[0]?.$facet) {
      return Promise.resolve([
        {
          skillRockChamp: [{ count: FIXTURE_AMBASSADORS.filter((a) => a.badges.includes('SkillRock Champ')).length }],
          theChangemaker: [{ count: FIXTURE_AMBASSADORS.filter((a) => a.badges.includes('The Changemaker')).length }],
          theTrailblazer: [{ count: FIXTURE_AMBASSADORS.filter((a) => a.badges.includes('The Trailblazer')).length }],
          theExplorer: [{ count: FIXTURE_AMBASSADORS.filter((a) => a.badges.includes('The Explorer')).length }],
        },
      ]);
    }
    return Promise.resolve([]);
  };
}

function restoreLeaderboardMocks() {
  (Ambassador as any).find = origFind;
  (Ambassador as any).countDocuments = origCountDocuments;
  (Ambassador as any).aggregate = origAggregate;
}

describe('Suite 4: Leaderboard Controller, Search, Pagination & Filtering', () => {
  before(() => {
    setupLeaderboardMocks();
  });

  after(() => {
    restoreLeaderboardMocks();
  });

  it('4.1: should return default paginated list of ambassadors with standard envelope', async () => {
    const req = createMockRequest({});
    const res = createMockResponse();

    await getLeaderboard(req, res as any);

    assert.strictEqual(res.statusCode, 200);
    assert.strictEqual(res.jsonData.success, true);

    const { ambassadors, pagination } = res.jsonData.data;
    assert.strictEqual(ambassadors.length, 4);
    assert.strictEqual(pagination.currentPage, 1);
    assert.strictEqual(pagination.totalAmbassadors, 4);
    assert.strictEqual(pagination.hasNext, false);
    assert.strictEqual(pagination.hasPrev, false);

    const first = ambassadors[0];
    assert.strictEqual(first.name, 'Aarav Patel');
    assert.strictEqual(first.rank, 1);
    assert.strictEqual(first.badgeTier, 'SkillRock Champ');
    assert.strictEqual(first.totalPoints, 2450);
  });

  it('4.2: should paginate results correctly when custom page and limit are provided', async () => {
    const req = createMockRequest({ page: '2', limit: '2' });
    const res = createMockResponse();

    await getLeaderboard(req, res as any);

    assert.strictEqual(res.statusCode, 200);
    const { ambassadors, pagination } = res.jsonData.data;
    assert.strictEqual(ambassadors.length, 2);
    assert.strictEqual(pagination.currentPage, 2);
    assert.strictEqual(pagination.totalPages, 2);
    assert.strictEqual(pagination.hasPrev, true);
    assert.strictEqual(pagination.hasNext, false);
    assert.strictEqual(ambassadors[0].name, 'Rohan Verma');
  });

  it('4.3: should search ambassadors case-insensitively by name, college, and city', async () => {
    // Search by name
    const reqName = createMockRequest({ search: 'priya' });
    const resName = createMockResponse();
    await getLeaderboard(reqName, resName as any);
    assert.strictEqual(resName.statusCode, 200);
    assert.strictEqual(resName.jsonData.data.ambassadors.length, 1);
    assert.strictEqual(resName.jsonData.data.ambassadors[0].name, 'Priya Sharma');

    // Search by college
    const reqCollege = createMockRequest({ search: 'IIT' });
    const resCollege = createMockResponse();
    await getLeaderboard(reqCollege, resCollege as any);
    assert.strictEqual(resCollege.statusCode, 200);
    assert.strictEqual(resCollege.jsonData.data.ambassadors.length, 2);

    // Search by city
    const reqCity = createMockRequest({ search: 'Tiruchirappalli' });
    const resCity = createMockResponse();
    await getLeaderboard(reqCity, resCity as any);
    assert.strictEqual(resCity.statusCode, 200);
    assert.strictEqual(resCity.jsonData.data.ambassadors.length, 1);
    assert.strictEqual(resCity.jsonData.data.ambassadors[0].name, 'Ananya Iyer');

    // Non-matching search
    const reqNone = createMockRequest({ search: 'NonExistentCollegeXYZ' });
    const resNone = createMockResponse();
    await getLeaderboard(reqNone, resNone as any);
    assert.strictEqual(resNone.statusCode, 200);
    assert.strictEqual(resNone.jsonData.data.ambassadors.length, 0);
  });

  it('4.4: should filter ambassadors by college parameter', async () => {
    const req = createMockRequest({ college: 'BITS Pilani' });
    const res = createMockResponse();

    await getLeaderboard(req, res as any);

    assert.strictEqual(res.statusCode, 200);
    assert.strictEqual(res.jsonData.data.ambassadors.length, 1);
    assert.strictEqual(res.jsonData.data.ambassadors[0].college, 'BITS Pilani');
  });

  it('4.5: should filter ambassadors by badge tier', async () => {
    // Filter by elite badge 'SkillRock Champ'
    const reqChamp = createMockRequest({ badge: 'SkillRock Champ' });
    const resChamp = createMockResponse();
    await getLeaderboard(reqChamp, resChamp as any);
    assert.strictEqual(resChamp.statusCode, 200);
    assert.strictEqual(resChamp.jsonData.data.ambassadors.length, 1);
    assert.strictEqual(resChamp.jsonData.data.ambassadors[0].name, 'Aarav Patel');

    // Filter by foundational badge 'The Explorer'
    const reqExplorer = createMockRequest({ badge: 'The Explorer' });
    const resExplorer = createMockResponse();
    await getLeaderboard(reqExplorer, resExplorer as any);
    assert.strictEqual(resExplorer.statusCode, 200);
    assert.strictEqual(resExplorer.jsonData.data.ambassadors.length, 4);
  });

  it('4.6: should compute aggregated leaderboard stats accurately using real getLeaderboardStats controller', async () => {
    const req = createMockRequest();
    const res = createMockResponse();

    await getLeaderboardStats(req, res as any);

    assert.strictEqual(res.statusCode, 200);
    assert.strictEqual(res.jsonData.success, true);

    const stats = res.jsonData.data;
    assert.strictEqual(stats.totalAmbassadors, 4);
    assert.strictEqual(stats.totalPointsAwarded, 5600);
    assert.strictEqual(stats.totalEventsHosted, 43);
    assert.strictEqual(stats.topBadgeHolders.skillRockChamp, 1);
    assert.strictEqual(stats.topBadgeHolders.theChangemaker, 2);
    assert.strictEqual(stats.topBadgeHolders.theTrailblazer, 3);
    assert.strictEqual(stats.topBadgeHolders.theExplorer, 4);
  });

  it('4.7: should handle special characters search="C++" without throwing SyntaxError and return HTTP 200', async () => {
    const req = createMockRequest({ search: 'C++' });
    const res = createMockResponse();

    await getLeaderboard(req, res as any);

    assert.strictEqual(res.statusCode, 200);
    assert.strictEqual(res.jsonData.success, true);
    assert.strictEqual(Array.isArray(res.jsonData.data.ambassadors), true);
  });

  it('4.8: should handle unbalanced regex characters search="(" without throwing SyntaxError and return HTTP 200', async () => {
    const req = createMockRequest({ search: '(' });
    const res = createMockResponse();

    await getLeaderboard(req, res as any);

    assert.strictEqual(res.statusCode, 200);
    assert.strictEqual(res.jsonData.success, true);
    assert.strictEqual(Array.isArray(res.jsonData.data.ambassadors), true);
  });

  it('4.9: should handle college filter with parenthesis college="IIT (BHU)" without throwing SyntaxError and return HTTP 200', async () => {
    const req = createMockRequest({ college: 'IIT (BHU)' });
    const res = createMockResponse();

    await getLeaderboard(req, res as any);

    assert.strictEqual(res.statusCode, 200);
    assert.strictEqual(res.jsonData.success, true);
    assert.strictEqual(Array.isArray(res.jsonData.data.ambassadors), true);
  });

  it('4.10: should handle additional regex metacharacters search="[" and search="\\" safely returning HTTP 200', async () => {
    const reqBracket = createMockRequest({ search: '[' });
    const resBracket = createMockResponse();
    await getLeaderboard(reqBracket, resBracket as any);
    assert.strictEqual(resBracket.statusCode, 200);
    assert.strictEqual(resBracket.jsonData.success, true);

    const reqSlash = createMockRequest({ search: '\\' });
    const resSlash = createMockResponse();
    await getLeaderboard(reqSlash, resSlash as any);
    assert.strictEqual(resSlash.statusCode, 200);
    assert.strictEqual(resSlash.jsonData.success, true);
  });
});
