import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  // Personal Info (for all users)
  uid: { type: String, required: true, unique: true },
  name: { type: String, required: true },

  mobile: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },

  // User Type and Role for B2B/B2C
  userType: {
    type: String,
    required: true,
    enum: ['b2c', 'b2b'], // Business-to-Consumer or Business-to-Business
    default: 'b2c',
  },
  role: {
    type: String,
    required: true,
    enum: [
      'customer', // B2C user
      'company_admin', // B2B admin for their company
      'company_user', // B2B standard user
      'engineer', // Internal service engineer
      'super_admin', // Internal super administrator
    ],
    default: 'customer',
  },

  // B2B Specific Info
  company: {
    name: { type: String },
    taxId: { type: String }, // e.g., GSTIN, VAT ID
  },

  // General Info
  address: { type: String, required: false },
  status: {
    type: String,
    required: true,
    enum: ['active', 'pending_verification', 'suspended'],
    default: 'pending_verification',
  },
}, {
  timestamps: true,
});

const User = mongoose.model('User', userSchema);

export default User;
