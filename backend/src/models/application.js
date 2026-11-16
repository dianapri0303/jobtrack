import { Schema, model } from 'mongoose';

export const STATUSES = ['applied', 'interview', 'offer', 'rejected'];

const applicationSchema = new Schema(
  {
    owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    company: { type: String, required: true, trim: true },
    position: { type: String, required: true, trim: true },
    link: { type: String, trim: true },
    status: { type: String, enum: STATUSES, default: 'applied' },
    appliedAt: { type: Date, default: Date.now },
    recruiterName: { type: String, trim: true },
    recruiterContact: { type: String, trim: true },
    followUpDate: { type: Date },
    notes: { type: String, trim: true },
  },
  { timestamps: true, versionKey: false },
);

export const Application = model('Application', applicationSchema);