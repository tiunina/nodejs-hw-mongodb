import { model, Schema } from 'mongoose';
import { handleSaveError, setUpdateSettings } from './hooks.js';
import { emailRegexp } from '../../constants/users.js';

const usersSchema = new Schema(
  {
    name: { type: String, required: true, minlength: 3, maxlength: 30 },
    email: { type: String, required: true, unique: true, math: emailRegexp },
    password: { type: String, required: true },
    verify: { type: Boolean, default: false, required: true },
  },
  { timestamps: true, versionKey: false },
);

usersSchema.post('save', handleSaveError);

usersSchema.pre('findOneAndUpdate', setUpdateSettings);

usersSchema.post('findOneAndUpdate', handleSaveError);

const UsersCollection = model('users', usersSchema);

export default UsersCollection;
