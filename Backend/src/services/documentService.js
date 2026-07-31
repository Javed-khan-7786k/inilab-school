import Document from "../models/Document.js";
import ApiError from "../utils/ApiError.js";

class DocumentService {
  async getAll() {
    const data = await Document.find({}).sort({ createdAt: -1 }).lean();
    return data.map(item => ({ ...item, id: item._id.toString() }));
  }

  async create(data) {
    const today = new Date();
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const formattedDate = `${today.getDate()} ${months[today.getMonth()]} ${today.getFullYear()}`;

    const docData = {
      title: data.title,
      date: data.date || formattedDate,
    };

    const doc = new Document(docData);
    await doc.save();
    return doc;
  }

  async delete(id) {
    const doc = await Document.findByIdAndDelete(id);
    if (!doc) {
      throw ApiError.notFound("Document not found");
    }
    return doc;
  }
}

export default new DocumentService();
