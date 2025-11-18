import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  mobile: { type: String, required: true },
  adhar: { type: String, required: true },
  caste: { type: String, enum: ["General", "SC", "ST", "OBC"], required: true },
  activeCourses: [
  {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course"
  }
]
,
enrolledCourses: [
  { type: mongoose.Schema.Types.ObjectId, ref: "Course" }
],
  gender: { type: String, enum: ["Male", "Female"], required: true }
}, { timestamps: true });

export default mongoose.model("Student", studentSchema);
