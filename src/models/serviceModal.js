
    
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
      }]
    }, {
      _id: false 
    });
    
    const ServicePlansSchema = new mongoose.Schema({
      planType: {
        type: String,
        required: true,
        enum: ['Booking', 'Quick'],
        index: true
      },
      services: [ServicePlanSchema]
    }, {
      timestamps: true,
      collection: 'servicePlans'
    });

const ServicePlans = mongoose.model('ServicePlans', ServicePlansSchema);

export default ServicePlans;