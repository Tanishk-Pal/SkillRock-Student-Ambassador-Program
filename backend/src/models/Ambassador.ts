import mongoose, { Document, Model, Schema } from 'mongoose';

/**
 * 4 Recognized Badge Tiers aligned with SSAP Digital Recognition Program
 */
export type BadgeTier = 'The Explorer' | 'The Trailblazer' | 'The Changemaker' | 'SkillRock Champ';

/**
 * Digital Certificate Status Lifecycle:
 * - 'pending': Points < 200 or activities < 2
 * - 'eligible': Points >= 200 and activities >= 2
 * - 'issued': Certificate officially generated and issued with certificateId
 */
export type CertificateStatus = 'pending' | 'eligible' | 'issued';

/**
 * Ambassador Account Status
 */
export type AmbassadorStatus = 'active' | 'graduated' | 'inactive';

/**
 * Full TypeScript Document Interface for Ambassador
 */
export interface IAmbassador extends Document {
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
  certificateIssuedAt?: Date;
  certificateIssueDate?: Date;
  programStartDate: Date;
  joinedAt: Date;
  status: AmbassadorStatus;
  applicationId?: string;
  createdAt: Date;
  updatedAt: Date;

  // Instance methods
  determineBadgeTier(): BadgeTier | null;
  recalculateBadgeTier(): BadgeTier | null;
  recalculateBadges(): string[];
}

/**
 * Static Model Interface
 */
export interface IAmbassadorModel extends Model<IAmbassador> {
  determineBadgeTier(points: number): BadgeTier | null;
  calculateBadgeTier(points: number): BadgeTier | null;
  calculateBadges(points: number): string[];
}

export const BADGE_TIER_THRESHOLDS = {
  EXPLORER: 200,
  TRAILBLAZER: 600,
  CHANGEMAKER: 1200,
  CHAMP: 2000,
} as const;

export const BADGE_NAMES: BadgeTier[] = [
  'The Explorer',
  'The Trailblazer',
  'The Changemaker',
  'SkillRock Champ',
];

