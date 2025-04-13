import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  xp: { type: Number, default: 0 },
  level: { type: Number, default: 1 },
  achievements: { type: [String], default: [] },
});

const User = mongoose.model('User', userSchema);
export default User;