import { Router, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { v4 as uuidv4 } from 'uuid';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { Application } from '../models/Application';
import { submissionLimiter, statusLimiter } from '../middleware/rateLimiter';
import { requireAdmin } from '../middleware/auth';

const router = Router();

// Configure multer for video uploads
const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const unique = `${Date.now()}-${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, unique);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 30 * 1024 * 1024 }, // Strictly 30MB maximum
  fileFilter: (_req, file, cb) => {
    const allowed = ['video/mp4', 'video/webm', 'video/quicktime', 'video/x-matroska', 'video/avi'];
    if (allowed.includes(file.mimetype)) cb(null, true);
    else cb(new Error('Only video files (MP4, WebM, MOV) up to 30MB are allowed'));
  },
});

// Middleware to catch Multer upload errors gracefully without 500 crash
const handleVideoUpload = (req: Request, res: Response, next: any) => {
  upload.single('videoFile')(req, res, (err: any) => {
    if (err) {
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({
            errors: [{ msg: 'Video file exceeds 30 MB. Please compress the video or provide a Google Drive link.' }],
          });
        }
        return res.status(400).json({ errors: [{ msg: `Upload error: ${err.message}` }] });
      }
      return res.status(400).json({ errors: [{ msg: err.message || 'Video upload failed' }] });
    }
    next();
  });
};

// Generate application ID
const generateAppId = (): string => {
  const year = new Date().getFullYear();
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `SSAP-${year}-${rand}`;
};

// POST /api/applications — Submit application
router.post(
  '/',
  submissionLimiter,
  handleVideoUpload,
  [
    body('fullName').trim().notEmpty().withMessage('Full name is required'),
    body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
    body('phone').trim().notEmpty().withMessage('Phone is required'),
    body('college').trim().notEmpty().withMessage('College is required'),
    body('university').trim().notEmpty().withMessage('University is required'),
    body('degree').trim().notEmpty().withMessage('Degree is required'),
    body('year').notEmpty().withMessage('Year of study is required'),
    body('branch').trim().notEmpty().withMessage('Branch is required'),
    body('city').trim().notEmpty().withMessage('City is required'),
    body('state').trim().notEmpty().withMessage('State is required'),
    body('preferredLanguage').notEmpty().withMessage('Language is required'),
    body('weeklyAvailability').notEmpty().withMessage('Availability is required'),
    body('whyAmbassador').trim().isLength({ min: 100 }).withMessage('Minimum 100 characters for motivation'),
    body('skillrockValue').trim().isLength({ min: 80 }).withMessage('Minimum 80 characters required'),
    body('timeContribution').notEmpty().withMessage('Time contribution is required'),
    body('priorExperience').notEmpty().withMessage('Prior experience answer is required'),
    body('personalGoal').trim().isLength({ min: 50 }).withMessage('Minimum 50 characters for goal'),
    body('declarationAccepted').equals('true').withMessage('Declaration must be accepted'),
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      if (req.file) fs.unlinkSync(req.file.path);
      return res.status(400).json({ errors: errors.array() });
    }

    const { videoType, videoUrl } = req.body;
    if (videoType === 'link') {
      if (!videoUrl || typeof videoUrl !== 'string') {
        if (req.file) fs.unlinkSync(req.file.path);
        return res.status(400).json({ errors: [{ msg: 'Google Drive video link is required' }] });
      }
      if (/youtube\.com|youtu\.be/i.test(videoUrl)) {
        if (req.file) fs.unlinkSync(req.file.path);
        return res.status(400).json({ errors: [{ msg: 'YouTube links are not accepted. Please provide a Google Drive video link or upload a video directly.' }] });
      }
      if (!/drive\.google\.com|docs\.google\.com/i.test(videoUrl)) {
        if (req.file) fs.unlinkSync(req.file.path);
        return res.status(400).json({ errors: [{ msg: 'Please provide a valid Google Drive link (e.g. https://drive.google.com/file/d/...)' }] });
      }
    } else if (videoType === 'upload') {
      if (!req.file) {
        return res.status(400).json({ errors: [{ msg: 'Please select a video file to upload (maximum 30 MB)' }] });
      }
    }

    try {
      const { email } = req.body;
      const cleanEmail = String(email || '').trim().toLowerCase();

      // Build application data
      const appData: Partial<any> = {
        fullName: req.body.fullName,
        email: cleanEmail,
        phone: req.body.phone,
        college: req.body.college,
        university: req.body.university,
        degree: req.body.degree,
        year: req.body.year,
        branch: req.body.branch,
        city: req.body.city,
        state: req.body.state,
        linkedinUrl: req.body.linkedinUrl || undefined,
        instagramUrl: req.body.instagramUrl || undefined,
        preferredLanguage: req.body.preferredLanguage,
        weeklyAvailability: req.body.weeklyAvailability,
        whyAmbassador: req.body.whyAmbassador,
        skillrockValue: req.body.skillrockValue,
        timeContribution: req.body.timeContribution,
        priorExperience: req.body.priorExperience,
        priorExperienceDescription: req.body.priorExperienceDescription || undefined,
        personalGoal: req.body.personalGoal,
        scenario1Answer: req.body.scenario1Answer,
        scenario1Reasoning: req.body.scenario1Reasoning || undefined,
        scenario2Answer: req.body.scenario2Answer,
        scenario3Answer: req.body.scenario3Answer,
        scenario4Answer: req.body.scenario4Answer,
        scenario5Answer: req.body.scenario5Answer,
        scenario6Answer: req.body.scenario6Answer,
        campusWaitingPlace: req.body.campusWaitingPlace,
        campusGatheringArea: req.body.campusGatheringArea,
        campusReach500: req.body.campusReach500,
        campusEvent: req.body.campusEvent,
        campusTradition: req.body.campusTradition,
        quickFire1: req.body.quickFire1,
        quickFire2: req.body.quickFire2,
        declarationAccepted: req.body.declarationAccepted === 'true',
        videoType: req.file ? 'upload' : (req.body.videoType || 'link'),
        videoFilePath: req.file ? req.file.filename : undefined,
        videoUrl: req.body.videoUrl || undefined,
        status: 'submitted',
      };

      const existing = await Application.findOne({ email: cleanEmail });
      if (existing) {
        if (existing.status === 'submitted') {
          // If previous submission is still pending review, seamlessly update it
          Object.assign(existing, appData);
          existing.statusToken = existing.statusToken || uuidv4();
          await existing.save();
          return res.status(200).json({
            success: true,
            applicationId: existing.applicationId,
            statusToken: existing.statusToken,
            message: 'Application updated successfully!',
          });
        }
        if (req.file) fs.unlinkSync(req.file.path);
        return res.status(409).json({
          error: 'An application with this email has already been submitted and is currently in review.',
          applicationId: existing.applicationId,
          statusToken: existing.statusToken,
        });
      }

      appData.applicationId = generateAppId();
      appData.statusToken = uuidv4();

      const application = new Application(appData);
      await application.save();

      return res.status(201).json({
        success: true,
        applicationId: application.applicationId,
        statusToken: application.statusToken,
        message: 'Application submitted successfully!',
      });
    } catch (err) {
      if (req.file) {
        try { fs.unlinkSync(req.file.path); } catch {}
      }
      console.error('Application submission error:', err);
      return res.status(500).json({ error: 'Failed to submit application' });
    }
  }
);

// GET /api/applications/status — Check status by email + token
router.get('/status', statusLimiter, async (req: Request, res: Response) => {
  try {
    const { email, token } = req.query;
    if (!email || !token) {
      return res.status(400).json({ error: 'Email and token are required' });
    }

    const application = await Application.findOne({
      email: (email as string).toLowerCase(),
      statusToken: token as string,
    }).select('applicationId status fullName college submittedAt updatedAt');

    if (!application) {
      return res.status(404).json({ error: 'No application found with these credentials' });
    }

    const statusLabels: Record<string, string> = {
      submitted: 'Application Submitted',
      under_review: 'Under Review',
      shortlisted: 'Shortlisted',
      interview: 'Interview Stage',
      selected: 'Selected',
      not_selected: 'Not Selected',
    };

    return res.json({
      applicationId: application.applicationId,
      status: application.status,
      statusLabel: statusLabels[application.status],
      fullName: application.fullName,
      college: application.college,
      submittedAt: application.submittedAt,
      updatedAt: application.updatedAt,
    });
  } catch (err) {
    console.error('Status check error:', err);
    return res.status(500).json({ error: 'Failed to check status' });
  }
});

// ─── Admin-only routes ───────────────────────────────────────────────

// GET /api/applications — List all (admin)
router.get('/', requireAdmin, async (req: Request, res: Response) => {
  try {
    const {
      page = '1',
      limit = '20',
      search = '',
      status,
      college,
      state,
      year,
      sortBy = 'submittedAt',
      sortOrder = 'desc',
    } = req.query;

    const pageNum = Math.max(parseInt(page as string) || 1, 1);
    const limitNum = Math.min(Math.max(parseInt(limit as string) || 20, 1), 500);
    const skip = (pageNum - 1) * limitNum;

    const filter: Record<string, any> = {};
    if (status) filter.status = status;
    if (college) filter.college = new RegExp(college as string, 'i');
    if (state) filter.state = new RegExp(state as string, 'i');
    if (year) filter.year = year;
    if (search) {
      filter.$or = [
        { fullName: new RegExp(search as string, 'i') },
        { email: new RegExp(search as string, 'i') },
        { college: new RegExp(search as string, 'i') },
        { applicationId: new RegExp(search as string, 'i') },
      ];
    }

    const sortField = (sortBy as string) || 'submittedAt';
    const sortDir = sortOrder === 'asc' ? 1 : -1;

    const [applications, total] = await Promise.all([
      Application.find(filter)
        .select('-statusToken -videoFilePath')
        .sort({ [sortField]: sortDir })
        .skip(skip)
        .limit(limitNum),
      Application.countDocuments(filter),
    ]);

    return res.json({
      applications,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (err) {
    console.error('List applications error:', err);
    return res.status(500).json({ error: 'Failed to fetch applications' });
  }
});

// GET /api/applications/stats — Dashboard statistics (admin)
router.get('/stats', requireAdmin, async (_req: Request, res: Response) => {
  try {
    const [
      total,
      byStatus,
      byCollege,
      byState,
      byYear,
    ] = await Promise.all([
      Application.countDocuments(),
      Application.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
      Application.aggregate([
        { $group: { _id: '$college', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 15 },
      ]),
      Application.aggregate([
        { $group: { _id: '$state', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 20 },
      ]),
      Application.aggregate([{ $group: { _id: '$year', count: { $sum: 1 } } }]),
    ]);

    return res.json({ total, byStatus, byCollege, byState, byYear });
  } catch (err) {
    console.error('Stats error:', err);
    return res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});

// GET /api/applications/:id — Single application (admin)
router.get('/:id', requireAdmin, async (req: Request, res: Response) => {
  try {
    const application = await Application.findOne({ applicationId: req.params.id });
    if (!application) return res.status(404).json({ error: 'Application not found' });

    const appObj = application.toObject() as any;
    delete appObj.statusToken;
    return res.json(appObj);
  } catch (err) {
    console.error('Get application error:', err);
    return res.status(500).json({ error: 'Failed to fetch application' });
  }
});

// PATCH /api/applications/:id — Update status/scores (admin)
router.patch('/:id', requireAdmin, async (req: Request, res: Response) => {
  try {
    const {
      status,
      totalScore,
      motivationScore,
      situationalScore,
      campusScore,
      quickFireScore,
      videoScore,
      reviewerNotes,
      internalNotes,
    } = req.body;

    const validStatuses = ['submitted', 'under_review', 'shortlisted', 'interview', 'selected', 'not_selected'];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const updateData: Record<string, any> = {};
    if (status !== undefined) updateData.status = status;
    if (totalScore !== undefined) updateData.totalScore = Number(totalScore);
    if (motivationScore !== undefined) updateData.motivationScore = Number(motivationScore);
    if (situationalScore !== undefined) updateData.situationalScore = Number(situationalScore);
    if (campusScore !== undefined) updateData.campusScore = Number(campusScore);
    if (quickFireScore !== undefined) updateData.quickFireScore = Number(quickFireScore);
    if (videoScore !== undefined) updateData.videoScore = Number(videoScore);
    if (reviewerNotes !== undefined) updateData.reviewerNotes = reviewerNotes;
    if (internalNotes !== undefined) updateData.internalNotes = internalNotes;
    if (req.admin?.email) updateData.reviewedBy = req.admin.email;

    const application = await Application.findOneAndUpdate(
      { applicationId: req.params.id },
      { $set: updateData },
      { new: true }
    );

    if (!application) return res.status(404).json({ error: 'Application not found' });

    const appObj = application.toObject() as any;
    delete appObj.statusToken;
    return res.json({ success: true, application: appObj });
  } catch (err) {
    console.error('Update application error:', err);
    return res.status(500).json({ error: 'Failed to update application' });
  }
});

// GET /api/applications/export/csv — Export CSV (admin)
router.get('/export/csv', requireAdmin, async (_req: Request, res: Response) => {
  try {
    const applications = await Application.find()
      .select('-statusToken -videoFilePath -internalNotes')
      .sort({ submittedAt: -1 });

    const headers = [
      'Application ID', 'Full Name', 'Email', 'Phone', 'College', 'University',
      'Degree', 'Year', 'Branch', 'City', 'State', 'Status', 'Total Score',
      'Submitted At',
    ];

    const rows = applications.map(a => [
      a.applicationId, a.fullName, a.email, a.phone, a.college, a.university,
      a.degree, a.year, a.branch, a.city, a.state, a.status,
      a.totalScore ?? '', a.submittedAt.toISOString(),
    ]);

    const csvContent = [headers, ...rows]
      .map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      .join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="ssap-applications.csv"');
    return res.send(csvContent);
  } catch (err) {
    console.error('CSV export error:', err);
    return res.status(500).json({ error: 'Failed to export' });
  }
});

export default router;
