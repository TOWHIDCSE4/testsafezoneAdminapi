import mongoose, { Schema } from 'mongoose';
import { Gender } from '../Enums/Gender';
import { OnlineStatus } from '../Enums/OnlineStatus';

interface Child {
  parentId: string;
  fullname: string;
  gender: Gender;
  role: 'CHILDREN';
  status: OnlineStatus;
}

export const ChildModel: mongoose.Model<Child> =
  mongoose.models.Child ||
  mongoose.model<Child>(
    'Child',
    new Schema({
      parentId: {
        type: String,
        required: true,
        index: true,
      },
      fullname: String,
      gender: String,
      role: String,
      status: String,
    })
  );
