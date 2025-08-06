import express from 'express';
import {
  addServiceToPlanController,
  bulkAddServicesAllTypesController,
  getAllServicesController,
  getServicesByPlanTypeController,
  getServiceByIdController,
  getServicesByCategoryController,
} from '../controllers/serviceController.js';

const router = express.Router();

router.post('/plan/:planType/service', addServiceToPlanController);

router.post('/bulk', bulkAddServicesAllTypesController);

router.get('/all', getAllServicesController);

router.get('/plan/:planType', getServicesByPlanTypeController);

router.get('/service/:serviceId', getServiceByIdController);

router.get('/category/:category', getServicesByCategoryController);

export default router;