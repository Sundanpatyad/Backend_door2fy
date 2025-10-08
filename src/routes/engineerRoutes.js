import express from 'express';
import { addengineerController, getEngineersController, getAvialbleEngineersController, updateEngineerController, AssignEngineerToOrderController, unAssignEngineerFromOrderController } from '../controllers/engineerController.js';

const router = express.Router();

router.post('/addEngineer', addengineerController);
router.get('/getEngineers', getEngineersController);
router.get('/getAvialbleEngineers', getAvialbleEngineersController);
router.put('/updateEngineer/:id', updateEngineerController);
router.put('/assignEngineerToOrder/:id', AssignEngineerToOrderController);
router.put('/unAssignEngineerFromOrder/:id', unAssignEngineerFromOrderController);

export default router;