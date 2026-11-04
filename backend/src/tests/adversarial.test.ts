import { describe, it, before, after, beforeEach } from 'node:test';
import assert from 'node:assert';
import { Request, Response } from 'express';
import { getLeaderboard, getLeaderboardStats, getAmbassadorById, escapeRegex } from '../controllers/leaderboardController';
import { verifyCertificate } from '../routes/certificates';
import { Ambassador } from '../models/Ambassador';
import { ActivityLog } from '../models/ActivityLog';

// Directly reference the exported verifyCertificate handler
const getCertificateHandler = verifyCertificate;

// Realistic fixture dataset for empirical tests
const SEED_AMBASSADORS = [
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
    certificateStatus: 'issued',
    certificateId: 'SSAP-2026-CERT-001',
    certificateIssuedAt: new Date('2026-04-15T10:00:00Z'),
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
    certificateStatus: 'eligible',
    certificateId: 'SSAP-2026-CERT-002',
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
    certificateStatus: 'eligible',
    certificateId: 'SSAP-2026-CERT-003',
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
    certificateStatus: 'pending',
    joinedAt: new Date('2026-01-15T00:00:00Z'),
  },
];

// Helper to create mock Express Request and Response objects
function createMockReqRes(options: {
  query?: Record<string, any>;
  params?: Record<string, any>;
  body?: Record<string, any>;
} = {}) {
  const req = {
    query: options.query || {},
    params: options.params || {},
    body: options.body || {},
  } as unknown as Request;

  let statusCode = 200;
  let responseData: any = null;

  const res = {
    status(code: number) {
      statusCode = code;
      return this;
    },
    json(data: any) {
      responseData = data;
      return this;
    },
    getStatusCode() {
      return statusCode;
    },
    getJSON() {
      return responseData;
    },
  } as unknown as Response & { getStatusCode(): number; getJSON(): any };

  return { req, res };
}

// Variables to capture Mongoose call arguments
let lastFindFilter: any = null;
let lastSortCriteria: any = null;
let lastSkip: number = 0;
let lastLimit: number = 0;
let lastCountFilter: any = null;
let lastFindOneFilter: any = null;

// Save original Mongoose functions
const origFind = Ambassador.find;
const origCountDocuments = Ambassador.countDocuments;
const origAggregate = Ambassador.aggregate;
const origFindById = Ambassador.findById;
const origFindOne = Ambassador.findOne;
const origActivityFind = ActivityLog.find;

