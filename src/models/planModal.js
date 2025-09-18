import mongoose from 'mongoose';

const ServicePlansSchema = new mongoose.Schema({
  planType: {
    type: String,
    required: true,
    enum: ['Booking', 'Quick'],
    index: true
  },
}, {
  timestamps: true,
  collection: 'servicePlans'
});

export const ServicePlans = mongoose.model('ServicePlansType', ServicePlansSchema);
    