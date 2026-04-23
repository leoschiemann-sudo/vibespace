import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";
import crypto from "crypto";
import { ProfileData } from "@/lib/types";

// Extended profile type stored on server
interface StoredProfile extends ProfileData {
  id: string;
  passwordHash: string;
  createdAt: string;
  updatedAt: string;
}

const DATA_DIR = path.join(process.cwd(), "app", "data", "profiles");

// Simple hash function for password protection
function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(password).digest("hex");
}

function verifyPassword(password: string, hash: string): boolean {
  return hashPassword(password) === hash;
}

// GET - Load profile by ID
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const password = searchParams.get("password");

    if (!id) {
      return NextResponse.json({ error: "Profile ID required" }, { status: 400 });
    }

    const filePath = path.join(DATA_DIR, `${id}.json`);
    
    try {
      await fs.access(filePath);
    } catch {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    const data = await fs.readFile(filePath, "utf-8");
    const profile: StoredProfile = JSON.parse(data);

    // If profile is password protected, verify
    if (profile.passwordHash) {
      if (!password) {
        return NextResponse.json({ error: "Password required" }, { status: 401 });
      }
      if (!verifyPassword(password, profile.passwordHash)) {
        return NextResponse.json({ error: "Invalid password" }, { status: 401 });
      }
    }

    // Return profile without password hash
    const { passwordHash, ...publicProfile } = profile;
    return NextResponse.json(publicProfile);
  } catch (error) {
    console.error("Error loading profile:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST - Create new profile
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { profile, password } = body;

    if (!profile) {
      return NextResponse.json({ error: "Profile data required" }, { status: 400 });
    }

    // Generate unique ID
    const id = crypto.randomBytes(8).toString("hex");
    const now = new Date().toISOString();

    const storedProfile: StoredProfile = {
      id,
      ...profile,
      passwordHash: password ? hashPassword(password) : "",
      createdAt: now,
      updatedAt: now,
    };

    // Ensure directory exists
    await fs.mkdir(DATA_DIR, { recursive: true });
    
    const filePath = path.join(DATA_DIR, `${id}.json`);
    await fs.writeFile(filePath, JSON.stringify(storedProfile, null, 2));

    // Return profile without password hash
    const { passwordHash, ...publicProfile } = storedProfile;
    return NextResponse.json(publicProfile);
  } catch (error) {
    console.error("Error creating profile:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// PUT - Update existing profile
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, profile, password } = body;

    if (!id || !profile) {
      return NextResponse.json({ error: "ID and profile data required" }, { status: 400 });
    }

    const filePath = path.join(DATA_DIR, `${id}.json`);

    // Check if profile exists
    let existingProfile: StoredProfile;
    try {
      const data = await fs.readFile(filePath, "utf-8");
      existingProfile = JSON.parse(data);
    } catch {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    // If profile is password protected, verify
    if (existingProfile.passwordHash) {
      if (!password) {
        return NextResponse.json({ error: "Password required" }, { status: 401 });
      }
      if (!verifyPassword(password, existingProfile.passwordHash)) {
        return NextResponse.json({ error: "Invalid password" }, { status: 401 });
      }
    }

    const updatedProfile: StoredProfile = {
      ...existingProfile,
      ...profile,
      id,
      passwordHash: existingProfile.passwordHash,
      createdAt: existingProfile.createdAt,
      updatedAt: new Date().toISOString(),
    };

    await fs.writeFile(filePath, JSON.stringify(updatedProfile, null, 2));

    // Return profile without password hash
    const { passwordHash, ...publicProfile } = updatedProfile;
    return NextResponse.json(publicProfile);
  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// DELETE - Delete profile
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const password = searchParams.get("password");

    if (!id) {
      return NextResponse.json({ error: "Profile ID required" }, { status: 400 });
    }

    const filePath = path.join(DATA_DIR, `${id}.json`);

    // Check if profile exists and is password protected
    try {
      const data = await fs.readFile(filePath, "utf-8");
      const profile: StoredProfile = JSON.parse(data);

      if (profile.passwordHash) {
        if (!password) {
          return NextResponse.json({ error: "Password required" }, { status: 401 });
        }
        if (!verifyPassword(password, profile.passwordHash)) {
          return NextResponse.json({ error: "Invalid password" }, { status: 401 });
        }
      }
    } catch {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    await fs.unlink(filePath);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting profile:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
