import express from "express";
import { registerAdmin, loginAdmin , getDashboardStats } from "../controllers/adminController.js";
import { validate } from "../middlewares/validate.js";
import { adminRegisterSchema, adminLoginSchema } from "../zod/admin.validation.js";
import adminAuth from "../middlewares/adminAuth.js";
const router = express.Router();

router.post("/register", validate(adminRegisterSchema), registerAdmin);
router.post("/login", validate(adminLoginSchema), loginAdmin);

// testing admin token
router.get("/check", adminAuth, (req, res) => {
  res.json({ message: "Admin Verified!" });
});


//Dashboard stats
router.get("/dashboard", adminAuth, getDashboardStats);


export default router;
