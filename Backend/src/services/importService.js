import XLSX from "xlsx";
import AdmZip from "adm-zip";
import path from "path";
import fs from "fs";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import Student from "../models/Student.js";
import Teacher from "../models/Teacher.js";
import User from "../models/User.js";
import Enquiry from "../models/Enquiry.js";
import Holiday from "../models/Holiday.js";
import ApiError from "../utils/ApiError.js";

// ─── Entity Configurations ────────────────────────────────────────
const entityConfigs = {
  students: {
    model: Student,
    requiredColumns: ["name", "roll"],
    allColumns: ["name", "roll", "className", "email", "photo"],
  },
  teachers: {
    model: Teacher,
    requiredColumns: ["name", "designation"],
    allColumns: ["name", "designation", "email", "photo"],
  },
  users: {
    model: User,
    requiredColumns: ["username", "password", "role", "name"],
    allColumns: [
      "username", "password", "role", "name", "email", "phone", "photo",
      "gender", "dob", "joiningDate", "religion", "address",
      "designation", "department", "class", "section", "roll",
    ],
  },
  enquiries: {
    model: Enquiry,
    requiredColumns: ["studentName", "applyingClass", "fatherName", "fatherContact"],
    allColumns: [
      "studentName", "applyingClass", "dob", "gender",
      "fatherName", "fatherOccupation", "fatherContact", "fatherEmail", "fatherAadhaar",
      "motherName", "motherOccupation", "motherContact", "motherEmail", "motherAadhaar",
      "address", "state", "district", "pinCode",
      "childAadhaar", "aparId", "penNumber",
      "previousSchool", "previousSchoolAddress", "previousSchoolId", "lastClassAttended",
      "photo", "status",
    ],
  },
  holidays: {
    model: Holiday,
    requiredColumns: ["title", "date"],
    allColumns: ["title", "date", "details"],
  },
};

// ─── Column Aliases & Normalization ─────────────────────────────────
const COLUMN_ALIASES = {
  name: ["name", "full name", "student name", "teacher name", "user name"],
  roll: ["roll", "roll no", "roll number", "rollno"],
  className: ["class", "classname", "class name"],
  email: ["email", "email address", "email id"],
  photo: ["photo", "image", "avatar", "student image", "teacher image", "profile image"],
  designation: ["designation", "designation name"],
  username: ["username", "user name", "user", "login", "user id", "userid", "account"],
  password: ["password", "pass", "pwd", "user password", "passcode"],
  role: ["role", "user role", "account type", "type", "user type"],
  phone: ["phone", "phone number", "mobile", "contact", "contact number"],
  gender: ["gender"],
  dob: ["dob", "date of birth", "birth date"],
  joiningDate: ["joiningdate", "joining date", "date of joining"],
  religion: ["religion"],
  address: ["address"],
  department: ["department"],
  class: ["class", "classname", "class name"],
  section: ["section"],
  details: ["details", "description", "info", "holiday details"],
  title: ["title", "holiday title", "heading", "name"],
  date: ["date", "holiday date", "start date", "when"],

  // Enquiry Specific Column Aliases matching Form Labels
  studentName: ["studentname", "student name", "student_name", "child name"],
  applyingClass: ["applyingclass", "applying class", "applying_class"],
  fatherName: ["fathername", "father name", "father_name", "father"],
  fatherOccupation: ["fatheroccupation", "father occupation", "father_occupation"],
  fatherContact: ["fathercontact", "father contact", "father contact number", "father phone", "father_contact"],
  fatherEmail: ["fatheremail", "father email", "father email id", "father_email"],
  fatherAadhaar: ["fatheraadhaar", "father aadhaar", "father aadhaar number", "father adhar"],
  motherName: ["mothername", "mother name", "mother_name", "mother"],
  motherOccupation: ["motheroccupation", "mother occupation", "mother_occupation"],
  motherContact: ["mothercontact", "mother contact", "mother contact number", "mother phone", "mother_contact"],
  motherEmail: ["motheremail", "mother email", "mother email id", "mother_email"],
  motherAadhaar: ["motheraadhaar", "mother aadhaar", "mother aadhaar number", "mother adhar"],
  state: ["state"],
  district: ["district"],
  pinCode: ["pincode", "pin code", "zip", "zip code"],
  childAadhaar: ["childaadhaar", "child aadhaar", "child aadhaar number", "child adhar"],
  aparId: ["aparid", "apar id", "apar_id"],
  penNumber: ["pennumber", "pen number", "pen_number"],
  previousSchool: ["previousschool", "previous school", "previous school name"],
  previousSchoolAddress: ["previousschooladdress", "previous school address"],
  previousSchoolId: ["previousschoolid", "previous school id", "previous school id / udise code", "udise code"],
  lastClassAttended: ["lastclassattended", "last class attended"],
  status: ["status"],
};

