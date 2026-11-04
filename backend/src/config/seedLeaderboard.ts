import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Ambassador, IAmbassador, BadgeTier, CertificateStatus } from '../models/Ambassador';
import { ActivityLog, ActivityType } from '../models/ActivityLog';

dotenv.config();

export interface SeedAmbassadorData {
  name: string;
  email: string;
  college: string;
  city: string;
  state: string;
  avatar: string;
  totalPoints: number;
  currentRank: number;
  badgeTier: BadgeTier | null;
  badges: string[];
  activitiesCount: number;
  recentActivity: string;
  certificateStatus: CertificateStatus;
  certificateId?: string;
  programStartDate: Date;
  joinedAt?: Date;
}

export const SEED_AMBASSADORS: SeedAmbassadorData[] = [
  {
    name: 'Aarav Sharma',
    email: 'aarav.sharma@iitb.ac.in',
    college: 'Indian Institute of Technology Bombay',
    city: 'Mumbai',
    state: 'Maharashtra',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=256&h=256&q=80',
    totalPoints: 2850,
    currentRank: 1,
    badgeTier: 'SkillRock Champ',
    badges: ['The Explorer', 'The Trailblazer', 'The Changemaker', 'SkillRock Champ'],
    activitiesCount: 21,
    recentActivity: 'Organized 36-hr AI Hackathon with 250+ participants',
    certificateStatus: 'issued',
    certificateId: 'SSAP-2026-CERT-001',
    programStartDate: new Date('2025-12-01'),
    joinedAt: new Date('2025-12-01'),
  },
  {
    name: 'Priya Patel',
    email: 'priya.patel@pilani.bits-pilani.ac.in',
    college: 'BITS Pilani',
    city: 'Pilani',
    state: 'Rajasthan',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&h=256&q=80',
    totalPoints: 2640,
    currentRank: 2,
    badgeTier: 'SkillRock Champ',
    badges: ['The Explorer', 'The Trailblazer', 'The Changemaker', 'SkillRock Champ'],
    activitiesCount: 19,
    recentActivity: 'Conducted Web3 & Smart Contracts Study Jam',
    certificateStatus: 'issued',
    certificateId: 'SSAP-2026-CERT-002',
    programStartDate: new Date('2025-12-01'),
    joinedAt: new Date('2025-12-01'),
  },
  {
    name: 'Rohan Iyer',
    email: 'rohan.iyer@smail.iitm.ac.in',
    college: 'Indian Institute of Technology Madras',
    city: 'Chennai',
    state: 'Tamil Nadu',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&h=256&q=80',
    totalPoints: 2480,
    currentRank: 3,
    badgeTier: 'SkillRock Champ',
    badges: ['The Explorer', 'The Trailblazer', 'The Changemaker', 'SkillRock Champ'],
    activitiesCount: 18,
    recentActivity: 'Led 3-day Flutter Mobile App Workshop',
    certificateStatus: 'issued',
    certificateId: 'SSAP-2026-CERT-003',
    programStartDate: new Date('2025-12-05'),
    joinedAt: new Date('2025-12-05'),
  },
  {
    name: 'Ananya Gupta',
    email: 'ananya.gupta@iitd.ac.in',
    college: 'Indian Institute of Technology Delhi',
    city: 'New Delhi',
    state: 'Delhi',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=256&h=256&q=80',
    totalPoints: 2310,
    currentRank: 4,
    badgeTier: 'SkillRock Champ',
    badges: ['The Explorer', 'The Trailblazer', 'The Changemaker', 'SkillRock Champ'],
    activitiesCount: 17,
    recentActivity: 'Hosted Open Source Contribution Sprint',
    certificateStatus: 'issued',
    certificateId: 'SSAP-2026-CERT-004',
    programStartDate: new Date('2025-12-05'),
    joinedAt: new Date('2025-12-05'),
  },
  {
    name: 'Kavya Reddy',
    email: 'kavya.reddy@research.iiit.ac.in',
    college: 'IIIT Hyderabad',
    city: 'Hyderabad',
    state: 'Telangana',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=256&h=256&q=80',
    totalPoints: 2150,
    currentRank: 5,
    badgeTier: 'SkillRock Champ',
    badges: ['The Explorer', 'The Trailblazer', 'The Changemaker', 'SkillRock Champ'],
    activitiesCount: 16,
    recentActivity: 'Mentored 12 peer teams in DSA & Competitive Programming',
    certificateStatus: 'issued',
    certificateId: 'SSAP-2026-CERT-005',
    programStartDate: new Date('2025-12-10'),
    joinedAt: new Date('2025-12-10'),
  },
  {
    name: 'Aditya Verma',
    email: 'aditya.verma@rvce.edu.in',
    college: 'RV College of Engineering',
    city: 'Bengaluru',
    state: 'Karnataka',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&h=256&q=80',
    totalPoints: 1920,
    currentRank: 6,
    badgeTier: 'The Changemaker',
    badges: ['The Explorer', 'The Trailblazer', 'The Changemaker'],
    activitiesCount: 14,
    recentActivity: 'Organized Campus Cloud Computing Jam',
    certificateStatus: 'issued',
    certificateId: 'SSAP-2026-CERT-006',
    programStartDate: new Date('2025-12-10'),
    joinedAt: new Date('2025-12-10'),
  },
  {
    name: 'Sneha Mukherjee',
    email: 'sneha.mukherjee@jadavpuruniversity.in',
    college: 'Jadavpur University',
    city: 'Kolkata',
    state: 'West Bengal',
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=256&h=256&q=80',
    totalPoints: 1840,
    currentRank: 7,
    badgeTier: 'The Changemaker',
    badges: ['The Explorer', 'The Trailblazer', 'The Changemaker'],
    activitiesCount: 13,
    recentActivity: 'Published In-depth Deep Learning Tutorial Series',
    certificateStatus: 'issued',
    certificateId: 'SSAP-2026-CERT-007',
    programStartDate: new Date('2025-12-12'),
    joinedAt: new Date('2025-12-12'),
  },
  {
    name: 'Devendra Rao',
    email: 'devendra.rao@nitt.edu',
    college: 'National Institute of Technology Trichy',
    city: 'Tiruchirappalli',
    state: 'Tamil Nadu',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=256&h=256&q=80',
    totalPoints: 1750,
    currentRank: 8,
    badgeTier: 'The Changemaker',
    badges: ['The Explorer', 'The Trailblazer', 'The Changemaker'],
    activitiesCount: 13,
    recentActivity: 'Conducted System Design & API Architecture Workshop',
    certificateStatus: 'issued',
    certificateId: 'SSAP-2026-CERT-008',
    programStartDate: new Date('2025-12-15'),
    joinedAt: new Date('2025-12-15'),
  },
  {
    name: 'Tanvi Joshi',
    email: 'tanvi.joshi@coep.ac.in',
    college: 'COEP Technological University',
    city: 'Pune',
    state: 'Maharashtra',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=256&h=256&q=80',
    totalPoints: 1620,
    currentRank: 9,
    badgeTier: 'The Changemaker',
    badges: ['The Explorer', 'The Trailblazer', 'The Changemaker'],
    activitiesCount: 12,
    recentActivity: 'Organized Campus UI/UX Design Sprint',
    certificateStatus: 'issued',
    certificateId: 'SSAP-2026-CERT-009',
    programStartDate: new Date('2025-12-15'),
    joinedAt: new Date('2025-12-15'),
  },
  {
    name: 'Vikram Singh',
    email: 'vikram.singh@dtu.ac.in',
    college: 'Delhi Technological University (DTU)',
    city: 'Delhi',
    state: 'Delhi',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=256&h=256&q=80',
    totalPoints: 1510,
    currentRank: 10,
    badgeTier: 'The Changemaker',
    badges: ['The Explorer', 'The Trailblazer', 'The Changemaker'],
    activitiesCount: 11,
    recentActivity: 'Hosted Full-Stack Web Development Study Jam',
    certificateStatus: 'issued',
    certificateId: 'SSAP-2026-CERT-010',
    programStartDate: new Date('2025-12-20'),
    joinedAt: new Date('2025-12-20'),
  },
  {
    name: 'Meera Nair',
    email: 'meera.nair@nitk.edu.in',
    college: 'National Institute of Technology Surathkal',
    city: 'Mangalore',
    state: 'Karnataka',
    avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=256&h=256&q=80',
    totalPoints: 1420,
    currentRank: 11,
    badgeTier: 'The Changemaker',
    badges: ['The Explorer', 'The Trailblazer', 'The Changemaker'],
    activitiesCount: 10,
    recentActivity: 'Led Cybersecurity & Ethical Hacking Awareness Session',
    certificateStatus: 'issued',
    certificateId: 'SSAP-2026-CERT-011',
    programStartDate: new Date('2025-12-20'),
    joinedAt: new Date('2025-12-20'),
  },
  {
    name: 'Ishaan Kapoor',
    email: 'ishaan.kapoor@thapar.edu',
    college: 'Thapar Institute of Engineering and Technology',
    city: 'Patiala',
    state: 'Punjab',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=256&h=256&q=80',
    totalPoints: 1340,
    currentRank: 12,
    badgeTier: 'The Changemaker',
    badges: ['The Explorer', 'The Trailblazer', 'The Changemaker'],
    activitiesCount: 9,
    recentActivity: 'Mentored 40 first-year students in Python fundamentals',
    certificateStatus: 'eligible',
    programStartDate: new Date('2026-01-05'),
    joinedAt: new Date('2026-01-05'),
  },
  {
    name: 'Rhea Deshmukh',
    email: 'rhea.deshmukh@vjti.ac.in',
    college: 'Veermata Jijabai Technological Institute (VJTI)',
    city: 'Mumbai',
    state: 'Maharashtra',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=256&h=256&q=80',
    totalPoints: 1230,
    currentRank: 13,
    badgeTier: 'The Changemaker',
    badges: ['The Explorer', 'The Trailblazer', 'The Changemaker'],
    activitiesCount: 9,
    recentActivity: 'Organized Women in Tech Campus Networking Circle',
    certificateStatus: 'eligible',
    programStartDate: new Date('2026-01-05'),
    joinedAt: new Date('2026-01-05'),
  },
  {
    name: 'Abhishek Sen',
    email: 'abhishek.sen@iitr.ac.in',
    college: 'Indian Institute of Technology Roorkee',
    city: 'Roorkee',
    state: 'Uttarakhand',
    avatar: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&w=256&h=256&q=80',
    totalPoints: 1120,
    currentRank: 14,
    badgeTier: 'The Trailblazer',
    badges: ['The Explorer', 'The Trailblazer'],
    activitiesCount: 8,
    recentActivity: 'Conducted Git & GitHub Workshop for 90 students',
    certificateStatus: 'pending',
    programStartDate: new Date('2026-01-10'),
    joinedAt: new Date('2026-01-10'),
  },
  {
    name: 'Pooja Sundaram',
    email: 'pooja.sundaram@psgtech.ac.in',
    college: 'PSG College of Technology',
    city: 'Coimbatore',
    state: 'Tamil Nadu',
    avatar: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&w=256&h=256&q=80',
    totalPoints: 1040,
    currentRank: 15,
    badgeTier: 'The Trailblazer',
    badges: ['The Explorer', 'The Trailblazer'],
    activitiesCount: 8,
    recentActivity: 'Hosted Machine Learning Study Group',
    certificateStatus: 'pending',
    programStartDate: new Date('2026-01-10'),
    joinedAt: new Date('2026-01-10'),
  },
  {
    name: 'Nikhil Bhatia',
    email: 'nikhil.bhatia@nsut.ac.in',
    college: 'Netaji Subhas University of Technology (NSUT)',
    city: 'New Delhi',
    state: 'Delhi',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=256&h=256&q=80',
    totalPoints: 950,
    currentRank: 16,
    badgeTier: 'The Trailblazer',
    badges: ['The Explorer', 'The Trailblazer'],
    activitiesCount: 7,
    recentActivity: 'Organized Competitive Coding Contest on Campus',
    certificateStatus: 'pending',
    programStartDate: new Date('2026-01-15'),
    joinedAt: new Date('2026-01-15'),
  },
  {
    name: 'Divya Kulkarni',
    email: 'divya.kulkarni@spit.ac.in',
    college: 'Sardar Patel Institute of Technology (SPIT)',
    city: 'Mumbai',
    state: 'Maharashtra',
    avatar: 'https://images.unsplash.com/photo-1548142813-c348350df52b?auto=format&fit=crop&w=256&h=256&q=80',
    totalPoints: 880,
    currentRank: 17,
    badgeTier: 'The Trailblazer',
    badges: ['The Explorer', 'The Trailblazer'],
    activitiesCount: 6,
    recentActivity: 'Conducted React & State Management Deep Dive',
    certificateStatus: 'pending',
    programStartDate: new Date('2026-01-15'),
    joinedAt: new Date('2026-01-15'),
  },
  {
    name: 'Arjun Choudhury',
    email: 'arjun.choudhury@bitmesra.ac.in',
    college: 'Birla Institute of Technology, Mesra',
    city: 'Ranchi',
    state: 'Jharkhand',
    avatar: 'https://images.unsplash.com/photo-1463453091185-61582044d556?auto=format&fit=crop&w=256&h=256&q=80',
    totalPoints: 790,
    currentRank: 18,
    badgeTier: 'The Trailblazer',
    badges: ['The Explorer', 'The Trailblazer'],
    activitiesCount: 6,
    recentActivity: 'Led Android Dev Bootcamp with Kotlin',
    certificateStatus: 'pending',
    programStartDate: new Date('2026-01-20'),
    joinedAt: new Date('2026-01-20'),
  },
  {
    name: 'Simran Kaur',
    email: 'simran.kaur@mnit.ac.in',
    college: 'Malaviya National Institute of Technology (MNIT)',
    city: 'Jaipur',
    state: 'Rajasthan',
    avatar: 'https://images.unsplash.com/photo-1534751516642-a171edd2521d?auto=format&fit=crop&w=256&h=256&q=80',
    totalPoints: 710,
    currentRank: 19,
    badgeTier: 'The Trailblazer',
    badges: ['The Explorer', 'The Trailblazer'],
    activitiesCount: 5,
    recentActivity: 'Hosted Tech Resume Review & Career Guidance Session',
    certificateStatus: 'pending',
    programStartDate: new Date('2026-01-20'),
    joinedAt: new Date('2026-01-20'),
  },
  {
    name: 'Harish Balaji',
    email: 'harish.balaji@annauniv.edu',
    college: 'College of Engineering, Guindy (Anna University)',
    city: 'Chennai',
    state: 'Tamil Nadu',
    avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=256&h=256&q=80',
    totalPoints: 630,
    currentRank: 20,
    badgeTier: 'The Trailblazer',
    badges: ['The Explorer', 'The Trailblazer'],
    activitiesCount: 5,
    recentActivity: 'Conducted Docker & Containers Hands-on Lab',
    certificateStatus: 'pending',
    programStartDate: new Date('2026-01-25'),
    joinedAt: new Date('2026-01-25'),
  },
  {
    name: 'Neha Trivedi',
    email: 'neha.trivedi@learner.manipal.edu',
    college: 'Manipal Institute of Technology',
    city: 'Manipal',
    state: 'Karnataka',
    avatar: 'https://images.unsplash.com/photo-1517365830460-955ce3ccd263?auto=format&fit=crop&w=256&h=256&q=80',
    totalPoints: 540,
    currentRank: 21,
    badgeTier: 'The Explorer',
    badges: ['The Explorer'],
    activitiesCount: 4,
    recentActivity: 'Founded Campus SkillRock Peer Study Circle',
    certificateStatus: 'pending',
    programStartDate: new Date('2026-02-01'),
    joinedAt: new Date('2026-02-01'),
  },
  {
    name: 'Karan Saxena',
    email: 'karan.saxena@amity.edu',
    college: 'Amity University',
    city: 'Noida',
    state: 'Uttar Pradesh',
    avatar: 'https://images.unsplash.com/photo-1528892952291-009c663ce843?auto=format&fit=crop&w=256&h=256&q=80',
    totalPoints: 460,
    currentRank: 22,
    badgeTier: 'The Explorer',
    badges: ['The Explorer'],
    activitiesCount: 3,
    recentActivity: 'Onboarded 25 students into SkillRock platform',
    certificateStatus: 'pending',
    programStartDate: new Date('2026-02-01'),
    joinedAt: new Date('2026-02-01'),
  },
  {
    name: 'Akanksha Das',
    email: 'akanksha.das@srmist.edu.in',
    college: 'SRM Institute of Science and Technology',
    city: 'Chennai',
    state: 'Tamil Nadu',
    avatar: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=256&h=256&q=80',
    totalPoints: 390,
    currentRank: 23,
    badgeTier: 'The Explorer',
    badges: ['The Explorer'],
    activitiesCount: 3,
    recentActivity: 'Organized Campus Tech Orientation for Freshers',
    certificateStatus: 'pending',
    programStartDate: new Date('2026-02-05'),
    joinedAt: new Date('2026-02-05'),
  },
  {
    name: 'Siddharth Roy',
    email: 'siddharth.roy@ictmumbai.edu.in',
    college: 'Institute of Chemical Technology (ICT)',
    city: 'Mumbai',
    state: 'Maharashtra',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=256&h=256&q=80',
    totalPoints: 310,
    currentRank: 24,
    badgeTier: 'The Explorer',
    badges: ['The Explorer'],
    activitiesCount: 2,
    recentActivity: 'Conducted Introduction to Web Technologies Jam',
    certificateStatus: 'pending',
    programStartDate: new Date('2026-02-10'),
    joinedAt: new Date('2026-02-10'),
  },
  {
    name: 'Tarun Nambiar',
    email: 'tarun.nambiar@vitstudent.ac.in',
    college: 'Vellore Institute of Technology (VIT)',
    city: 'Vellore',
    state: 'Tamil Nadu',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=256&h=256&q=80',
    totalPoints: 260,
    currentRank: 25,
    badgeTier: 'The Explorer',
    badges: ['The Explorer'],
    activitiesCount: 2,
    recentActivity: 'Initiated Campus Coding Circle & Git Onboarding',
    certificateStatus: 'pending',
    programStartDate: new Date('2026-02-15'),
    joinedAt: new Date('2026-02-15'),
  },
];

