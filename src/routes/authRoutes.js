import express from 'express';  
import { loginWithFirebase } from '../controllers/authController.js';

const router = express.Router();

router.post("/login", loginWithFirebase);

export default router;
    