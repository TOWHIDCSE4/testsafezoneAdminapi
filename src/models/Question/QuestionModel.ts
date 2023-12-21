import mongoose, { Schema, Document } from 'mongoose';

export interface Question extends Document {
  answers: Answers[];
  audio: string;
  description: string;
  image: string;
  name: string;
  question_level: number;
  question_type: number;
  video: string;
}

export interface Answers extends Document {
    label: string;
    text: string;
    is_correct: boolean;
  }

const QuestionSchema = new Schema(
  {
    answers: {
      type: Schema.Types.Array,
      required: true
    },
    audio: {
      type: String,
      trim: true
    },
    description: {
      type: String,
      required: true,
      trim: true
    }
    ,
    image: {
      type: String,
      trim: true
    }
    ,
    name: {
      type: String,
      required: true,
      index: true,
      trim: true
    }
    ,
    question_level: {
      type: Number,
      required: true,
      index: true
    }
    ,
    question_type: {
        type: Number,
        required: true,
        index: true
    }
    ,
    video: {
      type: String,
      trim: true
    }
  },
  {
    timestamps: true,
    collection: 'questions',
  }
);

export const QuestionModel: mongoose.Model<Question> =
  mongoose.models.Question || mongoose.model<Question>('Question', QuestionSchema);
