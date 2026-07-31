import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      trim: true,
      minlength: [3, "Username must be at least 3 characters"],
      index: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
    },
    role: {
      type: String,
      required: [true, "Role is required"],
      enum: {
        values: ["Admin", "Teacher", "Student", "Parent", "Accountant", "Librarian", "Receptionist", "Moderator"],
        message: "{VALUE} is not a valid role",
      },
      index: true,
    },
    name: { type: String, required: true, trim: true },
    email: { type: String, trim: true, lowercase: true },
    phone: { type: String, trim: true },
    photo: { type: String, default: "https://demo.eduking.xyz/uploads/images/default.png" },
    gender: { type: String, enum: ["Male", "Female", "Other"], default: "Male" },
    dob: { type: String },
    joiningDate: { type: String },
    religion: { type: String },
    address: { type: String },
    designation: { type: String },
    department: { type: String },
    class: { type: String },
    section: { type: String },
    roll: { type: String },
    documents: [{ name: { type: String }, file: { type: String } }],
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare entered password with hashed password
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Remove password from JSON output
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  // Convert _id to id virtual for frontend compat
  obj.id = obj._id;
  return obj;
};

const User = mongoose.model("User", userSchema);
export default User;
