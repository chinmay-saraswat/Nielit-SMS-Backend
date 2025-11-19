import Admin from "../models/Admin.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Student from "../models/Student.js";
import Course from "../models/Course.js";


// REGISTER ADMIN
export const registerAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const exist = await Admin.findOne({ email });
    if (exist) return res.status(400).json({ message: "Admin already exists" });

    const hash = await bcrypt.hash(password, 10);

    const admin = await Admin.create({ name, email, password: hash });

    res.json({ success: true, admin });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// LOGIN ADMIN
export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(400).json({ message: "Admin not found" });

    const valid = await bcrypt.compare(password, admin.password);
    if (!valid) return res.status(400).json({ message: "Invalid password" });

    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, {
      expiresIn: "7d"
    });

    res.json({ success: true, token });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

//Admin dashboard
export const getDashboardStats = async (req, res) => {
  try {
    const totalStudents = await Student.countDocuments();
    const totalCourses = await Course.countDocuments();

    const courses = await Course.find().populate("enrolledStudents");

    const totalEnrollments = courses.reduce(
      (sum, course) => sum + course.enrolledStudents.length,
      0
    );

    let popularCourse = null;
    if (courses.length > 0) {
      popularCourse = courses.reduce((max, curr) =>
        curr.enrolledStudents.length > max.enrolledStudents.length ? curr : max
      );
    }

    res.json({
      success: true,
      totalStudents,
      totalCourses,
      totalEnrollments,
      popularCourse: popularCourse
        ? {
            name: popularCourse.courseName, // FIX HERE
            enrollCount: popularCourse.enrolledStudents.length,
          }
        : null,
    });
  } catch (err) {
    console.log(err); // add this to see actual error
    res.status(500).json({ message: "Error fetching dashboard stats" });
  }
};
