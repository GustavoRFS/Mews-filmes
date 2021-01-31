import mongoose from '@/database';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    lowerCase: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  profilePic: {
    type: String,
  },
  password: {
    type: String,
    required: true,
  },
});

export default mongoose.model('User', userSchema);
