import Fee from "../models/Fee.js";
import Student from "../models/Student.js";
import FeeReceipt from "../models/FeeReceipt.js";
import FeeStructure from "../models/FeeStructure.js";
import SchoolSetting from "../models/SchoolSetting.js";
import ApiError from "../utils/ApiError.js";

// Default initial seeds from Excel to persist into MongoDB
const INITIAL_EXCEL_FEE_HEADS = [
  { headName: "Tution Fee", term: "Monthly", defaultAmount: 1500, isTuition: true, description: "Monthly academic tuition fee" },
  { headName: "Coveniance fee", term: "Annually", defaultAmount: 1200, isTuition: false, description: "Annual convenience and facility charges" },
  { headName: "Exam fee", term: "Halfyearly", defaultAmount: 800, isTuition: false, description: "Semester examination fee" },
  { headName: "Lab Fee", term: "Halfyearly", defaultAmount: 600, isTuition: false, description: "Science and practical lab maintenance" },
  { headName: "Bus Fee", term: "Monthly", defaultAmount: 1000, isTuition: false, description: "School transport service charges" },
  { headName: "Computer", term: "Quarterly", defaultAmount: 500, isTuition: false, description: "IT lab and digital education fee" },
  { headName: "Library", term: "Annually", defaultAmount: 400, isTuition: false, description: "Library book access and maintenance" },
  { headName: "Session Charges", term: "Annually", defaultAmount: 1500, isTuition: false, description: "New academic session charges" },
  { headName: "Admission", term: "Onetime", defaultAmount: 3000, isTuition: false, description: "One-time new admission fee" },
  { headName: "Transfer Certificate", term: "Onetime", defaultAmount: 500, isTuition: false, description: "Official transfer certificate issue fee" },
  { headName: "Stationaries", term: "Onetime", defaultAmount: 1000, isTuition: false, description: "School stationery and student diary kit" },
];

const INITIAL_EXCEL_CLASS_RATES = [
  { className: "Nursery", tuitionAmount: 1000 },
  { className: "LKG", tuitionAmount: 1100 },
  { className: "UKG", tuitionAmount: 1200 },
  { className: "One", tuitionAmount: 1500 },
  { className: "1", tuitionAmount: 1500 },
  { className: "Two", tuitionAmount: 1500 },
  { className: "2", tuitionAmount: 1500 },
  { className: "Three", tuitionAmount: 1500 },
  { className: "3", tuitionAmount: 1500 },
  { className: "Four", tuitionAmount: 1700 },
  { className: "4", tuitionAmount: 1700 },
  { className: "Five", tuitionAmount: 1700 },
  { className: "5", tuitionAmount: 1700 },
  { className: "Six", tuitionAmount: 1700 },
  { className: "6", tuitionAmount: 1700 },
  { className: "Seven", tuitionAmount: 1700 },
  { className: "7", tuitionAmount: 1700 },
  { className: "Eight", tuitionAmount: 1700 },
  { className: "8", tuitionAmount: 1700 },
  { className: "Nine", tuitionAmount: 1800 },
  { className: "9", tuitionAmount: 1800 },
  { className: "Ten", tuitionAmount: 1800 },
  { className: "10", tuitionAmount: 1800 },
  { className: "Eleven", tuitionAmount: 1800 },
  { className: "11", tuitionAmount: 1800 },
  { className: "Twelve", tuitionAmount: 1800 },
  { className: "12", tuitionAmount: 1800 },
  { className: "Graduate", tuitionAmount: 1800 },
];

const generateDefaultMonthlyDetails = (monthlyAmount = 1500) => {
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  return months.map(month => ({
    month,
    amount: monthlyAmount,
    paid: 0,
    due: monthlyAmount,
    status: "Unpaid"
  }));
};

