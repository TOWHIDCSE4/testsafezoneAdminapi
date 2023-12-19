import mongoose, { Schema, Document } from 'mongoose';

export interface ParentsSetting extends Document {
  time: string;
  subject: string;
  quizes: string[]
}

const ParentsSettingSchema = new Schema(
  {
    time: {
      type: String,
      required: true,
      trim: true,
    },
    subject: {
      type: String,
      index: true,
      trim: true,
    }
    ,
    quizes: {
      type: [String],
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
