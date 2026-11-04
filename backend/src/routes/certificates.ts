import { Router, Request, Response } from 'express';
import { Ambassador } from '../models/Ambassador';

const router = Router();

/**
 * GET /api/certificates/verify/:certId
 * Public lookup verifying digital completion certificate authenticity.
 */
export const verifyCertificate = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { certId } = req.params;

    if (!certId || typeof certId !== 'string' || certId.trim() === '') {
      return res.status(400).json({
        success: false,
        error: 'Certificate ID is required',
      });
    }

    const trimmedCertId = certId.trim();

    // Look for an ambassador with this certificateId and valid status
    const ambassador = await Ambassador.findOne({
      certificateId: trimmedCertId,
      certificateStatus: { $in: ['issued', 'eligible'] },
    }).lean();

    if (!ambassador) {
      return res.status(404).json({
        success: false,
        error: 'Certificate not found or invalid',
      });
    }

    // Format issue date nicely (YYYY-MM-DD)
    const issueDate = ambassador.certificateIssueDate || ambassador.certificateIssuedAt;
    const issueDateStr = issueDate
      ? new Date(issueDate).toISOString().split('T')[0]
      : '2026-04-15';

    return res.json({
      success: true,
      data: {
        certificateId: ambassador.certificateId,
        ambassadorName: ambassador.name,
        college: ambassador.college,
        issueDate: issueDateStr,
        programDuration: '4 Months',
        status: 'VERIFIED',
        tierAchieved: ambassador.badgeTier || null,
        totalPoints: ambassador.totalPoints,
      },
    });
  } catch (error) {
    console.error('Error verifying certificate:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to verify certificate',
    });
  }
};

router.get('/verify/:certId', verifyCertificate);

export default router;
