import mongoose, { Schema } from 'mongoose';

export interface Tag {
  name: string
}

export const TagModel: mongoose.Model<Tag> =
  mongoose.models.Tag ||
  mongoose.model<Tag>(
    'Tag',
    new Schema(
      {
        name: { type: String, required: true }
      },
      {
        timestamps: true,
        collection: 'library_test_tags',
      }
    )
  );


