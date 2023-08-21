import mongoose, { Schema } from "mongoose";

const StudentSchema = new Schema(
  {
        serialNumber: {type:Number,default:0},
      studentName: {type:String,default :"shiva"},
      studentID:{type:String, default: generateRandomSixDigitNumber, unique: true },
      studentAge: { type: String, default: '' },      // Set default value to an empty string
        studentDOB: { type: String, default: '' },      // Set default value to an empty string
        studentCourse: { type: String, default: '' },   // Set default value to an empty string
        studentGrade: { type: String, default: '' },    // Set default value to an empty string
        fatherName: { type: String, default: '' },      // Set default value to an empty string
        uuid: { type: String, default: '' }, 
 
  },
);

// Function to generate a random six-digit number
function generateRandomSixDigitNumber() {
    return Math.floor(100000 + Math.random() * 900000);
  }
  
export default mongoose.model("Student", StudentSchema);