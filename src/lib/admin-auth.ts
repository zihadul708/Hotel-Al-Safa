import fs from "fs";
import path from "path";
import crypto from "crypto";
import { isSupabaseConfigured, supabaseAdmin } from "./supabase";

export interface AdminUser {
  id: string;
  username: string;
  passwordHash: string;
  salt: string;
  name: string;
  role: "SUPER_ADMIN" | "ADMIN" | "STAFF";
  createdAt: string;
  updatedAt: string;
}

export type SafeAdminUser = Omit<AdminUser, "passwordHash" | "salt">;

const DATA_FILE = path.join(process.cwd(), "data", "admin-users.json");

/**
 * Hash password securely with PBKDF2 using SHA-512
 */
export function hashPassword(password: string, salt?: string): { hash: string; salt: string } {
  const userSalt = salt || crypto.randomBytes(16).toString("hex");
  const hash = crypto
    .pbkdf2Sync(password, userSalt, 10000, 64, "sha512")
    .toString("hex");
  return { hash, salt: userSalt };
}

/**
 * Verify password against stored hash & salt
 */
export function verifyPassword(password: string, storedHash: string, salt: string): boolean {
  const { hash } = hashPassword(password, salt);
  return crypto.timingSafeEqual(Buffer.from(hash, "hex"), Buffer.from(storedHash, "hex"));
}

// Default initial admin credentials
const defaultAdmin = hashPassword("admin123");
const INITIAL_ADMIN_USERS: AdminUser[] = [
  {
    id: "admin-root-1",
    username: "admin",
    passwordHash: defaultAdmin.hash,
    salt: defaultAdmin.salt,
    name: "Front Desk Administrator",
    role: "SUPER_ADMIN",
    createdAt: "2026-11-20T00:00:00.000Z",
    updatedAt: "2026-11-20T00:00:00.000Z",
  },
];

let inMemoryUsers: AdminUser[] = [...INITIAL_ADMIN_USERS];

function ensureDataDirectory() {
  const dir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function loadUsersFromFile(): AdminUser[] | null {
  try {
    ensureDataDirectory();
    if (fs.existsSync(DATA_FILE)) {
      const content = fs.readFileSync(DATA_FILE, "utf-8");
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn("Failed to read admin users from file:", err);
  }
  return null;
}

function saveUsersToFile(users: AdminUser[]) {
  try {
    ensureDataDirectory();
    fs.writeFileSync(DATA_FILE, JSON.stringify(users, null, 2), "utf-8");
  } catch (err) {
    console.error("Failed to persist admin users to file:", err);
  }
}

function sanitizeUser(user: AdminUser): SafeAdminUser {
  const { passwordHash, salt, ...safe } = user;
  return safe;
}

export async function getRawAdminUsers(): Promise<AdminUser[]> {
  // 1. Try Supabase if configured
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabaseAdmin.from("admin_users").select("*");
      if (!error && data && data.length > 0) {
        return data.map((d) => ({
          id: d.id,
          username: d.username.toLowerCase(),
          passwordHash: d.password_hash,
          salt: d.salt,
          name: d.name,
          role: d.role as "SUPER_ADMIN" | "ADMIN" | "STAFF",
          createdAt: d.created_at,
          updatedAt: d.updated_at,
        }));
      }
    } catch {
      // Ignored
    }
  }

  // 2. Try file
  const fileUsers = loadUsersFromFile();
  if (fileUsers) {
    inMemoryUsers = fileUsers;
    return inMemoryUsers;
  }

  // Initialize file with default
  saveUsersToFile(inMemoryUsers);
  return inMemoryUsers;
}

export async function getAllSafeAdminUsers(): Promise<SafeAdminUser[]> {
  const users = await getRawAdminUsers();
  return users.map(sanitizeUser);
}

export async function authenticateAdmin(
  usernameInput: string,
  passwordInput: string
): Promise<{ user: SafeAdminUser; token: string } | null> {
  const cleanUsername = usernameInput.trim().toLowerCase();
  const users = await getRawAdminUsers();

  const user = users.find((u) => u.username.toLowerCase() === cleanUsername);
  if (!user) return null;

  const isValid = verifyPassword(passwordInput, user.passwordHash, user.salt);
  if (!isValid) return null;

  // Simple session token with timestamp and user ID
  const token = Buffer.from(
    JSON.stringify({
      userId: user.id,
      username: user.username,
      role: user.role,
      issuedAt: Date.now(),
    })
  ).toString("base64");

  return {
    user: sanitizeUser(user),
    token,
  };
}

