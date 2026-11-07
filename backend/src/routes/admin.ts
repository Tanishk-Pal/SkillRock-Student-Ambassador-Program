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

      const assignedRole = admin.role === 'admin' ? 'super_admin' : (admin.role || 'super_admin');
      admin.role = assignedRole;
      admin.lastLogin = new Date();

      await Admin.updateOne(
        { _id: admin._id },
        { $set: { lastLogin: new Date(), role: assignedRole } }
      ).catch((e) => console.warn('Could not update lastLogin on admin:', e));

      const secret = process.env.JWT_SECRET || 'skillrock_ssap_default_jwt_secret_2026_super_secure';

      const token = jwt.sign(
        { adminId: admin._id.toString(), email: admin.email, role: assignedRole },
        secret,
        { expiresIn: '8h' }
      );

      return res.json({
        token,
        admin: { email: admin.email, name: admin.name, role: assignedRole },
      });
    } catch (err: any) {
      console.error('Login error:', err);
      return res.status(500).json({ error: 'Internal server error', message: err?.message, stack: err?.stack });
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
