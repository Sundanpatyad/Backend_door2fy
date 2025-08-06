import { Category } from "../models/categoryModal.js";
import { ServicePlan } from "../models/serviceModal.js";
import { ServicePlans } from "../models/planModal.js";
import mongoose from 'mongoose';

export const addServiceToPlanRepository = async (planType, serviceData) => {
  // First, find or create the ServicePlans document for the planType
  let servicePlan = await ServicePlans.findOne({ planType });
  if (!servicePlan) {
    servicePlan = await ServicePlans.create({ planType });
  }

  // Create the new service with reference to the ServicePlans document
  const newService = await ServicePlan.create({
    ...serviceData,
    planType: servicePlan._id
  });

  return newService;
};

export const bulkAddServicesAllTypesRepository = async (servicesData) => {
  const results = {};

  if (servicesData.booking && Array.isArray(servicesData.booking)) {
    // Find or create Booking ServicePlans document
    let bookingPlan = await ServicePlans.findOne({ planType: 'Booking' });
    if (!bookingPlan) {
      bookingPlan = await ServicePlans.create({ planType: 'Booking' });
    }

    // Create all booking services
    const bookingServices = await ServicePlan.insertMany(
      servicesData.booking.map(service => ({
        ...service,
        planType: bookingPlan._id
      }))
    );
    results.Booking = bookingServices;
  }

  if (servicesData.quick && Array.isArray(servicesData.quick)) {
    // Find or create Quick ServicePlans document
    let quickPlan = await ServicePlans.findOne({ planType: 'Quick' });
    if (!quickPlan) {
      quickPlan = await ServicePlans.create({ planType: 'Quick' });
    }

    // Create all quick services
    const quickServices = await ServicePlan.insertMany(
      servicesData.quick.map(service => ({
        ...service,
        planType: quickPlan._id
      }))
    );
    results.Quick = quickServices;
  }

  return results;
};

export const getAllServicesRepository = async () => {
  return ServicePlan.aggregate([
    {
      $lookup: {
        from: 'servicePlans',
        localField: 'planType',
        foreignField: '_id',
        as: 'planDetails'
      }
    },
    {
      $lookup: {
        from: 'categories',
        localField: 'category',
        foreignField: '_id',
        as: 'categoryDetails'
      }
    },
    {
      $unwind: '$planDetails'
    },
    {
      $unwind: '$categoryDetails'
    },
    {
      $group: {
        _id: null,
        services: {
          $push: {
            serviceId: '$_id',
            planType: '$planDetails.planType',
            name: '$name',
            subtitle: '$subtitle',
            price: '$price',
            features: '$features',
            category: {
              id: '$categoryDetails._id',
              name: '$categoryDetails.name',
              description: '$categoryDetails.description'
            }
          }
        }
      }
    },
    { $project: { _id: 0, services: 1 } }
  ]);
};

export const getServicesByPlanTypeRepository = async (planType) => {
  const servicePlan = await ServicePlans.findOne({ planType });
  if (!servicePlan) {
    return null;
  }

  return ServicePlan.aggregate([
    {
      $match: { planType: servicePlan._id }
    },
    {
      $lookup: {
        from: 'categories',
        localField: 'category',
        foreignField: '_id',
        as: 'categoryDetails'
      }
    },
    {
      $unwind: '$categoryDetails'
    },
    {
      $group: {
        _id: null,
        planType: { $first: planType },
        services: {
          $push: {
            serviceId: '$_id',
            name: '$name',
            subtitle: '$subtitle',
            price: '$price',
            features: '$features',
            category: {
              id: '$categoryDetails._id',
              name: '$categoryDetails.name',
              description: '$categoryDetails.description'
            }
          }
        }
      }
    },
    {
      $project: {
        _id: 0,
        planType: 1,
        services: 1
      }
    }
  ]);
};

export const getServiceByIdRepository = async (serviceId) => {
  return ServicePlan.aggregate([
    {
      $match: { _id: new mongoose.Types.ObjectId(serviceId) }
    },
    {
      $lookup: {
        from: 'servicePlans',
        localField: 'planType',
        foreignField: '_id',
        as: 'planDetails'
      }
    },
    {
      $lookup: {
        from: 'categories',
        localField: 'category',
        foreignField: '_id',
        as: 'categoryDetails'
      }
    },
    {
      $unwind: '$planDetails'
    },
    {
      $unwind: '$categoryDetails'
    },
    {
      $project: {
        serviceId: '$_id',
        planType: '$planDetails.planType',
        name: '$name',
        subtitle: '$subtitle',
        price: '$price',
        features: '$features',
        category: {
          id: '$categoryDetails._id',
          name: '$categoryDetails.name',
          description: '$categoryDetails.description'
        }
      }
    }
  ]);
};

export const getServicesByCategoryRepository = async (categoryId) => {
  return ServicePlan.aggregate([
    {
      $match: { category: new mongoose.Types.ObjectId(categoryId) }
    },
    {
      $lookup: {
        from: 'servicePlans',
        localField: 'planType',
        foreignField: '_id',
        as: 'planDetails'
      }
    },
    {
      $lookup: {
        from: 'categories',
        localField: 'category',
        foreignField: '_id',
        as: 'categoryDetails'
      }
    },
    {
      $unwind: '$planDetails'
    },
    {
      $unwind: '$categoryDetails'
    },
    {
      $group: {
        _id: '$planDetails.planType',
        category: {
          $first: {
            id: '$categoryDetails._id',
            name: '$categoryDetails.name',
            description: '$categoryDetails.description'
          }
        },
        services: {
          $push: {
            serviceId: '$_id',
            name: '$name',
            subtitle: '$subtitle',
            price: '$price',
            features: '$features'
          }
        }
      }
    },
    {
      $project: {
        planType: '$_id',
        category: 1,
        services: 1,
        _id: 0
      }
    }
  ]);
};