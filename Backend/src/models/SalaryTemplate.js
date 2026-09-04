import mongoose from "mongoose";

const salaryTemplateSchema = new mongoose.Schema(
  {
    salaryGrade: {
      type: String,
      required: true,
      trim: true,
    },
    basicSalary: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    overtimeRate: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("SalaryTemplate", salaryTemplateSchema, "salarytemplates");
