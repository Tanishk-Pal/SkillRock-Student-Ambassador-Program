import mongoose, { Document, Schema } from 'mongoose';

export type ActivityType =
  | 'study_jam'
  | 'workshop'
  | 'peer_mentorship'
  | 'tech_article'
  | 'tech_blog'
  | 'hackathon'
  | 'hackathon_mentored'
  | 'student_onboarding'
  | 'student_onboarded'
  | 'campus_demo'
  | 'project_showcase';

export type ActivityVerificationStatus = 'pending' | 'verified' | 'rejected';

export interface IActivityLog extends Document {
  ambassadorId: mongoose.Types.ObjectId;
  activityType: ActivityType;
  activityName?: string;
  title?: string;
  pointsAwarded: number;
  description: string;
  verifiedAt: Date;
  verifiedBy?: string;
  status: ActivityVerificationStatus;
  proofUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ActivityLogSchema = new Schema<IActivityLog>(
  {
    ambassadorId: {
      type: Schema.Types.ObjectId,
      ref: 'Ambassador',
      required: [true, 'Ambassador ID reference is required'],
      index: true,
    },
    activityType: {
      type: String,
      required: [true, 'Activity type is required'],
      enum: {
        values: [
          'study_jam',
          'workshop',
          'peer_mentorship',
          'tech_article',
          'tech_blog',
          'hackathon',
          'hackathon_mentored',
          'student_onboarding',
          'student_onboarded',
          'campus_demo',
          'project_showcase',
        ],
        message: '{VALUE} is not a recognized activity type',
      },
      index: true,
    },
    activityName: {
      type: String,
      trim: true,
      maxlength: [200, 'Activity name cannot exceed 200 characters'],
    },
    title: {
      type: String,
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    pointsAwarded: {
      type: Number,
      required: [true, 'Points awarded is required'],
      min: [0, 'Points awarded cannot be negative'],
    },
    description: {
      type: String,
      required: [true, 'Activity description is required'],
      trim: true,
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    proofUrl: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ['pending', 'verified', 'rejected'],
      default: 'verified',
      index: true,
    },
    verifiedAt: {
      type: Date,
      default: Date.now,
    },
    verifiedBy: {
      type: String,
      trim: true,
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
ActivityLogSchema.index({ ambassadorId: 1, verifiedAt: -1 });
ActivityLogSchema.index({ activityType: 1, verifiedAt: -1 });
ActivityLogSchema.index({ status: 1, createdAt: -1 });

export const ActivityLog = mongoose.model<IActivityLog>(
  'ActivityLog',
  ActivityLogSchema
);