function normalizeRows(rows, allColumns) {
  if (rows.length === 0) return [];
  const headerMap = new Map();

  const getMappedKey = (header) => {
    if (headerMap.has(header)) return headerMap.get(header);

    const cleanHeader = String(header).trim().toLowerCase();
    let mappedColumn = null;

    for (const col of allColumns) {
      const aliases = COLUMN_ALIASES[col] || [col.toLowerCase()];
      if (aliases.includes(cleanHeader)) {
        mappedColumn = col;
        break;
      }
    }

    if (!mappedColumn) {
      for (const [col, aliases] of Object.entries(COLUMN_ALIASES)) {
        if (aliases.includes(cleanHeader)) {
          mappedColumn = col;
          break;
        }
      }
    }

    const finalKey = mappedColumn || header;
    headerMap.set(header, finalKey);
    return finalKey;
  };

  return rows.map((row) => {
    const newRow = {};
    for (const [key, val] of Object.entries(row)) {
      newRow[getMappedKey(key)] = val;
    }
    return newRow;
  });
}

// ─── Extract embedded images from the xlsx ZIP ────────────────────
function extractImagesFromXlsx(buffer) {
  const imageUploadDir = path.join(process.cwd(), "uploads", "images");
  if (!fs.existsSync(imageUploadDir)) {
    fs.mkdirSync(imageUploadDir, { recursive: true });
  }

  const imageMap = {}; // dataRowIndex → image URL

  try {
    const zip = new AdmZip(buffer);
    const entries = zip.getEntries();

    // 1. Collect media files (xl/media/image1.png, …)
    const mediaFiles = {};
    for (const entry of entries) {
      if (entry.entryName.startsWith("xl/media/")) {
        mediaFiles[entry.entryName] = entry;
      }
    }
    if (Object.keys(mediaFiles).length === 0) return imageMap;

    // 2. Parse drawing relationship file → rId ↔ media path
    const rIdToMedia = {};
    const relsEntry = entries.find((e) =>
      /xl\/drawings\/_rels\/drawing\d+\.xml\.rels/.test(e.entryName)
    );
    if (relsEntry) {
      const relsXml = relsEntry.getData().toString("utf8");
      const relRegex = /Id="(rId\d+)"[^>]*Target="([^"]+)"/g;
      let m;
      while ((m = relRegex.exec(relsXml)) !== null) {
        // Target is relative, e.g. "../media/image1.png"
        rIdToMedia[m[1]] = "xl/" + m[2].replace("../", "");
      }
    }

    // 3. Parse drawing XML → map (row, rId)
    const drawingEntry = entries.find((e) =>
      /xl\/drawings\/drawing\d+\.xml$/.test(e.entryName)
    );
    if (!drawingEntry) return imageMap;

    const drawingXml = drawingEntry.getData().toString("utf8");

    // Match both <xdr:twoCellAnchor> and <xdr:oneCellAnchor> blocks
    const anchorRegex =
      /<(?:xdr:)?(?:twoCellAnchor|oneCellAnchor)[^>]*>([\s\S]*?)<\/(?:xdr:)?(?:twoCellAnchor|oneCellAnchor)>/g;

    let anchor;
    while ((anchor = anchorRegex.exec(drawingXml)) !== null) {
      const content = anchor[1];

      // Row from <xdr:from> block
      const rowMatch = content.match(
        /<(?:xdr:)?from>[\s\S]*?<(?:xdr:)?row>(\d+)<\/(?:xdr:)?row>/
      );
      // Relationship id from <a:blip r:embed="rId…">
      const rIdMatch = content.match(/r:embed="(rId\d+)"/);

      if (rowMatch && rIdMatch) {
        const drawingRow = parseInt(rowMatch[1], 10); // 0-based (row 0 = Excel header)
        const rId = rIdMatch[1];
        const mediaPath = rIdToMedia[rId];

        if (mediaPath && mediaFiles[mediaPath]) {
          const imgBuffer = mediaFiles[mediaPath].getData();
          const ext = path.extname(mediaPath) || ".png";
          const filename = crypto.randomUUID() + ext;
          const filepath = path.join(imageUploadDir, filename);
          fs.writeFileSync(filepath, imgBuffer);

          // Data-row index = drawing row − 1 (header occupies row 0)
          const dataRowIndex = drawingRow - 1;
          if (dataRowIndex >= 0) {
            const baseUrl = process.env.BACKEND_URL || "http://localhost:5000";
            imageMap[dataRowIndex] = `${baseUrl}/uploads/images/${filename}`;
          }
        }
      }
    }
  } catch (err) {
    // Non-fatal – continue without images
    console.warn("Warning: could not extract embedded images:", err.message);
  }

  return imageMap;
}

