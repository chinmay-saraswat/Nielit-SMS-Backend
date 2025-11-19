import express from "express";
import { registerStudent, loginStudent , getStudents, updateStudent , getStudentCount , getMyProfile} from "../controllers/studentController.js";
import  adminAuth  from "../middlewares/adminAuth.js";
import studentAuth from "../middlewares/studentAuth.js";
import { validate } from "../middlewares/validate.js";
import { studentRegisterSchema, studentLoginSchema } from "../zod/student.validation.js"
const router = express.Router();

router.post("/register", validate(studentRegisterSchema), registerStudent);
router.post("/login", validate(studentLoginSchema), loginStudent);

// Admin-only routes
router.get("/", adminAuth, getStudents); // Get students with filter & sort
router.put("/:id", adminAuth, updateStudent); // Update student by ID
router.get("/:id", adminAuth, getStudentById);

router.get("/count",adminAuth,getStudentCount);
router.get("/me", studentAuth, getMyProfile);
export default router;
