import { Admin } from '../models/Admin';

const DEFAULT_ADMINS = [
  {
    email: 'palt51419@gmail.com',
    passwordHash: '$2a$12$cMEJXB2lFeBaY1gpoueTHOUtbtcoPi0oHY8Xy8Kj4Hyilz0nof21m', // TanxPal062007
    name: 'Tanishk Pal',
    role: 'super_admin' as const,
  },
  {
    email: 'admin@skillrock.in',
    passwordHash: '$2a$12$fp.kn8dktklQM6gbdTR.tugdn8uMFpGWDjixIklGDSBKgvyIWeM72', // Admin@SSAP2026!
    name: 'SkillRock SSAP Director',
    role: 'super_admin' as const,
  },
];

export const ensureAdminUser = async (): Promise<void> => {
  for (const adm of DEFAULT_ADMINS) {
    const existing = await Admin.findOne({ email: adm.email.toLowerCase() });
    if (!existing) {
      await Admin.create(adm);
      console.log(`✅ Default admin created: ${adm.email}`);
    }
  }

  // Also check if environment variable overrides
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH;
  const adminName = process.env.ADMIN_NAME || 'SSAP Admin';

  if (adminEmail && adminPasswordHash) {
    const existingEnv = await Admin.findOne({ email: adminEmail.toLowerCase() });
    if (!existingEnv) {
      await Admin.create({
        email: adminEmail.toLowerCase(),
        passwordHash: adminPasswordHash,
        name: adminName,
        role: 'super_admin',
      });
      console.log(`✅ Env admin user created: ${adminEmail}`);
    }
  }
};
