
import STATUS_CODES from '../constants/statusCodes.js';
import {
  getServicePlansByTypeService,
  getServiceByNameService,
  addServiceToPlanService,
  bulkUpdateServicesService,
  bulkAddServicesAllTypesService,
  getAllServicesService,
} from '../services/servicePlanService.js';



export const getServicePlansByTypeController = async (req, res) => {
  try {
    const { planType } = req.params;
    const plan = await getServicePlansByTypeService(planType);
    res.status(STATUS_CODES.SUCCESS).json({ success: true, data: plan, message: `${planType} plans retrieved successfully` });
  } catch (error) {
    const code = error.message.includes('Invalid') ? STATUS_CODES.BAD_REQUEST : error.message.includes('not found') ? STATUS_CODES.NOT_FOUND : STATUS_CODES.INTERNAL_SERVER_ERROR;
    res.status(code).json({ success: false, message: error.message });
  }
};

export const getServiceByNameController = async (req, res) => {
  try {
    const { planType, serviceName } = req.params;
    const service = await getServiceByNameService(planType, serviceName);
    res.status(STATUS_CODES.SUCCESS).json({ success: true, data: service, message: 'Service retrieved successfully' });
  } catch (error) {
    const code = error.message.includes('required') ? STATUS_CODES.BAD_REQUEST : error.message.includes('not found') ? STATUS_CODES.NOT_FOUND : STATUS_CODES.INTERNAL_SERVER_ERROR;
    res.status(code).json({ success: false, message: error.message });
  }
};

export const addServiceToPlanController = async (req, res) => {
  try {
    const { planType } = req.params;
    const updated = await addServiceToPlanService(planType, req.body);
    res.status(STATUS_CODES.CREATED).json({ success: true, data: updated, message: 'Service added to plan successfully' });
  } catch (error) {
    const code = error.message.includes('required') ? STATUS_CODES.BAD_REQUEST : error.message.includes('already exists') ? STATUS_CODES.CONFLICT : STATUS_CODES.INTERNAL_SERVER_ERROR;
    res.status(code).json({ success: false, message: error.message });
  }
};

export const bulkUpdateServicesController = async (req, res) => {
  try {
    const { planType } = req.params;
    const updated = await bulkUpdateServicesService(planType, req.body.services);
    res.status(STATUS_CODES.SUCCESS).json({ success: true, data: updated, message: 'Services updated successfully' });
  } catch (error) {
    const code = error.message.includes('required') ? STATUS_CODES.BAD_REQUEST : error.message.includes('not found') ? STATUS_CODES.NOT_FOUND : STATUS_CODES.INTERNAL_SERVER_ERROR;
    res.status(code).json({ success: false, message: error.message });
  }
};

export const bulkAddServicesAllTypesController = async (req, res) => {
  try {
    const results = await bulkAddServicesAllTypesService(req.body);
    res.status(STATUS_CODES.CREATED).json({ success: true, data: results, message: 'Services added to plan types successfully' });
  } catch (error) {
    const code = error.message.includes('required') ? STATUS_CODES.BAD_REQUEST : STATUS_CODES.INTERNAL_SERVER_ERROR;
    res.status(code).json({ success: false, message: error.message });
  }
};

export const getAllServicesController = async (req, res) => {
  try {
    const services = await getAllServicesService();
    res.status(STATUS_CODES.SUCCESS).json({ success: true, data: services, message: 'All services retrieved successfully' });
  } catch (error) {
    res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ success: false, message: error.message });
  }
};