/**
 * Helper to generate synthetic realistic activity logs corresponding to points
 */
export const generateActivityLogsForAmbassador = (
  ambassadorId: mongoose.Types.ObjectId,
  targetPoints: number,
  activitiesCount: number,
  recentActivity: string
) => {
  const activities: Array<{
    ambassadorId: mongoose.Types.ObjectId;
    activityType: ActivityType;
    pointsAwarded: number;
    description: string;
    title: string;
    activityName: string;
    status: 'verified';
    verifiedAt: Date;
    verifiedBy: string;
  }> = [];

  const activityTemplates: Array<{ type: ActivityType; title: string; pts: number }> = [
    { type: 'hackathon_mentored', title: 'Campus Tech Hackathon Sprint', pts: 250 },
    { type: 'study_jam', title: 'Hands-on Study Jam (DSA & System Design)', pts: 150 },
    { type: 'workshop', title: 'Technical Workshop & Live Code Demo', pts: 120 },
    { type: 'peer_mentorship', title: 'Peer Project Deployment Mentorship', pts: 100 },
    { type: 'tech_blog', title: 'Campus Engineering Blog Guide', pts: 100 },
    { type: 'project_showcase', title: 'Interactive Tech Showcase Demo', pts: 180 },
    { type: 'student_onboarded', title: 'Study Circle Cohort Onboarding', pts: 20 },
  ];

  let remainingPoints = targetPoints;
  const daysAgoStep = Math.max(2, Math.floor(90 / (activitiesCount || 1)));

  for (let i = 0; i < activitiesCount; i++) {
    const isLast = i === activitiesCount - 1;
    let pts: number;
    let type: ActivityType;
    let title: string;

    if (isLast) {
      pts = Math.max(10, remainingPoints);
      type = 'study_jam';
      title = recentActivity;
    } else {
      const template = activityTemplates[i % activityTemplates.length];
      type = template.type;
      pts = Math.min(template.pts, Math.max(20, Math.floor(remainingPoints / (activitiesCount - i))));
      title = `${template.title} #${i + 1}`;
    }

    remainingPoints -= pts;
    const verifiedDate = new Date();
    verifiedDate.setDate(verifiedDate.getDate() - (activitiesCount - i) * daysAgoStep);

    activities.push({
      ambassadorId,
      activityType: type,
      pointsAwarded: pts,
      title,
      activityName: title,
      description: `Successfully conducted ${title} with high student participation. Verified for SSAP points.`,
      status: 'verified',
      verifiedAt: verifiedDate,
      verifiedBy: 'admin@skillrock.in',
    });
  }

  return activities;
};