const formatFee = (fee) => {
  if (!fee) return null;
  const obj = fee.toJSON ? fee.toJSON() : JSON.parse(JSON.stringify(fee));
  if (obj.studentId && typeof obj.studentId === "object") {
    obj.studentName = obj.studentId.name || obj.studentName || "Unknown Student";
    obj.roll = obj.studentId.roll || obj.roll || "-";
    obj.className = obj.studentId.className || obj.className || "";
    obj.sectionName = obj.studentId.sectionName || obj.sectionName || "A";
    obj.photo = obj.studentId.photo || obj.photo || "";
    obj.fatherName = obj.studentId.fatherName || "";
    obj.studentId = obj.studentId.id || (obj.studentId._id ? obj.studentId._id.toString() : String(obj.studentId));
  } else if (obj.studentId) {
    obj.studentId = obj.studentId.toString();
  }
  return obj;
};

export const feeService = {
  // Ensure FeeStructure exists in MongoDB; if not, persist the Excel structure into DB
  async initFeeStructureInDb() {
    let structure = await FeeStructure.findOne({ isActive: true });
    if (!structure) {
      structure = await FeeStructure.create({
        name: "Standard School Fee Structure",
        academicYear: "2026-2027",
        feeHeads: INITIAL_EXCEL_FEE_HEADS,
        classRates: INITIAL_EXCEL_CLASS_RATES,
        isActive: true,
      });
      console.log("Seeded FeeStructure into MongoDB from Excel successfully.");
    }
    return structure;
  },

  // Get Fee Structure directly from MongoDB
  async getFeeStructure(className) {
    const structure = await this.initFeeStructureInDb();
    let tuitionAmount = 1500;

    if (className) {
      const cleanClass = String(className).trim().toLowerCase();
      const match = structure.classRates.find(
        cr => cr.className.trim().toLowerCase() === cleanClass
      );
      if (match) {
        tuitionAmount = match.tuitionAmount;
      }
    }

    const classTuitionRatesMap = {};
    structure.classRates.forEach(cr => {
      classTuitionRatesMap[cr.className.toLowerCase()] = cr.tuitionAmount;
    });

    return {
      id: structure._id.toString(),
      name: structure.name,
      academicYear: structure.academicYear,
      feeHeads: structure.feeHeads.map(h => ({
        headName: h.headName,
        term: h.term,
        isTuition: h.isTuition,
        description: h.description,
        amount: h.isTuition ? tuitionAmount : h.defaultAmount,
      })),
      classRates: structure.classRates,
      classTuitionRates: classTuitionRatesMap,
    };
  },

  // Update Fee Structure in MongoDB
  async updateFeeStructure(data) {
    let structure = await FeeStructure.findOne({ isActive: true });
    if (!structure) {
      structure = new FeeStructure(data);
    } else {
      Object.assign(structure, data);
    }
    await structure.save();
    return structure;
  },

  // Helper to get tuition for a class from MongoDB
  async getTuitionForClass(className = "") {
    const structure = await this.initFeeStructureInDb();
    const cleanClass = String(className).trim().toLowerCase();
    const match = structure.classRates.find(
      cr => cr.className.trim().toLowerCase() === cleanClass
    );
    return match ? match.tuitionAmount : 1500;
  },

  // Search students directly in MongoDB
  async searchStudents(query) {
    if (!query || !query.trim()) {
      return [];
    }
    const cleanQ = query.trim();
    const regex = new RegExp(cleanQ, "i");

    const filter = {
      $or: [
        { name: regex },
        { roll: cleanQ },
        { email: regex },
        { fatherName: regex },
      ]
    };

    if (/^[0-9a-fA-F]{24}$/.test(cleanQ)) {
      filter.$or.push({ _id: cleanQ });
    }

    // Query students from MongoDB
    const students = await Student.find(filter)
      .select("name roll className sectionName photo fatherName fatherContact email")
      .limit(10);

    const studentIds = students.map(s => s._id);
    // Query existing fees from MongoDB
    const fees = await Fee.find({ studentId: { $in: studentIds } });
    const feeMap = new Map();
    fees.forEach(f => feeMap.set(f.studentId.toString(), f));

    // Resolve class tuition for each student from MongoDB
    const results = [];
    for (const s of students) {
      const sId = s._id.toString();
      let fee = feeMap.get(sId);
      const tuition = await this.getTuitionForClass(s.className);
      const totalAnnualFee = tuition * 12;

      results.push({
        id: sId,
        studentId: sId,
        name: s.name,
        roll: s.roll,
        className: s.className,
        sectionName: s.sectionName || "A",
        photo: s.photo,
        fatherName: s.fatherName || "",
        fatherContact: s.fatherContact || "",
        monthlyTuition: tuition,
        totalFee: fee ? fee.totalFee : totalAnnualFee,
        totalPaid: fee ? fee.totalPaid : 0,
        totalDue: fee ? fee.totalDue : totalAnnualFee,
        feeStatus: fee ? fee.status : "Unpaid",
        monthlyDetails: fee ? fee.monthlyDetails : generateDefaultMonthlyDetails(tuition),
        feeRecordId: fee ? (fee.id || fee._id.toString()) : null,
      });
    }

    return results;
  },

  // Retrieve all fees from MongoDB
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
      .populate("studentId", "name roll className sectionName photo fatherName")
      .sort({ createdAt: -1 });

    return fees.map(formatFee).filter(Boolean);
  },

  // Get fee by ID from MongoDB
  async getFeeById(id) {
    const fee = await Fee.findById(id).populate("studentId", "name roll className sectionName photo fatherName");
    if (!fee) throw new ApiError(404, "Fee record not found");
    return formatFee(fee);
  },

  // Get or initialize fee for student in MongoDB
  async getFeeByStudentId(studentId) {
    let fee = await Fee.findOne({ studentId }).populate("studentId", "name roll className sectionName photo fatherName");
    if (!fee) {
      const student = await Student.findById(studentId);
      if (!student) throw new ApiError(404, "Student not found");

      const monthlyTuition = await this.getTuitionForClass(student.className);
      const totalFee = monthlyTuition * 12;

      fee = await Fee.create({
        studentId: student._id,
        totalFee,
        totalPaid: 0,
        totalDue: totalFee,
        status: "Unpaid",
        monthlyDetails: generateDefaultMonthlyDetails(monthlyTuition),
      });
      fee = await Fee.findById(fee._id).populate("studentId", "name roll className sectionName photo fatherName");
    }
    return formatFee(fee);
  },

  async createFee(data) {
    return Fee.create(data);
  },

  async updateFee(id, data) {
    const fee = await Fee.findById(id);
    if (!fee) throw new ApiError(404, "Fee record not found");

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
    
    const updatedFee = await Fee.findById(fee._id).populate("studentId", "name roll className sectionName photo fatherName");
    return formatFee(updatedFee);
  },

  async deleteFee(id) {
    const fee = await Fee.findByIdAndDelete(id).populate("studentId", "name roll className sectionName photo fatherName");
    if (!fee) throw new ApiError(404, "Fee record not found");
    return formatFee(fee);
  },

  // Collect fee and persist FeeReceipt in MongoDB
  async collectFee(data) {
    const {
      studentId,
      academicYear = "2026-2027",
      items = [],
      subTotal,
      discount = 0,
      fine = 0,
      totalPaid,
      paymentMode = "Cash",
      transactionId = "",
      remarks = "",
      collectedBy = "Admin",
    } = data;

    if (!studentId) {
      throw new ApiError(400, "Student ID is required");
    }
    if (!items || items.length === 0) {
      throw new ApiError(400, "At least one fee item must be selected");
    }

    const student = await Student.findById(studentId);
    if (!student) {
      throw new ApiError(404, "Student not found");
    }

    // Generate unique Receipt Number: REC-YEAR-XXXXX from MongoDB count
    const yearPrefix = new Date().getFullYear();
    const count = await FeeReceipt.countDocuments();
    const receiptNo = `REC-${yearPrefix}-${String(count + 1).padStart(5, "0")}`;

    // Find or create the student's Fee record in MongoDB
    let fee = await Fee.findOne({ studentId: student._id });
    const monthlyTuition = await this.getTuitionForClass(student.className);
    if (!fee) {
      const total = monthlyTuition * 12;
      fee = await Fee.create({
        studentId: student._id,
        totalFee: total,
        totalPaid: 0,
        totalDue: total,
        status: "Unpaid",
        monthlyDetails: generateDefaultMonthlyDetails(monthlyTuition),
      });
    }

    const paidAmountNumber = Number(totalPaid) || 0;
    const monthsPaid = items
      .filter(it => (it.headName || "").toLowerCase().includes("tution") || (it.headName || "").toLowerCase().includes("tuition"))
      .map(it => it.period);

    if (monthsPaid.length > 0 && fee.monthlyDetails && fee.monthlyDetails.length > 0) {
      fee.monthlyDetails.forEach(m => {
        if (monthsPaid.includes(m.month)) {
          m.paid = m.amount;
          m.due = 0;
          m.status = "Paid";
        }
      });
    }

    // Update fee totals in MongoDB
    fee.totalPaid = (Number(fee.totalPaid) || 0) + paidAmountNumber;
    fee.totalDue = Math.max(0, (Number(fee.totalFee) || 0) - fee.totalPaid);
    fee.status = fee.totalDue === 0 ? "Paid" : fee.totalPaid > 0 ? "Partial" : "Unpaid";
    await fee.save();

    // Query School Profile from MongoDB database
    const schoolSettingDoc = await SchoolSetting.findOne();
    const schoolProf = schoolSettingDoc?.schoolProfile || {};

    // Create FeeReceipt document in MongoDB
    const calculatedSubTotal = Number(subTotal) || items.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);
    const receipt = await FeeReceipt.create({
      receiptNo,
      studentId: student._id,
      studentName: student.name,
      roll: student.roll,
      className: student.className,
      sectionName: student.sectionName || "A",
      fatherName: student.fatherName || "",
      academicYear,
      schoolName: schoolProf.name || "KanakLabs School",
      schoolAddress: schoolProf.address || "",
      schoolPhone: schoolProf.phone || "",
      affiliationBoard: schoolProf.affiliationBoard || "CBSE Board",
      registrationNo: schoolProf.registrationNo || "REG-998877-CBSE",
      paymentDate: new Date(),
      items: items.map(it => ({
        headName: it.headName,
        term: it.term || "Monthly",
        period: it.period || "",
        amount: Number(it.amount) || 0,
      })),
      subTotal: calculatedSubTotal,
      discount: Number(discount) || 0,
      fine: Number(fine) || 0,
      totalPaid: paidAmountNumber,
      balanceDue: fee.totalDue,
      paymentMode,
      transactionId: transactionId || "",
      remarks: remarks || "",
      collectedBy: collectedBy || "Admin",
    });

    return receipt;
  },

  // Query receipts directly from MongoDB
  async getReceipts(filter = {}) {
    const query = {};
    if (filter.studentId) query.studentId = filter.studentId;
    if (filter.className) query.className = filter.className;
    if (filter.paymentMode) query.paymentMode = filter.paymentMode;
    if (filter.search) {
      const q = filter.search.trim();
      query.$or = [
        { receiptNo: new RegExp(q, "i") },
        { studentName: new RegExp(q, "i") },
        { roll: q },
      ];
    }

    const receipts = await FeeReceipt.find(query)
      .sort({ createdAt: -1 })
      .limit(100);
    return receipts;
  },

  // Query single receipt from MongoDB with populated student profile
  async getReceiptById(id) {
    const receipt = await FeeReceipt.findById(id).populate(
      "studentId",
      "name roll className sectionName photo fatherName address state pinCode"
    );
    if (!receipt) throw new ApiError(404, "Receipt not found");
    return receipt;
  },

  // Sync all students in MongoDB to have accurate fee records matching class tuition
  async syncAllStudentsFees() {
    const students = await Student.find();
    let count = 0;
    for (const student of students) {
      const exists = await Fee.findOne({ studentId: student._id });
      if (!exists) {
        const monthlyTuition = await this.getTuitionForClass(student.className);
        const totalFee = monthlyTuition * 12;
        await Fee.create({
          studentId: student._id,
          totalFee,
          totalPaid: 0,
          totalDue: totalFee,
          status: "Unpaid",
          monthlyDetails: generateDefaultMonthlyDetails(monthlyTuition),
        });
        count++;
      }
    }
    return { synced: count };
  }
};
