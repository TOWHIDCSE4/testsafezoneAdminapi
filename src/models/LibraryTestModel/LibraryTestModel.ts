import mongoose, { Schema, ObjectId } from 'mongoose';
import '@/models/User';
import './Folder';
import './Level';
import './Status';
import './Type';


export interface LibraryTest {
  topic: string;
  folder: ObjectId;
  type: ObjectId;
  level: ObjectId;
  status: ObjectId;
  test_time: number;
  user: string;
  canceledAt: Date;
  deletedAt?: Date;
}

const schema = new Schema({
    topic: {
        type: String,
        required: true,
        index: true,
        trim: true,
        },
  folder: {
    type: Schema.Types.ObjectId,
    ref: 'Folder',
    index: true,
  },
  type: {
    type: Schema.Types.ObjectId,
    ref: 'Type',
    index: true,
  },
  level: {
    type: Schema.Types.ObjectId,
    ref: 'Level',
    index: true,
  },
  status: {
    type: Schema.Types.ObjectId,
    ref: 'Status',
    index: true,
  },
  test_time: {
    type: Number,
    required: true
    },
  user: {
    type: Schema.Types.String,
    ref: 'User'
  }
},
{
    timestamps: true,
    collection: 'library_test',
  });


export const LibraryTestModel: mongoose.Model<LibraryTest> =
  mongoose.models.LibraryTest ||
  mongoose.model<LibraryTest>('LibraryTest', schema);

