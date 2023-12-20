import mongoose, { Schema, Document, ObjectId } from 'mongoose';
import '../Quiz/Quiz'

export interface ParentsSetting extends Document {
  time: string;
  subject: string;
  quizes: ObjectId[];
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
    quizes: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Quiz'
      }
    ],
  },
  {
    timestamps: true,
    collection: 'parents_setting',
  }
);

export const ParentsSettingModel: mongoose.Model<ParentsSetting> =
  mongoose.models.ParentsSetting || mongoose.model<ParentsSetting>('ParentsSetting', ParentsSettingSchema);
