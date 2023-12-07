import mongoose, { Schema, Document } from 'mongoose';

export interface WebCategories extends Document {
  _id:number, 
  name: string;
  description: string;
}

const WebCategoriesSchema = new Schema(
  {
    _id:{
      type: Number,
      id:true,
      index:true,
      required: true,
      trim: true,
    },
    name: {
      type: String,
      index: true,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      index: true,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
    collection: 'web_categories',
  }
);

export const WebCategories: mongoose.Model<WebCategories> =
  mongoose.models.WebCategories || mongoose.model<WebCategories>('WebCategories', WebCategoriesSchema);