function setupMongooseMocks() {
  (Ambassador as any).find = function (filter: any) {
    lastFindFilter = filter;
    const queryObj: any = {
      sort(criteria: any) {
        lastSortCriteria = criteria;
        return queryObj;
      },
      skip(n: number) {
        lastSkip = n;
        return queryObj;
      },
      limit(n: number) {
        lastLimit = n;
        return queryObj;
      },
      lean() {
        // Return filtered fixtures
        let results = [...SEED_AMBASSADORS];
        if (filter.badges) {
          results = results.filter((a) => a.badges.includes(filter.badges));
        }
        return Promise.resolve(results.slice(lastSkip, lastSkip + lastLimit));
      },
    };
    return queryObj;
  };

  (Ambassador as any).countDocuments = function (filter: any) {
    lastCountFilter = filter;
    let count = SEED_AMBASSADORS.length;
    if (filter && filter.badges) {
      count = SEED_AMBASSADORS.filter((a) => a.badges.includes(filter.badges)).length;
    }
    return Promise.resolve(count);
  };

  (Ambassador as any).aggregate = function (pipeline: any[]) {
    // Check if totalPoints group
    if (pipeline[0]?.$group?.totalPoints) {
      const sum = SEED_AMBASSADORS.reduce((acc, a) => acc + a.totalPoints, 0);
      return Promise.resolve([{ _id: null, totalPoints: sum }]);
    }
    // Check if totalActivities group
    if (pipeline[0]?.$group?.totalActivities) {
      const sum = SEED_AMBASSADORS.reduce((acc, a) => acc + a.activitiesCount, 0);
      return Promise.resolve([{ _id: null, totalActivities: sum }]);
    }
    // Check if facet for badges
    if (pipeline[0]?.$facet) {
      return Promise.resolve([
        {
          skillRockChamp: [{ count: 1 }],
          theChangemaker: [{ count: 2 }],
          theTrailblazer: [{ count: 3 }],
          theExplorer: [{ count: 4 }],
        },
      ]);
    }
    return Promise.resolve([]);
  };

  (Ambassador as any).findById = function (id: string) {
    const doc = SEED_AMBASSADORS.find((a) => a._id === id);
    return {
      lean() {
        return Promise.resolve(doc || null);
      },
    };
  };

  (Ambassador as any).findOne = function (filter: any) {
    lastFindOneFilter = filter;
    const doc = SEED_AMBASSADORS.find((a) => {
      let matches = true;
      if (filter.certificateId && a.certificateId !== filter.certificateId) {
        matches = false;
      }
      if (filter.certificateStatus?.$in && !filter.certificateStatus.$in.includes(a.certificateStatus)) {
        matches = false;
      }
      return matches;
    });
    return {
      lean() {
        return Promise.resolve(doc || null);
      },
    };
  };

  (ActivityLog as any).find = function () {
    return {
      sort() {
        return {
          limit() {
            return {
              lean() {
                return Promise.resolve([
                  {
                    _id: 'act1',
                    activityType: 'study_jam',
                    activityName: 'Hosted Campus AI Study Jam',
                    pointsAwarded: 150,
                    description: 'Interactive session with 40 students',
                    verifiedAt: new Date('2026-03-20'),
                  },
                ]);
              },
            };
          },
        };
      },
    };
  };
}

function restoreMongooseMocks() {
  (Ambassador as any).find = origFind;
  (Ambassador as any).countDocuments = origCountDocuments;
  (Ambassador as any).aggregate = origAggregate;
  (Ambassador as any).findById = origFindById;
  (Ambassador as any).findOne = origFindOne;
  (ActivityLog as any).find = origActivityFind;
}

