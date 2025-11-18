import express from "express";
import adminAuth from "../middlewares/adminAuth.js";
import {
  addCourse,
  updateCourse,
  deleteCourse,
  getAllCourses,
  getCourseById,
  enrollCourse,
  getStudentCourses,
  removeEnrollment,
  getStudentsOfCourse
} from "../controllers/courseController.js";
import studentAuth from "../middlewares/studentAuth.js";

const router = express.Router();

// PUBLIC ROUTES
router.get("/", getAllCourses);
router.get("/:id", getCourseById);

router.get("/profile", studentAuth, (req, res) => {
  res.json(req.student);
});
// ADMIN ROUTES
router.post("/add", adminAuth, addCourse);
router.put("/update/:id", adminAuth, updateCourse);
router.delete("/delete/:id", adminAuth, deleteCourse);

// STUDENT ROUTES
router.post("/enroll/:id", studentAuth, enrollCourse);
router.get("/student/:id", getStudentCourses);

// ADMIN CAN UNENROLL STUDENT
router.post("/unenroll", adminAuth, removeEnrollment);


router.get("/:id/students", adminAuth, getStudentsOfCourse);

export default router;
