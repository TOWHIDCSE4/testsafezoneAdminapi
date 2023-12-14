import mongoose, { Schema } from 'mongoose';

export interface Folder {
  name: string
}

export const FolderModel: mongoose.Model<Folder> =
  mongoose.models.Folder ||
  mongoose.model<Folder>(
    'Folder',
    new Schema(
      {
        name: { type: String, required: true }
      },
      {
        timestamps: true,
        collection: 'library_test_folder',
      }
    )
  );