/**
 * Main Seed Execution Function
 */
export const seedLeaderboardData = async (): Promise<void> => {
  console.log('🌱 Starting SSAP Leaderboard & Ambassador seeding...');

  // Optional: clear existing test ambassadors & activities
  const existingCount = await Ambassador.countDocuments();
  if (existingCount > 0) {
    console.log(`ℹ️  Found ${existingCount} existing ambassadors. Refreshing seed dataset...`);
    await Ambassador.deleteMany({ email: { $in: SEED_AMBASSADORS.map((a) => a.email) } });
  }

  const createdAmbassadors: IAmbassador[] = [];

  for (let i = 0; i < SEED_AMBASSADORS.length; i++) {
    const data = SEED_AMBASSADORS[i];
    const amb = await Ambassador.create({
      ...data,
      currentRank: i + 1,
    });
    createdAmbassadors.push(amb);

    // Generate corresponding activity logs
    const activityLogs = generateActivityLogsForAmbassador(
      amb._id as mongoose.Types.ObjectId,
      data.totalPoints,
      data.activitiesCount,
      data.recentActivity
    );

    if (activityLogs.length > 0) {
      await ActivityLog.insertMany(activityLogs);
    }
  }

  console.log(`✅ Successfully seeded ${createdAmbassadors.length} ambassadors and their activity logs!`);
};

export const ensureLeaderboardSeed = async (): Promise<void> => {
  try {
    const existingCount = await Ambassador.countDocuments();
    if (existingCount === 0) {
      console.log('🌱 No ambassadors found in DB. Auto-seeding initial leaderboard dataset...');
      await seedLeaderboardData();
    }
  } catch (err) {
    console.error('Error auto-seeding leaderboard:', err);
  }
};

/**
 * Standalone direct execution handler
 */
if (require.main === module) {
  const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/ssap_db';
  mongoose
    .connect(mongoUri)
    .then(async () => {
      console.log('Connected to MongoDB. Running seed...');
      await seedLeaderboardData();
      await mongoose.disconnect();
      console.log('Done.');
      process.exit(0);
    })
    .catch((err) => {
      console.error('Seed error:', err);
      process.exit(1);
    });
}
