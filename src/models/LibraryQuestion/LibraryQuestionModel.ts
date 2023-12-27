import mongoose, { Schema, Document, ObjectId } from 'mongoose';
import { Answers } from '../Question/QuestionModel';

export interface LibraryQuestion extends Document {
  answers: Answers[];
  audio: string;
  description: string;
  result_content:string;
  image: string;
  name: string;
  category: string;
  age: number;
  params:string;
  subject_id:ObjectId;
  video: string;
  correct_answer: string[];
  incorrect_answer: string[];
}

const LibraryQuestionSchema = new Schema(
  {
    answers: {
      type: Schema.Types.Array,
    },
    correct_answer: {
        type: Schema.Types.Array,
      },
      incorrect_answer: {
        type: Schema.Types.Array,
      },
    audio: {
      type: String,
      trim: true
    },
    result_content: {
      type: String,
      trim: true
    },
    description: {
      type: String,
      trim: true
    }
    ,
    image: {
      type: String,
      trim: true
    }, 
    params: {
        type: Object,
        trim: true
    },
    category: {
        type: String,
        trim: true
    }
    ,
    name: {
      type: String,
      index: true,
      trim: true
    }
    ,
    age: {
        type: Number,
        required: true,
        index: true
    }
    ,
    subject_id: {
      type: Schema.Types.ObjectId,
      required: true,
      index: true
  },
    video: {
      type: String,
      trim: true
    }
  },
  {
    timestamps: true,
    collection: 'library_questions',
  }
);

export const LibraryQuestionModel: mongoose.Model<LibraryQuestion> =
  mongoose.models.LibraryQuestion || mongoose.model<LibraryQuestion>('LibraryQuestion', LibraryQuestionSchema);
