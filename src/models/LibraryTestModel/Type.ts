import mongoose, { Schema } from 'mongoose';

export interface Type {
  name: string
}

export const TypeModel: mongoose.Model<Type> =
  mongoose.models.Type ||
  mongoose.model<Type>(
    'Type',
    new Schema(
      {
        name: { type: String, required: true }
      },
      {
        timestamps: true,
        collection: 'library_test_type',
      }
    )
  );


