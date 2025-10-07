import express from 'express';  
import { loginWithFirebase } from '../controllers/authController.js';
import { authenticate } from '../middleware/authMiddleWare.js';
import { updateName } from '../controllers/authController.js';
const router = express.Router();

router.post("/login", loginWithFirebase);
router.put("/updateName", authenticate,  updateName);

export default router;
    