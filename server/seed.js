import User from "./models/User.Schema.js";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();

const seedAdmin = async () => {
  try {
    // 1. Check if an admin already exists
    const adminExists = await User.findOne({
      username: process.env.ADMIN_USERNAME,
    });

    if (adminExists) {
      console.log("ℹ️  Admin account already exists.");
      return;
    }

    // 2. If not, create one
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, salt);

    const newAdmin = new User({
      username: process.env.ADMIN_USERNAME,
      password: hashedPassword,
      isAdmin: true,
    });

    await newAdmin.save();
    console.log("✅ Admin account created successfully!");
  } catch (error) {
    console.error("❌ Error seeding admin:", error);
  }
};

export default seedAdmin;
