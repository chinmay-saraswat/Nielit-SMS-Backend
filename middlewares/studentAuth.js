import jwt from "jsonwebtoken";
import Student from "../models/Student.js";

const studentAuth = async (req, res, next) => {
  try {
    // Read token from request header
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find student from database
    const student = await Student.findById(decoded.id).select("-password");
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    req.student = student; // save student data in req object
    next(); // move to next middleware or controller
  } catch (error) {
    res.status(401).json({ message: "Unauthorized - Invalid Token" });
  }
};

export default studentAuth;
