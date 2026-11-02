import { Admin } from '../models/Admin';
import bcrypt from 'bcryptjs';

export const ensureAdminUser = async (): Promise<void> => {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH;
  const adminName = process.env.ADMIN_NAME || 'SSAP Admin';

  if (!adminEmail || !adminPasswordHash) {
    console.warn('⚠️  ADMIN_EMAIL or ADMIN_PASSWORD_HASH not set — no admin account seeded.');
    return;
  }

  const existing = await Admin.findOne({ email: adminEmail.toLowerCase() });
  if (!existing) {
    await Admin.create({
      email: adminEmail.toLowerCase(),
      passwordHash: adminPasswordHash,
      name: adminName,
      role: 'super_admin',
    });
    console.log(`✅ Admin user created: ${adminEmail}`);
  }
};
