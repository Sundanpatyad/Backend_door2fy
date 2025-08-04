// ======== services/servicePlansService.js ========

import { findByPlanTypeRepository, findServiceByNameRepository, addServiceToPlanRepository, bulkUpdateServicesRepository, bulkAddServicesAllTypesRepository, getAllServicesRepository } from "../repositories/serviceRepository.js";




export const getServicePlansByTypeService = async (planType) => {
  if (!['Booking', 'Quick'].includes(planType)) throw new Error('Invalid plan type. Must be "Booking" or "Quick"');
  const plan = await findByPlanTypeRepository(planType);
  if (!plan) throw new Error(`No ${planType} plans found`);
  return plan;
};

export const getServiceByNameService = async (planType, serviceName) => {
  if (!planType || !serviceName) throw new Error('Plan type and service name are required');
  const service = await findServiceByNameRepository(planType, serviceName);
  if (!service || !service.services || service.services.length === 0) throw new Error('Service not found');
  return service.services[0];
};

export const addServiceToPlanService = async (planType, serviceData) => {
  if (!planType || !serviceData) throw new Error('Plan type and service data are required');
  const { name, subtitle, price, features } = serviceData;
  if (!name || !subtitle || !price || !features) throw new Error('Service name, subtitle, price, and features are required');
  const existing = await findServiceByNameRepository(planType, name);
  if (existing && existing.services && existing.services.length > 0) throw new Error('Service with this name already exists in the plan');
  return addServiceToPlanRepository(planType, serviceData);
};

export const bulkUpdateServicesService = async (planType, servicesData) => {
  if (!planType || !Array.isArray(servicesData)) throw new Error('Plan type and services array are required');
  for (const s of servicesData) {
    if (!s.name || !s.subtitle || !s.price || !s.features) throw new Error('Each service must have name, subtitle, price, and features');
  }
  const updated = await bulkUpdateServicesRepository(planType, servicesData);
  if (!updated) throw new Error('Service plan not found');
  return updated;
};

export const bulkAddServicesAllTypesService = async (servicesData) => {
  if (!servicesData || typeof servicesData !== 'object') throw new Error('Services data object is required');
  if (!servicesData.booking && !servicesData.quick) throw new Error('At least one of booking or quick services array is required');
  return  bulkAddServicesAllTypesRepository(servicesData);
};

export const getAllServicesService = async () => {
  const result = await getAllServicesRepository();
  if (!result || result.length === 0 || !result[0].services) throw new Error('No services found');
  return result[0].services;
};
