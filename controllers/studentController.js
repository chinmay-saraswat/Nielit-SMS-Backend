import Student from "../models/Student.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// REGISTER STUDENT
export const registerStudent = async (req, res) => {
  try {
    const { name, email, password, mobile, adhar, caste, gender } = req.body;

    // Already exists?
    const exist = await Student.findOne({ email });
    if (exist) return res.status(400).json({ message: "Student already exists" });

    // Aadhar validation
    if (adhar.length !== 12 || !/^\d+$/.test(adhar)) {
      return res.status(400).json({ message: "Aadhar must be 12 digits" });
    }

    // Mobile validation
    if (mobile.length !== 10 || !/^\d+$/.test(mobile)) {
      return res.status(400).json({ message: "Mobile number must be 10 digits" });
    }

    const hash = await bcrypt.hash(password, 10);

    const student = await Student.create({
      name,
      email,
      password: hash,
      mobile,
      adhar,
      caste,
      gender,
      activeCourses: [],    // empty by default
      enrolledCourses: []   // empty by default
    });

    res.json({ success: true, student });

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// LOGIN STUDENT
export const loginStudent = async (req, res) => {
  try {
    const { email, password } = req.body;

    const student = await Student.findOne({ email });
    if (!student) return res.status(400).json({ message: "Student not found" });

    const valid = await bcrypt.compare(password, student.password);
    if (!valid) return res.status(400).json({ message: "Invalid password" });

    const token = jwt.sign({ id: student._id }, process.env.JWT_SECRET, {
      expiresIn: "7d"
    });

    res.json({ success: true, token });
  }
  catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// ADMIN: GET STUDENTS with filter & sort
export const getStudents = async (req, res) => {
  try {
    // Query params
    const { caste, gender, sortBy, order, page = 1, limit = 10 } = req.query;

    // ---- FILTER ----
    const filter = {};
    if (caste) filter.caste = caste;
    if (gender) filter.gender = gender;

    // ---- SORTING ----
    const sort = {};
    if (sortBy) sort[sortBy] = order === "desc" ? -1 : 1;

    // ---- PAGINATION ----
    const skip = (Number(page) - 1) * Number(limit);

    const students = await Student.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(Number(limit));

    const total = await Student.countDocuments(filter);

    // ---- RESPONSE ----
    res.json({
      success: true,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / limit),
      totalStudents: total,
      students,
    });
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};


// ADMIN: UPDATE STUDENT DETAILS
export const updateStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, mobile, adhar, caste, activeCourses, gender, password } = req.body;

    const student = await Student.findById(id);
    if (!student) return res.status(404).json({ message: "Student not found" });

    if (name) student.name = name;
    if (email) student.email = email;
    if (mobile) student.mobile = mobile;
    if (adhar) student.adhar = adhar;
    if (caste) student.caste = caste;
    if (activeCourses) student.activeCourses = activeCourses;
    if (gender) student.gender = gender;
    if (password) student.password = await bcrypt.hash(password, 10);

    await student.save();
    res.json({ success: true, student });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// ADMIN: Get total number of students
export const getStudentCount = async (req, res) => {
  try {
    const count = await Student.countDocuments(); // counts all students
    res.json({ success: true, totalStudents: count });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

//profile of student
export const getMyProfile = async (req, res) => {
  try {
    // req.student is added by studentAuth middleware
    const student = req.student;

    res.json({
      success: true,
      profile: student
    });
  } catch (err) {
    res.status(500).json({ message: "Error fetching student profile" });
  }
};

// GET SINGLE STUDENT BY ID
export const getStudentById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({ success: false, message: "Student not found" });
    }

    res.json({ success: true, student });
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};
