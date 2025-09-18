import express from 'express';
import {
  addServiceToPlanController,
  bulkAddServicesAllTypesController,
  getAllServicesController,
  getServicesByPlanTypeController,
  getServiceByIdController,
  getServicesByCategoryController,
  createCategoryController,
  createServicePlanController,
  getAllCategoryController,
} from '../controllers/serviceController.js';
import upload from '../middleware/multer.js';

const router = express.Router();

router.post('/plan/:planType/service', addServiceToPlanController);

router.post('/bulk', bulkAddServicesAllTypesController);

router.get('/all', getAllServicesController);

router.get('/plan/:planType', getServicesByPlanTypeController);

router.get('/service/:serviceId', getServiceByIdController);

router.get('/category/:category', getServicesByCategoryController);

router.post('/category', upload.single("image"),  createCategoryController);

router.post('/createService', upload.single("image"), createServicePlanController);

router.get('/category', getAllCategoryController)



export default router;