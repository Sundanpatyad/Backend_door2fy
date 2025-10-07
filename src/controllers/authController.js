// src/controllers/auth.controller.ts
import { admin } from "../config/firebase.js";
import User from "../models/user.js";
import jwt from "jsonwebtoken";

export const loginWithFirebase = async (req, res) => {
  try {
    const { firebaseToken } = req.body;
    if (!firebaseToken) {
      return res.status(400).json({ error: "Firebase token is required" });
    }

    // Verify Firebase token
    const decoded = await admin.auth().verifyIdToken(firebaseToken);
    const userRecord = await admin.auth().getUser(decoded.uid);

    const uid = decoded.uid;
    const phoneNumber = userRecord.phoneNumber || decoded.phone_number;
    const email = userRecord.email || decoded.email || `${uid}@autogen.com`;
    const displayName = userRecord.displayName || "John Doe";

    // Split displayName
    const [firstName, ...lastNameParts] = displayName.split(" ");
    const lastName = lastNameParts.join(" ") || "User";

    // Find or create user in MongoDB
    let user = await User.findOne({ $or: [{ mobile: phoneNumber }, { uid }] });

    if (!user) {
      user = new User({
        uid,
        firstName,
        lastName,
        mobile: phoneNumber,
        email,
        password: uid, // dummy password for OTP login
        userType: "b2c",
        role: "customer",
        status: "active",
      });
      await user.save();
    } else {
      // Update user info if changed
      user.firstName = firstName || user.firstName;
      user.lastName = lastName || user.lastName;
      user.mobile = phoneNumber || user.mobile;
      user.email = email || user.email;
      if (user.status === "pending_verification") user.status = "active";
      await user.save();
    }

    // Issue backend JWT
    const backendToken = jwt.sign(
      { userId: user._id, role: user.role, userType: user.userType },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.json({ message: "Login successful", user, token: backendToken });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(401).json({ error: "Invalid Firebase token" });
  }
};

