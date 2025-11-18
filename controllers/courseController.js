import Course from "../models/Course.js";
import Student from "../models/Student.js";

// ADD COURSE (ADMIN)
export const addCourse = async (req, res) => {
  try {
    const course = await Course.create({ ...req.body, createdBy: req.admin.id });
    res.json({ success: true, course });
  } catch (err) {
    res.status(500).json({ message: "Error adding course" });
  }
};

// UPDATE COURSE (ADMIN)
export const updateCourse = async (req, res) => {
  try {
    const updatedCourse = await Course.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updatedCourse) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.json({ success: true, course: updatedCourse });

  } catch (err) {
    res.status(500).json({ message: "Error updating course" });
  }
};


// DELETE COURSE (ADMIN)
export const deleteCourse = async (req, res) => {
  try {
    await Course.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Course deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting course" });
  }
};

// GET ALL COURSES (PUBLIC)
export const getAllCourses = async (req, res) => {
  const courses = await Course.find();
  res.json(courses);
};

// GET SINGLE COURSE (PUBLIC)
export const getCourseById = async (req, res) => {
  const course = await Course.findById(req.params.id);
  if (!course) return res.status(404).json({ message: "Course not found" });
  res.json(course);
};

// ENROLL STUDENT IN COURSE
export const enrollCourse = async (req, res) => {
  try {
    const { studentId, courseId } = req.body;

    const student = await Student.findById(studentId);
    const course = await Course.findById(courseId);

    if (!student || !course) {
      return res.status(404).json({ message: "Student or Course not found" });
    }

    // Avoid duplicate enrollment
    if (student.activeCourses.includes(courseId)) {
      return res.status(400).json({ message: "Student already enrolled in this course" });
    }

    // Add course to student's list
    student.activeCourses.push(courseId);
    student.enrolledCourses.push(courseId);

    // Add student to course's enrolledStudents list
    course.enrolledStudents.push(studentId);

    await student.save();
    await course.save();

    res.json({
      success: true,
      message: "Student enrolled successfully",
      student
    });

  } catch (err) {
    console.error("Enroll error:", err);
    res.status(500).json({ message: "Error enrolling student" });
  }
};


export const getStudentCourses = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id)
      .populate("activeCourses").populate("enrolledCourses");  // Correct field
    

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.json({
      success: true,
      activeCourses: student.activeCourses,
      enrolledCourses:student.enrolledCourses
    });

  } catch (err) {
    res.status(500).json({ message: "Error fetching student courses" });
  }
};

// REMOVE STUDENT FROM A COURSE
export const removeEnrollment = async (req, res) => {
  try {
    const { studentId, courseId } = req.body;

    const student = await Student.findById(studentId);
    const course = await Course.findById(courseId);

    if (!student || !course) {
      return res.status(404).json({ message: "Student or Course not found" });
    }

    // Check if student is actually enrolled
    if (!student.activeCourses.includes(courseId)) {
      return res.status(400).json({ message: "Student is not enrolled in this course" });
    }

    // Remove course from student
    student.activeCourses = student.activeCourses.filter(id => id.toString() !== courseId);

    // Remove student from course
    course.enrolledStudents = course.enrolledStudents.filter(
      id => id.toString() !== studentId
    );

    await student.save();
    await course.save();

    res.json({
      success: true,
      message: "Student removed from course successfully",
    });

  } catch (err) {
    console.error("Remove Enrollment Error:", err);
    res.status(500).json({ message: "Error removing student from course" });
  }
};

//List All Students of a Specific Course (GET /api/courses/:id/students)
export const getStudentsOfCourse = async (req, res) => {
  try {
    const { id } = req.params;
    let { page = 1, limit = 10 } = req.query;

    page = Number(page);
    limit = Number(limit);
    const skip = (page - 1) * limit;

    const course = await Course.findById(id)
      .populate({
        path: "enrolledStudents",
        options: { skip, limit }
      });

    if (!course) return res.status(404).json({ message: "Course not found" });

    res.json({
      success: true,
      students: course.enrolledStudents,
      page,
      limit
    });
  } catch (err) {
    res.status(500).json({ message: "Error fetching students of course" });
  }
};


