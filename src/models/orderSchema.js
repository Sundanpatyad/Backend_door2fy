import mongoose from 'mongoose';

const ServiceItemSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    trim: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  quantity: {
    type: Number,
    default: 1
  },
  image: {
    type: String,
    default: null
  }
}, { _id: false });

const BookingDetailsSchema = new mongoose.Schema({
  date: {
    type: String,
    trim: true
  },
  time: {
    type: String,
    trim: true
  },
  address: {
    type: String,
    trim: true
  },
  services: [ServiceItemSchema]
}, { _id: false });

const OrderSchema = new mongoose.Schema({
  orderId: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  servicePlan: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ServicePlan',
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  currency: {
    type: String,
    default: 'INR',
    uppercase: true
  },
  status: {
    type: String,
    enum: ['created', 'pending', 'paid', 'failed', 'refunded'],
    default: 'created',
    index: true
  },
  razorpayOrderId: {
    type: String,
    trim: true,
    index: true
  },
  razorpayPaymentId: {
    type: String,
    trim: true
  },
  orderStatus: {
    type: String,
    trim: true,
    enum: ['Upcoming', 'Completed', 'Cancelled'],
    default: 'Upcoming'
  },
  razorpaySignature: {
    type: String,
    trim: true
  },
  customerDetails: {
    name: {
      type: String,
      trim: true
    },
    email: {
      type: String,
      trim: true,
      lowercase: true
    },
    phone: {
      type: String,
      trim: true
    }
  },
  bookingDetails: BookingDetailsSchema, // ✅ Added
  notes: {
    type: Map,
    of: String
  },
  receipt: {
    type: String,
    trim: true
  },
  failureReason: {
    type: String,
    trim: true
  },
  refundDetails: {
    refundId: String,
    amount: Number,
    status: String,
    refundedAt: Date
  }
}, {
  timestamps: true,
  collection: 'orders'
});

// Index for faster queries
OrderSchema.index({ userId: 1, status: 1 });
OrderSchema.index({ createdAt: -1 });

export const Order = mongoose.model('Order', OrderSchema);
