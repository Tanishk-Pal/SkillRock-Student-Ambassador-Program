import { Router, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import { Admin } from '../models/Admin';
import { authLimiter } from '../middleware/rateLimiter';
import { requireAdmin } from '../middleware/auth';

const router = Router();

// POST /api/admin/login
router.post(
  '/login',
  authLimiter,
  [
    body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
    body('password').notEmpty().withMessage('Password required'),
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { email, password } = req.body;
      const cleanEmail = String(email || '').trim().toLowerCase();
      const admin = await Admin.findOne({ email: cleanEmail });
      if (!admin) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const valid = await admin.comparePassword(password);
      if (!valid) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const secret = process.env.JWT_SECRET || 'skillrock_ssap_default_jwt_secret_2026_super_secure';

      const token = jwt.sign(
        { adminId: admin._id.toString(), email: admin.email, role: admin.role },
        secret,
        { expiresIn: '8h' }
      );

      admin.lastLogin = new Date();
      await admin.save();

      return res.json({
        token,
        admin: { email: admin.email, name: admin.name, role: admin.role },
      });
    } catch (err) {
      console.error('Login error:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
);

// GET /api/admin/me
router.get('/me', requireAdmin, async (req: Request, res: Response) => {
  try {
    const admin = await Admin.findById(req.admin!.adminId).select('-passwordHash');
    if (!admin) return res.status(404).json({ error: 'Admin not found' });
    return res.json(admin);
  } catch {
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