export async function createAdminUser(data: {
  username: string;
  password: string;
  name: string;
  role?: "SUPER_ADMIN" | "ADMIN" | "STAFF";
}): Promise<{ success: boolean; user?: SafeAdminUser; error?: string }> {
  const cleanUsername = data.username.trim().toLowerCase();

  if (!cleanUsername || cleanUsername.length < 3) {
    return { success: false, error: "Username must be at least 3 characters long." };
  }

  if (!/^[a-z0-9_.-]+$/.test(cleanUsername)) {
    return {
      success: false,
      error: "Username can only contain letters, numbers, underscores, and dashes.",
    };
  }

  if (!data.password || data.password.length < 6) {
    return { success: false, error: "Password must be at least 6 characters long." };
  }

  const users = await getRawAdminUsers();
  if (users.some((u) => u.username.toLowerCase() === cleanUsername)) {
    return { success: false, error: `Username "${cleanUsername}" is already taken.` };
  }

  const { hash, salt } = hashPassword(data.password);
  const now = new Date().toISOString();

  const newUser: AdminUser = {
    id: `admin-${Date.now()}`,
    username: cleanUsername,
    passwordHash: hash,
    salt,
    name: data.name?.trim() || cleanUsername,
    role: data.role || "ADMIN",
    createdAt: now,
    updatedAt: now,
  };

  const updatedUsers = [...users, newUser];
  inMemoryUsers = updatedUsers;
  saveUsersToFile(updatedUsers);

  if (isSupabaseConfigured()) {
    try {
      await supabaseAdmin.from("admin_users").insert({
        id: newUser.id,
        username: newUser.username,
        password_hash: newUser.passwordHash,
        salt: newUser.salt,
        name: newUser.name,
        role: newUser.role,
        created_at: newUser.createdAt,
        updated_at: newUser.updatedAt,
      });
    } catch (err) {
      console.warn("Supabase admin_users insert notice:", err);
    }
  }

  return { success: true, user: sanitizeUser(newUser) };
}

export async function changeAdminPassword(
  userId: string,
  newPassword: string
): Promise<{ success: boolean; error?: string }> {
  if (!newPassword || newPassword.length < 6) {
    return { success: false, error: "New password must be at least 6 characters long." };
  }

  const users = await getRawAdminUsers();
  const index = users.findIndex((u) => u.id === userId);
  if (index === -1) {
    return { success: false, error: "User not found." };
  }

  const { hash, salt } = hashPassword(newPassword);
  const now = new Date().toISOString();

  users[index] = {
    ...users[index],
    passwordHash: hash,
    salt,
    updatedAt: now,
  };

  inMemoryUsers = users;
  saveUsersToFile(users);

  if (isSupabaseConfigured()) {
    try {
      await supabaseAdmin
        .from("admin_users")
        .update({
          password_hash: hash,
          salt,
          updated_at: now,
        })
        .eq("id", userId);
    } catch (err) {
      console.warn("Supabase admin_users update notice:", err);
    }
  }

  return { success: true };
}

export async function updateAdminUser(
  userId: string,
  updates: { name?: string; role?: "SUPER_ADMIN" | "ADMIN" | "STAFF"; password?: string }
): Promise<{ success: boolean; user?: SafeAdminUser; error?: string }> {
  const users = await getRawAdminUsers();
  const index = users.findIndex((u) => u.id === userId);
  if (index === -1) {
    return { success: false, error: "User not found." };
  }

  const now = new Date().toISOString();
  let updatedRecord = { ...users[index], updatedAt: now };

  if (updates.name) {
    updatedRecord.name = updates.name.trim();
  }
  if (updates.role) {
    updatedRecord.role = updates.role;
  }
  if (updates.password) {
    if (updates.password.length < 6) {
      return { success: false, error: "Password must be at least 6 characters long." };
    }
    const { hash, salt } = hashPassword(updates.password);
    updatedRecord.passwordHash = hash;
    updatedRecord.salt = salt;
  }

  users[index] = updatedRecord;
  inMemoryUsers = users;
  saveUsersToFile(users);

  if (isSupabaseConfigured()) {
    try {
      await supabaseAdmin
        .from("admin_users")
        .update({
          name: updatedRecord.name,
          role: updatedRecord.role,
          password_hash: updatedRecord.passwordHash,
          salt: updatedRecord.salt,
          updated_at: now,
        })
        .eq("id", userId);
    } catch {
      // Ignored
    }
  }

  return { success: true, user: sanitizeUser(updatedRecord) };
}

export async function deleteAdminUser(
  userId: string,
  requesterUserId?: string
): Promise<{ success: boolean; error?: string }> {
  const users = await getRawAdminUsers();

  // Guard: Cannot delete self
  if (requesterUserId && userId === requesterUserId) {
    return { success: false, error: "You cannot delete your own currently logged-in account." };
  }

  // Guard: Cannot delete last remaining superadmin or last user
  if (users.length <= 1) {
    return { success: false, error: "Cannot delete the last remaining administrator account." };
  }

  const target = users.find((u) => u.id === userId);
  if (!target) {
    return { success: false, error: "User not found." };
  }

  const remainingSuperAdmins = users.filter((u) => u.role === "SUPER_ADMIN" && u.id !== userId);
  if (target.role === "SUPER_ADMIN" && remainingSuperAdmins.length === 0) {
    return {
      success: false,
      error: "Cannot delete this user: at least one SUPER_ADMIN account must remain in the system.",
    };
  }

  const filtered = users.filter((u) => u.id !== userId);
  inMemoryUsers = filtered;
  saveUsersToFile(filtered);

  if (isSupabaseConfigured()) {
    try {
      await supabaseAdmin.from("admin_users").delete().eq("id", userId);
    } catch {
      // Ignored
    }
  }

  return { success: true };
}
