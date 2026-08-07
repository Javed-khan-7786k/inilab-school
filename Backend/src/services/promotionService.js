import PromotionSettingModel from "../models/PromotionSettingModel.js";

class PromotionService {
  async getSetting(query = {}) {
    const { academicYear, className } = query;
    const filter = {};
    if (academicYear) filter.academicYear = academicYear;
    if (className) filter.className = className;

    const item = await PromotionSettingModel.findOne(filter).sort({ createdAt: -1 }).lean();
    if (!item) {
      return {
        academicYear: academicYear || "2025-2026",
        className: className || "One",
        promotionAcademicYear: "2026-2027",
        promotionClassName: "Two",
        promotionType: "Normal",
        selectedExams: ["First Semester", "Second Semester", "Third Semester"],
        subjectPassMarks: {
          English: 33,
          Bangla: 33,
          Drawing: 33,
          "Math Matrix": 33,
          Science: 25,
          Math: 33,
          ICT: 33,
        },
      };
    }
    return { ...item, id: item._id.toString() };
  }

  async saveSetting(data) {
    const { academicYear, className } = data;
    const item = await PromotionSettingModel.findOneAndUpdate(
      { academicYear, className },
      data,
      { upsert: true, new: true, runValidators: true }
    );
    return { ...item.toObject(), id: item._id.toString() };
  }
}

export default new PromotionService();
