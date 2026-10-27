// Demo users (Password: password)
import bcrypt from "bcryptjs";
import type { User } from "../models/types";

// Passwords: password
export const users: User[] = [
  {
    id: "user-demo-1",
    name: "Demo User",
    email: "demo@nordstay.se",
    passwordHash: bcrypt.hashSync("password", 10),
  },
  {
    id: "user-admin-1",
    name: "Admin User",
    email: "admin@nordstay.se",
    passwordHash: bcrypt.hashSync("password", 10),
  },
];