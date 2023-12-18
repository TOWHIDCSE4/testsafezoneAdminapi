import mongoose, { Schema, Document } from 'mongoose';

export interface ParentsSetting extends Document {
  time: number;
  subject: string;
}

const ParentsSettingSchema = new Schema(
  {
    time: {
      type: Number,
      required: true
    },
    subject: {
      type: String,
      index: true,
      trim: true,
    }
  },
  {
    timestamps: true,
    collection: 'parents_setting',
  }
);

export const ParentsSettingModel: mongoose.Model<ParentsSetting> =
  mongoose.models.ParentsSetting || mongoose.model<ParentsSetting>('ParentsSetting', ParentsSettingSchema);
