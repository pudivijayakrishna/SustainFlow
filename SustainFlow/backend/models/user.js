import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['compostAgency', 'ngo', 'donor'],
    required: true,
  },
  location: String,
  contact: String,
  address: String,
}, {
  timestamps: true,
});

const User = mongoose.model('User', userSchema);

export default User;
