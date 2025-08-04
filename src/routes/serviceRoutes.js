import express from 'express';
import { getAllServicesController, getServicePlansByTypeController, getServiceByNameController, addServiceToPlanController, bulkAddServicesAllTypesController, bulkUpdateServicesController } from '../controllers/serviceController.js';
const router = express.Router();

router.get('/services', getAllServicesController);
router.get('/:planType', getServicePlansByTypeController);
router.get('/:planType/:serviceName', getServiceByNameController);
router.post('/:planType/services', addServiceToPlanController);
router.post('/services/bulk', bulkAddServicesAllTypesController);
router.put('/:planType/services', bulkUpdateServicesController);

export default router;