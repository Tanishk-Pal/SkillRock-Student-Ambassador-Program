import mongoose, { Document, Schema } from 'mongoose';

export interface IApplication extends Document {
  applicationId: string;
  statusToken: string;
  
  // Personal Information
  fullName: string;
  email: string;
  phone: string;
  college: string;
  university: string;
  degree: string;
  year: string;
  branch: string;
  city: string;
  state: string;
  linkedinUrl?: string;
  instagramUrl?: string;
  preferredLanguage: string;
  weeklyAvailability: string;

  // Section 2: Motivation
  whyAmbassador: string;
  skillrockValue: string;
  timeContribution: string;
  priorExperience: string;
  priorExperienceDescription?: string;
  personalGoal: string;

  // Section 3: Situational Judgment
  scenario1Answer: string;
  scenario1Reasoning?: string;
  scenario2Answer: string;
  scenario3Answer: string;
  scenario4Answer: string;
  scenario5Answer: string;
  scenario6Answer: string;

  // Section 4: Campus Knowledge
  campusWaitingPlace: string;
  campusGatheringArea: string;
  campusReach500: string;
  campusEvent: string;
  campusTradition: string;

  // Section 5: Quick-Fire
  quickFire1: string;
  quickFire2: string;

  // Section 6: Video
  videoType: 'upload' | 'link';
  videoUrl?: string;
  videoFilePath?: string;

  // Declaration
  declarationAccepted: boolean;

  // Admin fields
  status: 'submitted' | 'under_review' | 'shortlisted' | 'interview' | 'selected' | 'not_selected';
  totalScore?: number;
  motivationScore?: number;
  situationalScore?: number;
  campusScore?: number;
  quickFireScore?: number;
  videoScore?: number;
  reviewerNotes?: string;
  internalNotes?: string;
  reviewedBy?: string;

  submittedAt: Date;
  updatedAt: Date;
}

const ApplicationSchema = new Schema<IApplication>(
  {
    applicationId: { type: String, required: true, unique: true },
    statusToken: { type: String, required: true, unique: true },

    fullName: { type: String, required: true, trim: true, maxlength: 200 },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Invalid email'],
    },
    phone: { type: String, required: true, trim: true, maxlength: 20 },
    college: { type: String, required: true, trim: true, maxlength: 300 },
    university: { type: String, required: true, trim: true, maxlength: 300 },
    degree: { type: String, required: true, trim: true, maxlength: 200 },
    year: { type: String, required: true },
    branch: { type: String, required: true, trim: true, maxlength: 200 },
    city: { type: String, required: true, trim: true, maxlength: 100 },
    state: { type: String, required: true, trim: true, maxlength: 100 },
    linkedinUrl: { type: String, trim: true, maxlength: 500 },
    instagramUrl: { type: String, trim: true, maxlength: 500 },
    preferredLanguage: { type: String, required: true },
    weeklyAvailability: { type: String, required: true },

    whyAmbassador: { type: String, required: true, maxlength: 3000 },
    skillrockValue: { type: String, required: true, maxlength: 3000 },
    timeContribution: { type: String, required: true },
    priorExperience: { type: String, required: true },
    priorExperienceDescription: { type: String, maxlength: 2000 },
    personalGoal: { type: String, required: true, maxlength: 2000 },

    scenario1Answer: { type: String, required: true },
    scenario1Reasoning: { type: String, maxlength: 1000 },
    scenario2Answer: { type: String, required: true },
    scenario3Answer: { type: String, required: true },
    scenario4Answer: { type: String, required: true },
    scenario5Answer: { type: String, required: true },
    scenario6Answer: { type: String, required: true },

    campusWaitingPlace: { type: String, required: true, maxlength: 2000 },
    campusGatheringArea: { type: String, required: true, maxlength: 2000 },
    campusReach500: { type: String, required: true, maxlength: 2000 },
    campusEvent: { type: String, required: true, maxlength: 2000 },
    campusTradition: { type: String, required: true, maxlength: 1000 },

    quickFire1: { type: String, required: true },
    quickFire2: { type: String, required: true },

    videoType: { type: String, enum: ['upload', 'link'], required: true },
    videoUrl: { type: String, maxlength: 1000 },
    videoFilePath: { type: String, maxlength: 500 },

    declarationAccepted: { type: Boolean, required: true },

    status: {
      type: String,
      enum: ['submitted', 'under_review', 'shortlisted', 'interview', 'selected', 'not_selected'],
      default: 'submitted',
    },
    totalScore: { type: Number, min: 0, max: 100 },
    motivationScore: { type: Number, min: 0, max: 20 },
    situationalScore: { type: Number, min: 0, max: 30 },
    campusScore: { type: Number, min: 0, max: 25 },
    quickFireScore: { type: Number, min: 0, max: 5 },
    videoScore: { type: Number, min: 0, max: 20 },
    reviewerNotes: { type: String, maxlength: 5000 },
    internalNotes: { type: String, maxlength: 5000 },
    reviewedBy: { type: String },
  },
  {
    timestamps: { createdAt: 'submittedAt', updatedAt: 'updatedAt' },
  }
);

ApplicationSchema.index({ status: 1 });
ApplicationSchema.index({ college: 1 });
ApplicationSchema.index({ state: 1 });
ApplicationSchema.index({ submittedAt: -1 });

export const Application = mongoose.model<IApplication>('Application', ApplicationSchema);
