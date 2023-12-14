import mongoose, { Schema } from 'mongoose';

export interface Status {
  name: string
}

export const StatusModel: mongoose.Model<Status> =
  mongoose.models.Status ||
  mongoose.model<Status>(
    'Status',
    new Schema(
      {
        name: { type: String, required: true }
      },
      {
        timestamps: true,
        collection: 'library_test_status',
      }
    )
  );


