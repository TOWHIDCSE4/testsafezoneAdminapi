import mongoose, { Schema, Document } from 'mongoose';

export interface CategoryDomain extends Document {
  category_id: string;
  host: string;
}

const CategoryDomainSchema = new Schema(
  {
    category_id: {
      type: String,
      unique: true,
      index: true,
      required: true,
      trim: true,
    },
    host: {
      type: String,
      trim: true,
    }
  },
  {
    timestamps: true,
    collection: 'category_domain',
  }
);

export const CategoryDomain: mongoose.Model<CategoryDomain> =
  mongoose.models.CategoryDomain || mongoose.model<CategoryDomain>('CategoryDomain', CategoryDomainSchema);
