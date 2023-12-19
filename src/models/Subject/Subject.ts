import mongoose, { Schema, Document } from 'mongoose';

export interface Subject extends Document {
    id: number;
    name: string;
    alias: string;
    slug: string;
    is_active: boolean;
}

const SubjectSchema = new Schema({
    id: {
        type: Number,
        required: true,
        unique: true,
        index: true,
        immutable: true
    },
    name: {
        type: String,
        required: true,
        trim: true,
        maxLength: 255
    },
    alias: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        maxLength: 255,
        index: true
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        maxLength: 255
    },
    is_active: {
        type: Boolean,
        required: true,
        default: true
    }
},
  {
    timestamps: true,
    collection: 'subjects',
  });

export const SubjectModel: mongoose.Model<Subject> =
  mongoose.models.Subject || mongoose.model<Subject>('Subject', SubjectSchema);
