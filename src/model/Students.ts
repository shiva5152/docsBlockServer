import mongoose, { Schema } from "mongoose";

const StudentSchema = new Schema(
  {
    serialNumber: { type: Number, default: 0 },
    studentName: { type: String, default: "shiva" },
    studentID: { type: String, default: generateRandomSixDigitNumber, unique: true },
    studentAge: { type: String, default: '' },      
    studentDOB: { type: String, default: '' },      
    studentCourse: { type: String, default: '' },   
    studentGrade: { type: String, default: '' },    
    fatherName: { type: String, default: '' },      
    uuid: { type: String, default: '' },
    transactionHash: { type: String, default: '' },

  },
);

// Function to generate a random six-digit number
function generateRandomSixDigitNumber() {
  return Math.floor(100000 + Math.random() * 900000);
}

export default mongoose.model("Student", StudentSchema);