// ─── Main import function ─────────────────────────────────────────
async function importFromExcel(buffer, entity, reqUser = null) {
  const config = entityConfigs[entity];
  if (!config) {
    throw ApiError.badRequest(
      `Invalid entity: "${entity}". Supported: ${Object.keys(entityConfigs).join(", ")}`
    );
  }

  // Find fallback admin user if needed for enquiries
  let adminUserId = reqUser?._id || reqUser?.id;
  if (entity === "enquiries" && !adminUserId) {
    const adminUser = await User.findOne({ role: "Admin" }).lean();
    if (adminUser) adminUserId = adminUser._id;
  }

  // ── Parse workbook ───────────────────────────────────────────────
  const workbook = XLSX.read(buffer, { type: "buffer" });
  const sheetName = workbook.SheetNames[0];
  if (!sheetName) {
    throw ApiError.badRequest("Excel file contains no sheets");
  }

  const sheet = workbook.Sheets[sheetName];
  const rawRows = XLSX.utils.sheet_to_json(sheet, { defval: "" });

  if (rawRows.length === 0) {
    throw ApiError.badRequest("Excel file contains no data rows");
  }

  // Normalize headers (case-insensitive, trimmed, alias mapping)
  const rows = normalizeRows(rawRows, config.allColumns);

  // ── Validate required columns ────────────────────────────────────
  const headers = Object.keys(rows[0]);
  const missingCols = config.requiredColumns.filter((c) => !headers.includes(c));
  if (missingCols.length > 0) {
    throw ApiError.badRequest(`Missing required columns: ${missingCols.join(", ")}`);
  }

  // ── Extract embedded images (if any) ─────────────────────────────
  const imageMap = extractImagesFromXlsx(buffer);

  // ── Validate rows & build documents ──────────────────────────────
  const validRows = [];
  const skippedRows = [];

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const excelRow = i + 2; // 1-based + 1 for header

    // Check required fields are non-empty
    const missing = config.requiredColumns.filter(
      (c) => row[c] === undefined || String(row[c]).trim() === ""
    );
    if (missing.length > 0) {
      skippedRows.push({ row: excelRow, reason: `Missing required fields: ${missing.join(", ")}` });
      continue;
    }

    // Build document with only allowed columns
    const doc = {};
    for (const col of config.allColumns) {
      if (row[col] !== undefined && String(row[col]).trim() !== "") {
        doc[col] = String(row[col]).trim();
      }
    }

    // Default className fallback for student entity if empty or missing
    if (entity === "students" && (!doc.className || doc.className.trim() === "")) {
      doc.className = "Class 1";
    }

    // Role normalization for user entity
    if (entity === "users" && doc.role) {
      const validRoles = ["Admin", "Teacher", "Student", "Parent", "Accountant", "Librarian", "Receptionist", "Moderator"];
      const matchedRole = validRoles.find((r) => r.toLowerCase() === String(doc.role).trim().toLowerCase());
      if (matchedRole) {
        doc.role = matchedRole;
      }
    }

    // Default fallback values for enquiry entity
    if (entity === "enquiries") {
      doc.dob = doc.dob || "2010-01-01";
      doc.gender = doc.gender || "Male";
      doc.fatherOccupation = doc.fatherOccupation || "Business";
      doc.fatherEmail = doc.fatherEmail || "father@example.com";
      doc.motherName = doc.motherName || "N/A";
      doc.motherOccupation = doc.motherOccupation || "Homemaker";
      doc.motherContact = doc.motherContact || doc.fatherContact || "0000000000";
      doc.motherEmail = doc.motherEmail || "mother@example.com";
      doc.address = doc.address || "Main Street";
      doc.state = doc.state || "State";
      doc.district = doc.district || "District";
      doc.pinCode = doc.pinCode || "110001";
      doc.status = doc.status || "New";
      if (adminUserId) {
        doc.createdBy = adminUserId;
      }
    }

    // Image handling:
    // 1. Prefer embedded image from Excel sheet if available
    // 2. Otherwise if cell value is a valid URL or path (http, https, /uploads, data:image), keep it
    // 3. Fall back to default avatar
    const DEFAULT_AVATAR = "https://demo.eduking.xyz/uploads/images/default.png";
    const imageField = config.allColumns.includes("photo") ? "photo" : "image";
    const cellVal = doc[imageField] ? String(doc[imageField]).trim() : "";

    if (imageMap[i]) {
      doc[imageField] = imageMap[i];
    } else if (
      cellVal.startsWith("http://") ||
      cellVal.startsWith("https://") ||
      cellVal.startsWith("data:image/")
    ) {
      doc[imageField] = cellVal;
    } else if (cellVal.startsWith("/uploads/") || cellVal.startsWith("uploads/")) {
      const rel = cellVal.startsWith("/") ? cellVal : `/${cellVal}`;
      const baseUrl = process.env.BACKEND_URL || "http://localhost:5000";
      doc[imageField] = `${baseUrl}${rel}`;
    } else {
      doc[imageField] = DEFAULT_AVATAR;
    }

    validRows.push(doc);
  }

  if (validRows.length === 0) {
    throw ApiError.badRequest("No valid rows found in the Excel file");
  }

  // ── Hash passwords for User imports ──────────────────────────────
  if (entity === "users") {
    for (const doc of validRows) {
      if (doc.password) {
        doc.password = await bcrypt.hash(doc.password, 12);
      }
    }
  }

  // ── Bulk insert (ordered: false → partial success) ───────────────
  try {
    const result = await config.model.insertMany(validRows, { ordered: false });
    return {
      insertedCount: result.length,
      imported: result.length,
      failed: skippedRows.length,
      skippedRows,
      errors: skippedRows,
    };
  } catch (err) {
    // BulkWriteError — some docs inserted, some duplicated
    if (err.insertedDocs) {
      const insertedCount = err.insertedDocs.length;
      if (err.writeErrors) {
        for (const we of err.writeErrors) {
          skippedRows.push({
            row: (we.index || 0) + 2,
            reason: we.errmsg || "Duplicate or write error",
          });
        }
      }
      return {
        insertedCount,
        imported: insertedCount,
        failed: skippedRows.length,
        skippedRows,
        errors: skippedRows,
      };
    }
    throw err;
  }
}

export default { importFromExcel };
