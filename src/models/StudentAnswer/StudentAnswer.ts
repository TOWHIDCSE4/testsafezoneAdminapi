import mongoose, { Schema, Document, ObjectId } from 'mongoose';
import { Answers } from '../Question';

export interface StudentAnswer extends Document {
  question_id: string
  question_level: number
  question_type: number
  selected_answer: Answers[]
  user_id: ObjectId
  subject_id: ObjectId
  is_correct: boolean
}

const StudentAnswerSchema = new Schema(
  {
    selected_answer: {
      type: Schema.Types.Array,
      required: true
    },
    question_id: {
      type: String,
      trim: true
    },
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
    subject_id: {
      type: Schema.Types.ObjectId,
      required: true,
      index: true
  },
  user_id: {
    type: Schema.Types.ObjectId,
    required: true,
    index: true
},
  is_correct: {
      type: Boolean,
      trim: true
    }
  },
  {
    timestamps: true,
    collection: 'student_answers',
  }
);

export const StudentAnswerModel: mongoose.Model<StudentAnswer> =
  mongoose.models.StudentAnswer || mongoose.model<StudentAnswer>('StudentAnswer', StudentAnswerSchema);
