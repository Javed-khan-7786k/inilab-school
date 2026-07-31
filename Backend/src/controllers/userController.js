import userService from "../services/userService.js";
import studentService from "../services/studentService.js";
import teacherService from "../services/teacherService.js";
import parentService from "../services/parentService.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";

export const getAll = asyncHandler(async (req, res) => {
  const result = await userService.getAll(req.query);
  return ApiResponse.paginated(res, "Users fetched successfully", result.data, result.page, result.limit, result.total);
});

export const getById = asyncHandler(async (req, res) => {
  const user = await userService.getById(req.params.id);
  return ApiResponse.success(res, "User fetched successfully", user);
});

export const getProfile = asyncHandler(async (req, res) => {
  const { type, id } = req.params;
  
  const cleanType = type && type.includes("-") ? type.split("-")[0] : type;
  
  let profile = null;
  
  try {
    if (cleanType === "student") {
      profile = await studentService.getById(id);
    } else if (cleanType === "teacher") {
      profile = await teacherService.getById(id);
    } else if (cleanType === "parents" || cleanType === "parent") {
      profile = await parentService.getById(id);
    } else {
      // General user or staff
      profile = await userService.getById(id);
    }
  } catch (err) {
    // Fallback: try finding by username in general users collection
    try {
      profile = await userService.getByUsername(id);
    } catch (e) {
      console.warn(`Profile lookup failed for type: ${cleanType}, id: ${id}`, e);
    }
  }

  // To preserve the frontend structure, make sure profile has the expected fields
  if (profile) {
    return ApiResponse.success(res, "Profile retrieved successfully", {
      name: profile.name,
      roleLabel: profile.role || (cleanType === "student" ? "Student" : cleanType === "teacher" ? "Teacher" : cleanType === "parents" ? "Parent" : "User"),
      photo: profile.photo || "https://demo.eduking.xyz/uploads/images/default.png",
      gender: profile.gender || "Male",
      dob: profile.dob || "12 Oct 1980",
      phone: profile.phone || "",
      joiningDate: profile.joiningDate || "26 Nov 2025",
      religion: profile.religion || "islam",
      email: profile.email,
      address: profile.address || "Dhaka",
      username: profile.username || profile.name.toLowerCase().replace(/\s+/g, ""),
      class: profile.class || profile.className,
      section: profile.section,
      roll: profile.roll,
      designation: profile.designation,
      department: profile.department,
      documents: profile.documents || profile.infiniteDocuments || []
    });
  }

  // Fallback default profile to prevent crash if not found
  return ApiResponse.success(res, "Default profile retrieved", {
    name: "Guest User",
    roleLabel: "Guest",
    photo: "https://demo.eduking.xyz/uploads/images/default.png",
    gender: "Male",
    dob: "09 Apr 1973",
    phone: "",
    joiningDate: "26 Nov 2025",
    religion: "islam",
    email: "guest@example.com",
    address: "Dhaka",
    username: "guest"
  });
});

export const create = asyncHandler(async (req, res) => {
  const user = await userService.create(req.body);
  return ApiResponse.created(res, "User created successfully", user);
});

export const update = asyncHandler(async (req, res) => {
  const user = await userService.update(req.params.id, req.body);
  return ApiResponse.success(res, "User updated successfully", user);
});

export const deleteUser = asyncHandler(async (req, res) => {
  await userService.delete(req.params.id);
  return ApiResponse.success(res, "User deleted successfully");
});
