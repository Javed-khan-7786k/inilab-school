import Fee from "../models/Fee.js";
import Student from "../models/Student.js";
import ApiError from "../utils/ApiError.js";

const generateDefaultMonthlyDetails = () => {
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  return months.map(month => ({
    month,
    amount: 1000,
    paid: 0,
    due: 1000,
    status: "Unpaid"
  }));
};

const formatFee = (fee) => {
  const obj = fee.toJSON ? fee.toJSON() : fee;
  if (obj.studentId && obj.studentId.name) {
    obj.studentName = obj.studentId.name;
    obj.roll = obj.studentId.roll;
    obj.className = obj.studentId.className;
    obj.sectionName = obj.studentId.sectionName;
    obj.photo = obj.studentId.photo;
    obj.studentId = obj.studentId.id || obj.studentId._id.toString();
  }
  return obj;
};

export const feeService = {
  async getAllFees(filter = {}) {
    const studentFilter = {};
    if (filter.className) {
      studentFilter.className = filter.className;
      delete filter.className;
    }
    if (filter.sectionName) {
      studentFilter.sectionName = filter.sectionName;
      delete filter.sectionName;
    }

    if (Object.keys(studentFilter).length > 0) {
      const students = await Student.find(studentFilter).select('_id');
      filter.studentId = { $in: students.map(s => s._id) };
    }

    const fees = await Fee.find(filter)
      .populate("studentId", "name roll className sectionName photo")
      .sort({ createdAt: -1 });
    return fees.map(formatFee);
  },

  async getFeeById(id) {
    const fee = await Fee.findById(id).populate("studentId", "name roll className sectionName photo");
    if (!fee) throw new ApiError(404, "Fee record not found");
    return formatFee(fee);
  },

  async getFeeByStudentId(studentId) {
    let fee = await Fee.findOne({ studentId }).populate("studentId", "name roll className sectionName photo");
    if (!fee) {
      const student = await Student.findById(studentId);
      if (!student) throw new ApiError(404, "Student not found");

      fee = await Fee.create({
        studentId: student._id,
        totalFee: 12000,
        totalPaid: 0,
        totalDue: 12000,
        status: "Unpaid",
        monthlyDetails: generateDefaultMonthlyDetails(),
      });
      // Populate the newly created fee
      fee = await Fee.findById(fee._id).populate("studentId", "name roll className sectionName photo");
    }
    return formatFee(fee);
  },

  async createFee(data) {
    return Fee.create(data);
  },

  async updateFee(id, data) {
    const fee = await Fee.findById(id);
    if (!fee) throw new ApiError(404, "Fee record not found");

    // Recalculate totals based on monthly details if provided
    if (data.monthlyDetails) {
      let totalFee = 0;
      let totalPaid = 0;
      let totalDue = 0;
      let allPaid = true;
      let anyPaid = false;

      data.monthlyDetails.forEach(m => {
        totalFee += Number(m.amount) || 0;
        totalPaid += Number(m.paid) || 0;
        totalDue += Number(m.due) || 0;

        if (m.paid > 0) anyPaid = true;
        if (m.due > 0) allPaid = false;
      });

      data.totalFee = totalFee;
      data.totalPaid = totalPaid;
      data.totalDue = totalDue;
      
      if (allPaid) {
        data.status = "Paid";
      } else if (anyPaid) {
        data.status = "Partial";
      } else {
        data.status = "Unpaid";
      }
    }

    Object.assign(fee, data);
    await fee.save();
    
    const updatedFee = await Fee.findById(fee._id).populate("studentId", "name roll className sectionName photo");
    return formatFee(updatedFee);
  },

  async deleteFee(id) {
    const fee = await Fee.findByIdAndDelete(id).populate("studentId", "name roll className sectionName photo");
    if (!fee) throw new ApiError(404, "Fee record not found");
    return formatFee(fee);
  },

  // Helper method to sync all students to have fee records
  async syncAllStudentsFees() {
    const students = await Student.find();
    let count = 0;
    for (const student of students) {
      const exists = await Fee.findOne({ studentId: student._id });
      if (!exists) {
        await Fee.create({
          studentId: student._id,
          totalFee: 12000,
          totalPaid: 0,
          totalDue: 12000,
          status: "Unpaid",
          monthlyDetails: generateDefaultMonthlyDetails(),
        });
        count++;
      }
    }
    return { synced: count };
  }
};
