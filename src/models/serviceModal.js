import mongoose from 'mongoose';

const ServicePlanSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  subtitle: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  features: [{
    type: String,
    required: true,
    trim: true
  }],
  planType: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ServicePlans',
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
    trim: true,
  }
}, {
  timestamps: true,
  collection: 'servicePlan'
});

export const ServicePlan = mongoose.model('ServicePlan', ServicePlanSchema);
