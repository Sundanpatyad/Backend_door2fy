// src/controllers/auth.controller.ts
import STATUS_CODES from "../constants/statusCodes.js";
import { sendOTPService, verifyOTPService } from "../services/authService.js";

export const sendOTPController = async (req, res) => {
  try {
    const { phone } = req.body;
    if (!phone) {
      throw new Error("Phone number is required");
    }

    const result = await sendOTPService(phone);
    res.status(STATUS_CODES.CREATED).json({
      success: true,
      data: result,
      message: "OTP sent successfully",
    });
  } catch (error) {
    const code = error.message.includes("required")
      ? STATUS_CODES.BAD_REQUEST
      : STATUS_CODES.INTERNAL_SERVER_ERROR;
    res.status(code).json({ success: false, message: error.message });
  }
};

export const verifyOTPController = async (req, res) => {
  try {
    const { phone, otp } = req.body;
    if (!phone || !otp) {
      throw new Error("Phone and OTP are required");
    }

    const result = await verifyOTPService(phone, otp);
    res.status(STATUS_CODES.SUCCESS).json({
      success: true,
      data: result,
      message: "Phone verified successfully",
    });
  } catch (error) {
    const code = error.message.includes("Invalid") || error.message.includes("required")
      ? STATUS_CODES.BAD_REQUEST
      : STATUS_CODES.INTERNAL_SERVER_ERROR;
    res.status(code).json({ success: false, message: error.message });
  }
};