describe('Adversarial Test Suite: SSAP Backend Endpoints & Controllers', () => {
  before(() => {
    setupMongooseMocks();
  });

  after(() => {
    restoreMongooseMocks();
  });

  beforeEach(() => {
    lastFindFilter = null;
    lastSortCriteria = null;
    lastSkip = 0;
    lastLimit = 0;
    lastCountFilter = null;
    lastFindOneFilter = null;
  });

  // ──────────────────────────────────────────────────────────────────────────
  // 1. Pagination & Boundary Stress Testing
  // ──────────────────────────────────────────────────────────────────────────
  describe('Suite 1: Pagination Parameter Stress Testing', () => {
    it('1.1: Negative page numbers (page=-5) should clamp to page 1', async () => {
      const { req, res } = createMockReqRes({ query: { page: '-5', limit: '20' } });
      await getLeaderboard(req, res);

      assert.strictEqual(res.getStatusCode(), 200);
      const json = res.getJSON();
      assert.strictEqual(json.data.pagination.currentPage, 1);
      assert.strictEqual(lastSkip, 0, 'Skip should be 0 for page 1');
    });

    it('1.2: Zero page number (page=0) should clamp to page 1', async () => {
      const { req, res } = createMockReqRes({ query: { page: '0', limit: '20' } });
      await getLeaderboard(req, res);

      assert.strictEqual(res.getStatusCode(), 200);
      const json = res.getJSON();
      assert.strictEqual(json.data.pagination.currentPage, 1);
      assert.strictEqual(lastSkip, 0);
    });

    it('1.3: Non-numeric page (page="abc") should fallback to page 1', async () => {
      const { req, res } = createMockReqRes({ query: { page: 'abc', limit: '10' } });
      await getLeaderboard(req, res);

      assert.strictEqual(res.getStatusCode(), 200);
      const json = res.getJSON();
      assert.strictEqual(json.data.pagination.currentPage, 1);
      assert.strictEqual(lastSkip, 0);
    });

    it('1.4: Massive page (page=999999) should compute skip correctly without crashing', async () => {
      const { req, res } = createMockReqRes({ query: { page: '999999', limit: '20' } });
      await getLeaderboard(req, res);

      assert.strictEqual(res.getStatusCode(), 200);
      const json = res.getJSON();
      assert.strictEqual(json.data.pagination.currentPage, 999999);
      assert.strictEqual(json.data.pagination.hasNext, false);
      assert.strictEqual(json.data.pagination.hasPrev, true);
      assert.strictEqual(lastSkip, (999999 - 1) * 20);
    });

    it('1.5: Massive limit (limit=999999) should be capped to maximum 100', async () => {
      const { req, res } = createMockReqRes({ query: { page: '1', limit: '999999' } });
      await getLeaderboard(req, res);

      assert.strictEqual(res.getStatusCode(), 200);
      assert.strictEqual(lastLimit, 100, 'Limit should be clamped to 100 to prevent DOS');
    });

    it('1.6: Negative limit (limit=-50) should be clamped to minimum 1', async () => {
      const { req, res } = createMockReqRes({ query: { page: '1', limit: '-50' } });
      await getLeaderboard(req, res);

      assert.strictEqual(res.getStatusCode(), 200);
      assert.strictEqual(lastLimit, 1, 'Limit should be clamped to at least 1');
    });

    it('1.7: Zero limit (limit=0) should fallback to default 20', async () => {
      const { req, res } = createMockReqRes({ query: { page: '1', limit: '0' } });
      await getLeaderboard(req, res);

      assert.strictEqual(res.getStatusCode(), 200);
      assert.strictEqual(lastLimit, 20);
    });

    it('1.8: Non-numeric limit (limit="xyz") should fallback to default 20', async () => {
      const { req, res } = createMockReqRes({ query: { page: '1', limit: 'xyz' } });
      await getLeaderboard(req, res);

      assert.strictEqual(res.getStatusCode(), 200);
      assert.strictEqual(lastLimit, 20);
    });
  });

  // ──────────────────────────────────────────────────────────────────────────
  // 2. Search Query Regex Injection & ReDoS Stress Testing
  // ──────────────────────────────────────────────────────────────────────────
  describe('Suite 2: Search Query Regex Injection & Sanitization Stress Testing', () => {
    it('2.1: Sanitized bracket search=[ executes safely without SyntaxError and returns 200 OK', async () => {
      const { req, res } = createMockReqRes({ query: { search: '[' } });
      await getLeaderboard(req, res);

      assert.strictEqual(res.getStatusCode(), 200);
      const json = res.getJSON();
      assert.strictEqual(json.success, true);
      assert.strictEqual(Array.isArray(json.data.ambassadors), true);
    });

    it('2.2: Sanitized unclosed parenthesis search=( executes safely without SyntaxError and returns 200 OK', async () => {
      const { req, res } = createMockReqRes({ query: { search: '(' } });
      await getLeaderboard(req, res);

      assert.strictEqual(res.getStatusCode(), 200);
      const json = res.getJSON();
      assert.strictEqual(json.success, true);
      assert.strictEqual(Array.isArray(json.data.ambassadors), true);
    });

    it('2.3: Real-world programming search query search="C++" executes safely and returns 200 OK', async () => {
      const { req, res } = createMockReqRes({ query: { search: 'C++' } });
      await getLeaderboard(req, res);

      assert.strictEqual(res.getStatusCode(), 200);
      const json = res.getJSON();
      assert.strictEqual(json.success, true);
      assert.strictEqual(Array.isArray(json.data.ambassadors), true);
    });

    it('2.4: Trailing backslash search="\\" executes safely and returns 200 OK', async () => {
      const { req, res } = createMockReqRes({ query: { search: '\\' } });
      await getLeaderboard(req, res);

      assert.strictEqual(res.getStatusCode(), 200);
      const json = res.getJSON();
      assert.strictEqual(json.success, true);
      assert.strictEqual(Array.isArray(json.data.ambassadors), true);
    });

    it('2.5: Parenthesis in college filter college="IIT (BHU" executes safely and returns 200 OK', async () => {
      const { req, res } = createMockReqRes({ query: { college: 'IIT (BHU' } });
      await getLeaderboard(req, res);

      assert.strictEqual(res.getStatusCode(), 200);
      const json = res.getJSON();
      assert.strictEqual(json.success, true);
      assert.strictEqual(Array.isArray(json.data.ambassadors), true);
    });

    it('2.6: Normal alphanumeric search executes cleanly', async () => {
      const { req, res } = createMockReqRes({ query: { search: 'Aarav' } });
      await getLeaderboard(req, res);

      assert.strictEqual(res.getStatusCode(), 200);
      assert.ok(lastFindFilter.$or, 'Should build $or filter');
      assert.strictEqual(lastFindFilter.$or.length, 3);
    });

    it('2.7: NoSQL object injection in search (search[$gt]="") safely ignored', async () => {
      const { req, res } = createMockReqRes({ query: { search: { $gt: '' } } });
      await getLeaderboard(req, res);

      assert.strictEqual(res.getStatusCode(), 200);
      assert.strictEqual(lastFindFilter.$or, undefined, 'Object injection should not populate $or');
    });

    it('2.8: SortBy "recent" correctly selects { updatedAt: -1, joinedAt: -1 }', async () => {
      const { req, res } = createMockReqRes({ query: { sortBy: 'recent' } });
      await getLeaderboard(req, res);

      assert.strictEqual(res.getStatusCode(), 200);
      assert.deepStrictEqual(lastSortCriteria, { updatedAt: -1, joinedAt: -1 });
    });

    it('2.9: SortBy malicious property ("__proto__") defaults to canonical points sorting', async () => {
      const { req, res } = createMockReqRes({ query: { sortBy: '__proto__' } });
      await getLeaderboard(req, res);

      assert.strictEqual(res.getStatusCode(), 200);
      assert.deepStrictEqual(lastSortCriteria, {
        totalPoints: -1,
        activitiesCount: -1,
        joinedAt: 1,
        _id: 1,
      });
    });

    it('2.10: SortBy "rank" correctly selects { totalPoints: -1 }', async () => {
      const { req, res } = createMockReqRes({ query: { sortBy: 'rank' } });
      await getLeaderboard(req, res);

      assert.strictEqual(res.getStatusCode(), 200);
      assert.deepStrictEqual(lastSortCriteria, { totalPoints: -1 });
    });

    it('2.11: escapeRegex escapes metacharacters safely', () => {
      assert.strictEqual(escapeRegex('C++'), 'C\\+\\+');
      assert.strictEqual(escapeRegex('IIT (BHU)'), 'IIT \\(BHU\\)');
      assert.strictEqual(escapeRegex('[test]'), '\\[test\\]');
    });
  });

  // ──────────────────────────────────────────────────────────────────────────
  // 3. Badge Filter Stress Testing
  // ──────────────────────────────────────────────────────────────────────────
  describe('Suite 3: Badge Filter Stress Testing', () => {
    it('3.1: Valid canonical badge "SkillRock Champ" filters correctly', async () => {
      const { req, res } = createMockReqRes({ query: { badge: 'SkillRock Champ' } });
      await getLeaderboard(req, res);

      assert.strictEqual(res.getStatusCode(), 200);
      assert.strictEqual(lastFindFilter.badges, 'SkillRock Champ');
      const json = res.getJSON();
      assert.strictEqual(json.data.ambassadors.length, 1);
      assert.strictEqual(json.data.ambassadors[0].name, 'Aarav Patel');
    });

    it('3.2: Invalid badge value "NonExistentSuperBadge" returns empty array safely without crashing', async () => {
      const { req, res } = createMockReqRes({ query: { badge: 'NonExistentSuperBadge' } });
      await getLeaderboard(req, res);

      assert.strictEqual(res.getStatusCode(), 200);
      assert.strictEqual(lastFindFilter.badges, 'NonExistentSuperBadge');
      const json = res.getJSON();
      assert.strictEqual(json.data.ambassadors.length, 0);
      assert.strictEqual(json.data.pagination.totalAmbassadors, 0);
      assert.strictEqual(json.data.pagination.totalPages, 1);
    });

    it('3.3: Whitespace-only badge query badge="   " is ignored', async () => {
      const { req, res } = createMockReqRes({ query: { badge: '   ' } });
      await getLeaderboard(req, res);

      assert.strictEqual(res.getStatusCode(), 200);
      assert.strictEqual(lastFindFilter.badges, undefined);
    });
  });

  // ──────────────────────────────────────────────────────────────────────────
  // 4. Certificate Verification Endpoint Stress Testing
  // ──────────────────────────────────────────────────────────────────────────
  describe('Suite 4: Certificate Verification Endpoint Stress Testing', () => {
    it('4.1: Valid certificate lookup for issued certificate returns 200 with verified status', async () => {
      assert.ok(getCertificateHandler, 'Certificate handler should be resolved');
      const { req, res } = createMockReqRes({ params: { certId: 'SSAP-2026-CERT-001' } });
      await getCertificateHandler(req, res);

      assert.strictEqual(res.getStatusCode(), 200);
      const json = res.getJSON();
      assert.strictEqual(json.success, true);
      assert.strictEqual(json.data.certificateId, 'SSAP-2026-CERT-001');
      assert.strictEqual(json.data.ambassadorName, 'Aarav Patel');
      assert.strictEqual(json.data.college, 'IIT Bombay');
      assert.strictEqual(json.data.programDuration, '4 Months');
      assert.strictEqual(json.data.status, 'VERIFIED');
      assert.strictEqual(json.data.tierAchieved, 'SkillRock Champ');
      assert.strictEqual(json.data.totalPoints, 2450);
      assert.strictEqual(json.data.issueDate, '2026-04-15');
    });

    it('4.2: Non-existent certificate ID "SSAP-UNKNOWN-999" returns 404', async () => {
      const { req, res } = createMockReqRes({ params: { certId: 'SSAP-UNKNOWN-999' } });
      await getCertificateHandler(req, res);

      assert.strictEqual(res.getStatusCode(), 404);
      const json = res.getJSON();
      assert.strictEqual(json.success, false);
      assert.strictEqual(json.error, 'Certificate not found or invalid');
    });

    it('4.3: Ambassador with certificateStatus="pending" returns 404', async () => {
      // Ananya has status='pending', no certificate issued
      const { req, res } = createMockReqRes({ params: { certId: 'SSAP-2026-CERT-004' } });
      await getCertificateHandler(req, res);

      assert.strictEqual(res.getStatusCode(), 404);
      const json = res.getJSON();
      assert.strictEqual(json.success, false);
      assert.strictEqual(json.error, 'Certificate not found or invalid');
    });

    it('4.4: Empty or whitespace certificate ID returns 400 Bad Request', async () => {
      const { req, res } = createMockReqRes({ params: { certId: '   ' } });
      await getCertificateHandler(req, res);

      assert.strictEqual(res.getStatusCode(), 400);
      const json = res.getJSON();
      assert.strictEqual(json.success, false);
      assert.strictEqual(json.error, 'Certificate ID is required');
    });

    it('4.5: Malformed certificate ID returns 404 without crashing', async () => {
      const { req, res } = createMockReqRes({ params: { certId: '<script>alert(1)</script>' } });
      await getCertificateHandler(req, res);

      assert.strictEqual(res.getStatusCode(), 404);
      const json = res.getJSON();
      assert.strictEqual(json.success, false);
    });
  });

  // ──────────────────────────────────────────────────────────────────────────
  // 5. Ambassador By ID Endpoint Stress Testing
  // ──────────────────────────────────────────────────────────────────────────
  describe('Suite 5: Ambassador By ID Stress Testing', () => {
    it('5.1: Valid existing 24-hex ObjectId returns 200 with full details', async () => {
      const { req, res } = createMockReqRes({ params: { id: '663e8a1f4b2c1d0012a4b801' } });
      await getAmbassadorById(req, res);

      assert.strictEqual(res.getStatusCode(), 200);
      const json = res.getJSON();
      assert.strictEqual(json.success, true);
      assert.strictEqual(json.data.name, 'Aarav Patel');
      assert.strictEqual(json.data.recentActivities.length, 1);
    });

    it('5.2: Non-existent valid 24-hex ObjectId returns 404', async () => {
      const { req, res } = createMockReqRes({ params: { id: '663e8a1f4b2c1d0012a4b899' } });
      await getAmbassadorById(req, res);

      assert.strictEqual(res.getStatusCode(), 404);
      const json = res.getJSON();
      assert.strictEqual(json.success, false);
      assert.strictEqual(json.error, 'Ambassador not found');
    });

    it('5.3: Malformed ObjectId (too short) returns 400 Bad Request', async () => {
      const { req, res } = createMockReqRes({ params: { id: '123' } });
      await getAmbassadorById(req, res);

      assert.strictEqual(res.getStatusCode(), 400);
      const json = res.getJSON();
      assert.strictEqual(json.success, false);
      assert.strictEqual(json.error, 'Invalid ambassador ID format');
    });

    it('5.4: Malformed ObjectId with invalid characters returns 400 Bad Request', async () => {
      const { req, res } = createMockReqRes({ params: { id: '663e8a1f4b2c1d0012a4b8ZZ' } });
      await getAmbassadorById(req, res);

      assert.strictEqual(res.getStatusCode(), 400);
      const json = res.getJSON();
      assert.strictEqual(json.success, false);
      assert.strictEqual(json.error, 'Invalid ambassador ID format');
    });
  });

  // ──────────────────────────────────────────────────────────────────────────
  // 6. Response Envelope Validation Against PROJECT.md Contracts
  // ──────────────────────────────────────────────────────────────────────────
  describe('Suite 6: Contract Schema Compliance Testing', () => {
    it('6.1: GET /api/leaderboard matches PROJECT.md contract specification', async () => {
      const { req, res } = createMockReqRes({ query: { page: '1', limit: '20' } });
      await getLeaderboard(req, res);

      assert.strictEqual(res.getStatusCode(), 200);
      const json = res.getJSON();

      // Top-level contract
      assert.strictEqual(typeof json.success, 'boolean');
      assert.strictEqual(typeof json.data, 'object');
      assert.ok(Array.isArray(json.data.ambassadors));
      assert.strictEqual(typeof json.data.pagination, 'object');

      // Ambassador item contract
      const first = json.data.ambassadors[0];
      assert.strictEqual(typeof first.id, 'string');
      assert.strictEqual(typeof first.rank, 'number');
      assert.strictEqual(typeof first.name, 'string');
      assert.strictEqual(typeof first.avatar, 'string');
      assert.strictEqual(typeof first.college, 'string');
      assert.strictEqual(typeof first.city, 'string');
      assert.strictEqual(typeof first.state, 'string');
      assert.strictEqual(typeof first.totalPoints, 'number');
      assert.strictEqual(typeof first.badgeTier, 'string');
      assert.ok(Array.isArray(first.badges));
      assert.strictEqual(typeof first.activitiesCount, 'number');
      assert.strictEqual(typeof first.recentActivity, 'string');

      // Pagination contract
      const pag = json.data.pagination;
      assert.strictEqual(typeof pag.currentPage, 'number');
      assert.strictEqual(typeof pag.totalPages, 'number');
      assert.strictEqual(typeof pag.totalAmbassadors, 'number');
      assert.strictEqual(typeof pag.hasNext, 'boolean');
      assert.strictEqual(typeof pag.hasPrev, 'boolean');
    });

    it('6.2: GET /api/leaderboard/stats matches PROJECT.md contract specification', async () => {
      const { req, res } = createMockReqRes();
      await getLeaderboardStats(req, res);

      assert.strictEqual(res.getStatusCode(), 200);
      const json = res.getJSON();

      assert.strictEqual(json.success, true);
      assert.strictEqual(typeof json.data.totalAmbassadors, 'number');
      assert.strictEqual(typeof json.data.totalPointsAwarded, 'number');
      assert.strictEqual(typeof json.data.totalEventsHosted, 'number');
      assert.strictEqual(typeof json.data.topBadgeHolders, 'object');
      assert.strictEqual(typeof json.data.topBadgeHolders.skillRockChamp, 'number');
      assert.strictEqual(typeof json.data.topBadgeHolders.theChangemaker, 'number');
      assert.strictEqual(typeof json.data.topBadgeHolders.theTrailblazer, 'number');
      assert.strictEqual(typeof json.data.topBadgeHolders.theExplorer, 'number');
    });

    it('6.3: Zero physical rewards references present in any payload', async () => {
      const { req, res } = createMockReqRes({ query: { page: '1', limit: '20' } });
      await getLeaderboard(req, res);

      const jsonString = JSON.stringify(res.getJSON()).toLowerCase();
      assert.strictEqual(jsonString.includes('welcome kit'), false);
      assert.strictEqual(jsonString.includes('voucher'), false);
      assert.strictEqual(jsonString.includes('stipend'), false);
      assert.strictEqual(jsonString.includes('gift box'), false);
      assert.strictEqual(jsonString.includes('swag'), false);
    });
  });

  // ──────────────────────────────────────────────────────────────────────────
  // 7. Ambassador Model Badge Tier Default & Reconciliation
  // ──────────────────────────────────────────────────────────────────────────
  describe('Suite 7: Ambassador Model Badge Tier Default & Reconciliation', () => {
    it('7.1: determineBadgeTier returns null for points < 200', () => {
      assert.strictEqual(Ambassador.determineBadgeTier(0), null);
      assert.strictEqual(Ambassador.determineBadgeTier(50), null);
      assert.strictEqual(Ambassador.determineBadgeTier(199), null);
      assert.strictEqual(Ambassador.calculateBadgeTier(0), null);
      assert.strictEqual(Ambassador.calculateBadgeTier(199), null);
    });

    it('7.2: determineBadgeTier returns correct tiers at and above 200', () => {
      assert.strictEqual(Ambassador.determineBadgeTier(200), 'The Explorer');
      assert.strictEqual(Ambassador.determineBadgeTier(600), 'The Trailblazer');
      assert.strictEqual(Ambassador.determineBadgeTier(1200), 'The Changemaker');
      assert.strictEqual(Ambassador.determineBadgeTier(2000), 'SkillRock Champ');
    });

    it('7.3: calculateBadges returns empty array for points < 200', () => {
      assert.deepStrictEqual(Ambassador.calculateBadges(0), []);
      assert.deepStrictEqual(Ambassador.calculateBadges(199), []);
    });

    it('7.4: calculateBadges returns cumulative badges for points >= 200', () => {
      assert.deepStrictEqual(Ambassador.calculateBadges(200), ['The Explorer']);
      assert.deepStrictEqual(Ambassador.calculateBadges(600), ['The Explorer', 'The Trailblazer']);
      assert.deepStrictEqual(Ambassador.calculateBadges(1200), ['The Explorer', 'The Trailblazer', 'The Changemaker']);
      assert.deepStrictEqual(Ambassador.calculateBadges(2000), ['The Explorer', 'The Trailblazer', 'The Changemaker', 'SkillRock Champ']);
    });

    it('7.5: Ambassador schema default badgeTier is null and badges is empty array', () => {
      const amb = new Ambassador({
        name: 'New Student',
        email: 'new.student@test.edu',
        college: 'Test College',
        city: 'City',
        state: 'State',
      });
      assert.strictEqual(amb.badgeTier, null);
      assert.deepStrictEqual(amb.badges, []);
    });

    it('7.6: Schema validation succeeds for null and empty string badgeTier', () => {
      const docNull = new Ambassador({ name: 'Null Tier', email: 'null@test.edu', college: 'C', city: 'C', state: 'S', badgeTier: null });
      assert.strictEqual(docNull.validateSync(), undefined);

      const docEmpty = new Ambassador({ name: 'Empty Tier', email: 'empty@test.edu', college: 'C', city: 'C', state: 'S', badgeTier: '' });
      assert.strictEqual(docEmpty.validateSync(), undefined);
    });
  });
});