const AmbassadorSchema = new Schema<IAmbassador, IAmbassadorModel>(
  {
    name: {
      type: String,
      required: [true, 'Ambassador name is required'],
      trim: true,
      maxlength: [200, 'Name cannot exceed 200 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Invalid email address format'],
    },
    college: {
      type: String,
      required: [true, 'College name is required'],
      trim: true,
      maxlength: [300, 'College name cannot exceed 300 characters'],
      index: true,
    },
    city: {
      type: String,
      required: [true, 'City is required'],
      trim: true,
      maxlength: [100, 'City cannot exceed 100 characters'],
    },
    state: {
      type: String,
      required: [true, 'State is required'],
      trim: true,
      maxlength: [100, 'State cannot exceed 100 characters'],
      index: true,
    },
    avatar: {
      type: String,
      default: function (this: IAmbassador) {
        return `https://ui-avatars.com/api/?name=${encodeURIComponent(
          this.name || 'Ambassador'
        )}&background=346BF1&color=fff&bold=true`;
      },
    },
    totalPoints: {
      type: Number,
      default: 0,
      min: [0, 'Total points cannot be negative'],
      index: true,
    },
    currentRank: {
      type: Number,
      default: 0,
      min: 0,
    },
    badgeTier: {
      type: String,
      enum: {
        values: [...BADGE_NAMES, null, ''],
        message: '{VALUE} is not a valid SSAP badge tier',
      },
      default: null,
      index: true,
    },
    badges: {
      type: [String],
      default: [],
    },
    activitiesCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    recentActivity: {
      type: String,
      default: 'Joined SkillRock Student Ambassador Program',
      maxlength: [300, 'Recent activity cannot exceed 300 characters'],
    },
    certificateStatus: {
      type: String,
      enum: ['pending', 'eligible', 'issued'],
      default: 'pending',
      index: true,
    },
    certificateId: {
      type: String,
      sparse: true,
      unique: true,
      trim: true,
      match: [/^SSAP-\d{4}-CERT-\d{3,}$/, 'Certificate ID must match SSAP-YYYY-CERT-XXX format'],
    },
    certificateIssuedAt: {
      type: Date,
    },
    certificateIssueDate: {
      type: Date,
    },
    programStartDate: {
      type: Date,
      default: Date.now,
    },
    joinedAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
    status: {
      type: String,
      enum: ['active', 'graduated', 'inactive'],
      default: 'active',
      index: true,
    },
    applicationId: {
      type: String,
      index: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: function (_doc, ret: Record<string, any>) {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
    toObject: {
      virtuals: true,
      transform: function (_doc, ret: Record<string, any>) {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Indexes
AmbassadorSchema.index({ totalPoints: -1, updatedAt: 1 });
AmbassadorSchema.index({ totalPoints: -1, activitiesCount: -1, joinedAt: 1, _id: 1 });
AmbassadorSchema.index({ college: 1, totalPoints: -1 });
AmbassadorSchema.index({ state: 1, totalPoints: -1 });
AmbassadorSchema.index({ badgeTier: 1, totalPoints: -1 });
AmbassadorSchema.index(
  { name: 'text', college: 'text', city: 'text' },
  { weights: { name: 5, college: 3, city: 1 }, name: 'AmbassadorTextIndex' }
);

/**
 * Static Helper: Compute highest badge tier from points
 * Returns null if points < 200
 */
AmbassadorSchema.statics.determineBadgeTier = function (points: number): BadgeTier | null {
  if (points >= BADGE_TIER_THRESHOLDS.CHAMP) return 'SkillRock Champ';
  if (points >= BADGE_TIER_THRESHOLDS.CHANGEMAKER) return 'The Changemaker';
  if (points >= BADGE_TIER_THRESHOLDS.TRAILBLAZER) return 'The Trailblazer';
  if (points >= BADGE_TIER_THRESHOLDS.EXPLORER) return 'The Explorer';
  return null;
};

AmbassadorSchema.statics.calculateBadgeTier = function (points: number): BadgeTier | null {
  return (this as any).determineBadgeTier(points);
};

/**
 * Static Helper: Compute all earned badges array from points
 * Returns empty array [] if points < 200
 */
AmbassadorSchema.statics.calculateBadges = function (points: number): string[] {
  const earned: string[] = [];
  if (points >= BADGE_TIER_THRESHOLDS.EXPLORER) earned.push('The Explorer');
  if (points >= BADGE_TIER_THRESHOLDS.TRAILBLAZER) earned.push('The Trailblazer');
  if (points >= BADGE_TIER_THRESHOLDS.CHANGEMAKER) earned.push('The Changemaker');
  if (points >= BADGE_TIER_THRESHOLDS.CHAMP) earned.push('SkillRock Champ');
  return earned;
};

/**
 * Instance Methods
 */
AmbassadorSchema.methods.determineBadgeTier = function (this: IAmbassador): BadgeTier | null {
  return (this.constructor as IAmbassadorModel).determineBadgeTier(this.totalPoints);
};

AmbassadorSchema.methods.recalculateBadgeTier = function (this: IAmbassador): BadgeTier | null {
  return (this.constructor as IAmbassadorModel).determineBadgeTier(this.totalPoints);
};

AmbassadorSchema.methods.recalculateBadges = function (this: IAmbassador): string[] {
  return (this.constructor as IAmbassadorModel).calculateBadges(this.totalPoints);
};

/**
 * Pre-Save Hook: Automatically align badgeTier, badges array, and certificateStatus
 */
AmbassadorSchema.pre<IAmbassador>('save', function (next) {
  if (this.isModified('totalPoints')) {
    const ModelRef = this.constructor as IAmbassadorModel;
    this.badgeTier = ModelRef.determineBadgeTier(this.totalPoints);
    this.badges = ModelRef.calculateBadges(this.totalPoints);

    // Auto-update certificate eligibility if not already issued
    if (this.certificateStatus !== 'issued') {
      if (this.totalPoints >= BADGE_TIER_THRESHOLDS.EXPLORER && this.activitiesCount >= 2) {
        this.certificateStatus = 'eligible';
      } else {
        this.certificateStatus = 'pending';
      }
    }
  }
  next();
});

export const Ambassador = mongoose.model<IAmbassador, IAmbassadorModel>(
  'Ambassador',
  AmbassadorSchema
);
