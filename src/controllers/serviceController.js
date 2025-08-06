import STATUS_CODES from '../constants/statusCodes.js';
import {
  addServiceToPlanService,
  bulkAddServicesAllTypesService,
  getAllServicesService,
  getServicesByPlanTypeService,
  getServiceByIdService,
  getServicesByCategoryService,
} from '../services/servicePlanService.js';

export const addServiceToPlanController = async (req, res) => {
  try {
    const { planType } = req.params;
    const updated = await addServiceToPlanService(planType, req.body);
    res.status(STATUS_CODES.CREATED).json({ 
      success: true, 
      data: updated, 
      message: 'Service added to plan successfully' 
    });
  } catch (error) {
    const code = error.message.includes('required') || 
                 error.message.includes('Invalid') || 
                 error.message.includes('must be') ||
                 error.message.includes('not found') ||
                 error.message.includes('format')
      ? STATUS_CODES.BAD_REQUEST 
      : error.message.includes('already exists') 
      ? STATUS_CODES.CONFLICT 
      : STATUS_CODES.INTERNAL_SERVER_ERROR;
    res.status(code).json({ success: false, message: error.message });
  }
};

export const bulkAddServicesAllTypesController = async (req, res) => {
  try {
    const results = await bulkAddServicesAllTypesService(req.body);
    res.status(STATUS_CODES.CREATED).json({ 
      success: true, 
      data: results, 
      message: 'Services added to plan types successfully' 
    });
  } catch (error) {
    const code = error.message.includes('required') || 
                 error.message.includes('must have') || 
                 error.message.includes('must be') ||
                 error.message.includes('Invalid') ||
                 error.message.includes('not found') ||
                 error.message.includes('format')
      ? STATUS_CODES.BAD_REQUEST 
      : STATUS_CODES.INTERNAL_SERVER_ERROR;
    res.status(code).json({ success: false, message: error.message });
  }
};

export const getAllServicesController = async (req, res) => {
  try {
    const services = await getAllServicesService();
    res.status(STATUS_CODES.SUCCESS).json({ 
      success: true, 
      data: services, 
      message: 'All services retrieved successfully' 
    });
  } catch (error) {
    const code = error.message.includes('not found') 
      ? STATUS_CODES.NOT_FOUND 
      : STATUS_CODES.INTERNAL_SERVER_ERROR;
    res.status(code).json({ success: false, message: error.message });
  }
};

export const getServicesByPlanTypeController = async (req, res) => {
  try {
    const { planType } = req.params;
    const plan = await getServicesByPlanTypeService(planType);
    res.status(STATUS_CODES.SUCCESS).json({ 
      success: true, 
      data: plan, 
      message: `${planType} services retrieved successfully` 
    });
  } catch (error) {
    const code = error.message.includes('Invalid') || 
                 error.message.includes('required') 
      ? STATUS_CODES.BAD_REQUEST 
      : error.message.includes('not found') 
      ? STATUS_CODES.NOT_FOUND 
      : STATUS_CODES.INTERNAL_SERVER_ERROR;
    res.status(code).json({ success: false, message: error.message });
  }
};

export const getServiceByIdController = async (req, res) => {
  try {
    const { serviceId } = req.params;
    const service = await getServiceByIdService(serviceId);
    res.status(STATUS_CODES.SUCCESS).json({ 
      success: true, 
      data: service, 
      message: 'Service retrieved successfully' 
    });
  } catch (error) {
    const code = error.message.includes('required') ||
                 error.message.includes('Invalid') ||
                 error.message.includes('format')
      ? STATUS_CODES.BAD_REQUEST 
      : error.message.includes('not found') 
      ? STATUS_CODES.NOT_FOUND 
      : STATUS_CODES.INTERNAL_SERVER_ERROR;
    res.status(code).json({ success: false, message: error.message });
  }
};

export const getServicesByCategoryController = async (req, res) => {
  try {
    const { category } = req.params;
    const services = await getServicesByCategoryService(category);
    res.status(STATUS_CODES.SUCCESS).json({ 
      success: true, 
      data: services, 
      message: `Services for category '${category}' retrieved successfully` 
    });
  } catch (error) {
    const code = error.message.includes('required') 
      ? STATUS_CODES.BAD_REQUEST 
      : error.message.includes('not found') 
      ? STATUS_CODES.NOT_FOUND 
      : STATUS_CODES.INTERNAL_SERVER_ERROR;
    res.status(code).json({ success: false, message: error.message });
  }
};