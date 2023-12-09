import mongoose, { Schema, Document } from 'mongoose';

export interface CategoryDomain extends Document {
  category_id: number;
  host: string;
}

const CategoryDomainSchema = new Schema(
  {
    category_id: {
      type: Schema.Types.Number,
      ref: 'WebCategories',
      required: true
    },
    host: {
      type: String,
      required: true,
      index: true,
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
