import ServicePlans from "../models/serviceModal.js";


export const findByPlanTypeRepository = async (planType) => ServicePlans.findOne({ planType }).lean();

export const findServiceByNameRepository = async (planType, serviceName) =>
  ServicePlans.findOne(
    { planType },
    { services: { $elemMatch: { name: serviceName } } }
  ).lean();

export const addServiceToPlanRepository = async (planType, serviceData) =>
  ServicePlans.findOneAndUpdate(
    { planType },
    { $push: { services: serviceData } },
    { new: true, runValidators: true }
  );

export const bulkUpdateServicesRepository = async (planType, servicesData) =>
  ServicePlans.findOneAndUpdate(
    { planType },
    { $set: { services: servicesData } },
    { new: true, runValidators: true }
  );

export const bulkAddServicesAllTypesRepository = async (servicesData) => {
  const results = {};

  if (servicesData.booking && Array.isArray(servicesData.booking)) {
    results.Booking = await ServicePlans.findOneAndUpdate(
      { planType: 'Booking' },
      { $push: { services: { $each: servicesData.booking } } },
      { new: true, runValidators: true, upsert: true }
    );
  }

  if (servicesData.quick && Array.isArray(servicesData.quick)) {
    results.Quick = await ServicePlans.findOneAndUpdate(
      { planType: 'Quick' },
      { $push: { services: { $each: servicesData.quick } } },
      { new: true, runValidators: true, upsert: true }
    );
  }

  return results;
};

export const getAllServicesRepository = async () => {
  return ServicePlans.aggregate([
    { $unwind: '$services' },
    {
      $group: {
        _id: null,
        services: { $push: { planType: '$planType', service: '$services' } },
      },
    },
    { $project: { _id: 0, services: 1 } },
  ]);
};
