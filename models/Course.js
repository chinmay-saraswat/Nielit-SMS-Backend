import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({
  courseName: { type: String, required: true },
  techField: { type: String, required: true },

  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },

  duration: { type: String }, // we will auto-calc

  teacher: { type: String, required: true },
  price: { type: Number, required: true },

  description: { type: String },

  enrolledStudents: [
  { type: mongoose.Schema.Types.ObjectId, ref: "Student" }
],


  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admin",
  }
}, { timestamps: true });

// AUTO CALCULATE DURATION
courseSchema.pre("save", function (next) {
  if (this.startDate && this.endDate) {
    const diff = this.endDate - this.startDate;
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));

    this.duration = days + " Days";
  }
  next();
});

export default mongoose.model("Course", courseSchema);
