import mongoose, { Document, Schema } from 'mongoose';

export interface IApplication extends Document {
  applicationId: string;
  statusToken: string;
  
  // Essential Personal & Academic Information
  fullName: string;
  email: string;
  phone: string;
  college: string;
  university?: string;
  degree: string;
  year: string;
  branch: string;
  city: string;
  state: string;
  linkedinUrl?: string;
  instagramUrl?: string;
  preferredLanguage?: string;
  weeklyAvailability?: string;

  // Essential Leadership & Vision
  whyAmbassador: string;
  personalGoal: string; // Campus event / study circle vision
  skillrockValue?: string;
  timeContribution?: string;
  priorExperience?: string;
  priorExperienceDescription?: string;

  // Legacy fields (optional for backward compatibility)
  scenario1Answer?: string;
  scenario1Reasoning?: string;
  scenario2Answer?: string;
  scenario3Answer?: string;
  scenario4Answer?: string;
  scenario5Answer?: string;
  scenario6Answer?: string;

  campusWaitingPlace?: string;
  campusGatheringArea?: string;
  campusReach500?: string;
  campusEvent?: string;
  campusTradition?: string;

  quickFire1?: string;
  quickFire2?: string;

  // Video Introduction
  videoType: 'upload' | 'link';
  videoUrl?: string;
  videoFilePath?: string;

  // Declaration
  declarationAccepted: boolean;

  // Admin Review fields
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
    university: { type: String, trim: true, maxlength: 300 },
    degree: { type: String, required: true, trim: true, maxlength: 200 },
    year: { type: String, required: true },
    branch: { type: String, required: true, trim: true, maxlength: 200 },
    city: { type: String, required: true, trim: true, maxlength: 100 },
    state: { type: String, required: true, trim: true, maxlength: 100 },
    linkedinUrl: { type: String, trim: true, maxlength: 500 },
    instagramUrl: { type: String, trim: true, maxlength: 500 },
    preferredLanguage: { type: String, default: 'English' },
    weeklyAvailability: { type: String, default: '3–5 hours' },

    whyAmbassador: { type: String, required: true, maxlength: 3000 },
    personalGoal: { type: String, required: true, maxlength: 3000 },
    skillrockValue: { type: String, maxlength: 3000 },
    timeContribution: { type: String },
    priorExperience: { type: String },
    priorExperienceDescription: { type: String, maxlength: 2000 },

    // Legacy fields
    scenario1Answer: { type: String },
    scenario1Reasoning: { type: String, maxlength: 1000 },
    scenario2Answer: { type: String },
    scenario3Answer: { type: String },
    scenario4Answer: { type: String },
    scenario5Answer: { type: String },
    scenario6Answer: { type: String },

    campusWaitingPlace: { type: String, maxlength: 2000 },
    campusGatheringArea: { type: String, maxlength: 2000 },
    campusReach500: { type: String, maxlength: 2000 },
    campusEvent: { type: String, maxlength: 2000 },
    campusTradition: { type: String, maxlength: 1000 },

    quickFire1: { type: String },
    quickFire2: { type: String },

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
