import mongoose, { Schema, Document } from 'mongoose';

export interface Quiz extends Document {
    id: number;
    name: string;
}

const QuizSubjectSchema = new Schema({
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
    }
},
  {
    timestamps: true,
    collection: 'quizes',
  });

export const QuizModel: mongoose.Model<Quiz> =
  mongoose.models.Quiz || mongoose.model<Quiz>('Quiz', QuizSubjectSchema);
