import mongoose, { Schema } from 'mongoose';

export interface Level {
  name: string
}

export const LevelModel: mongoose.Model<Level> =
  mongoose.models.Level ||
  mongoose.model<Level>(
    'Level',
    new Schema(
      {
        name: { type: String, required: true }
      },
      {
        timestamps: true,
        collection: 'library_test_level',
      }
    )
  );


