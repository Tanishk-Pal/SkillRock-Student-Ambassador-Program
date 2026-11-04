import { describe, it, before, after } from 'node:test';
import assert from 'node:assert';
import { verifyCertificate } from '../routes/certificates';
import { Ambassador } from '../models/Ambassador';
import { checkCertificateEligibility } from '../services/scoringService';
import { createMockRequest, createMockResponse } from './mockHelper';

// Fixture dataset for certificate verification
const FIXTURE_CERTIFICATES = [
  {
    _id: '663e8a1f4b2c1d0012a4b801',
    name: 'Aarav Patel',
    college: 'IIT Bombay',
    badgeTier: 'SkillRock Champ',
    totalPoints: 2450,
    certificateStatus: 'issued',
    certificateId: 'SSAP-2026-CERT-001',
    certificateIssueDate: '2026-04-15',
  },
  {
    _id: '663e8a1f4b2c1d0012a4b802',
    name: 'Priya Sharma',
    college: 'BITS Pilani',
    badgeTier: 'The Changemaker',
    totalPoints: 1850,
    certificateStatus: 'eligible',
    certificateId: 'SSAP-2026-CERT-002',
    certificateIssueDate: '2026-04-15',
  },
  {
    _id: '663e8a1f4b2c1d0012a4b804',
    name: 'Ananya Iyer',
    college: 'NIT Trichy',
    badgeTier: 'The Explorer',
    totalPoints: 350,
    certificateStatus: 'pending',
    certificateId: 'SSAP-2026-CERT-004',
  },
];

// Preserve original Mongoose model function
const origFindOne = Ambassador.findOne;

function setupCertificateMocks() {
  (Ambassador as any).findOne = function (filter: any) {
    const doc = FIXTURE_CERTIFICATES.find((a) => {
      if (filter.certificateId && a.certificateId !== filter.certificateId) {
        return false;
      }
      if (filter.certificateStatus?.$in && !filter.certificateStatus.$in.includes(a.certificateStatus)) {
        return false;
      }
      return true;
    });
    return {
      lean() {
        return Promise.resolve(doc || null);
      },
    };
  };
}

function restoreCertificateMocks() {
  (Ambassador as any).findOne = origFindOne;
}

describe('Suite 5: Certificate Verification Lookup & Eligibility Rules', () => {
  before(() => {
    setupCertificateMocks();
  });

  after(() => {
    restoreCertificateMocks();
  });

  it('5.1: should return verified certificate details for valid certificateId using real verifyCertificate handler', async () => {
    const req = createMockRequest({}, { certId: 'SSAP-2026-CERT-001' });
    const res = createMockResponse();

    await verifyCertificate(req, res as any);

    assert.strictEqual(res.statusCode, 200);
    assert.strictEqual(res.jsonData.success, true);
    assert.strictEqual(res.jsonData.data.certificateId, 'SSAP-2026-CERT-001');
    assert.strictEqual(res.jsonData.data.ambassadorName, 'Aarav Patel');
    assert.strictEqual(res.jsonData.data.college, 'IIT Bombay');
    assert.strictEqual(res.jsonData.data.programDuration, '4 Months');
    assert.strictEqual(res.jsonData.data.status, 'VERIFIED');
    assert.strictEqual(res.jsonData.data.tierAchieved, 'SkillRock Champ');
    assert.strictEqual(res.jsonData.data.totalPoints, 2450);
  });

  it('5.2: should return 404 for non-existent certificateId using real verifyCertificate handler', async () => {
    const req = createMockRequest({}, { certId: 'INVALID-CERT-999' });
    const res = createMockResponse();

    await verifyCertificate(req, res as any);

    assert.strictEqual(res.statusCode, 404);
    assert.strictEqual(res.jsonData.success, false);
    assert.strictEqual(res.jsonData.error, 'Certificate not found or invalid');
  });

  it('5.3: should return 400 when certificateId is missing or empty', async () => {
    const reqEmpty = createMockRequest({}, { certId: '' });
    const resEmpty = createMockResponse();
    await verifyCertificate(reqEmpty, resEmpty as any);
    assert.strictEqual(resEmpty.statusCode, 400);
    assert.strictEqual(resEmpty.jsonData.error, 'Certificate ID is required');

    const reqWhitespace = createMockRequest({}, { certId: '   ' });
    const resWhitespace = createMockResponse();
    await verifyCertificate(reqWhitespace, resWhitespace as any);
    assert.strictEqual(resWhitespace.statusCode, 400);
    assert.strictEqual(resWhitespace.jsonData.error, 'Certificate ID is required');
  });

  it('5.4: should return 404 when ambassador certificateStatus is pending (not issued or eligible)', async () => {
    const reqPending = createMockRequest({}, { certId: 'SSAP-2026-CERT-004' });
    const resPending = createMockResponse();

    await verifyCertificate(reqPending, resPending as any);

    assert.strictEqual(resPending.statusCode, 404);
    assert.strictEqual(resPending.jsonData.success, false);
    assert.strictEqual(resPending.jsonData.error, 'Certificate not found or invalid');
  });

  it('5.5: should evaluate certificate eligibility correctly based on points and activities', () => {
    // Under 200 points -> pending
    assert.deepStrictEqual(checkCertificateEligibility(150, 3), {
      isEligible: false,
      status: 'pending',
    });

    // Under 2 activities -> pending
    assert.deepStrictEqual(checkCertificateEligibility(400, 1), {
      isEligible: false,
      status: 'pending',
    });

    // 200+ points and >= 2 activities -> eligible
    assert.deepStrictEqual(checkCertificateEligibility(200, 2), {
      isEligible: true,
      status: 'eligible',
    });

    assert.deepStrictEqual(checkCertificateEligibility(1800, 10), {
      isEligible: true,
      status: 'eligible',
    });
  });
});
