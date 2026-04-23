import { NextRequest, NextResponse } from "next/server";
import { sanityClient } from "@/lib/sanity";
import {
  verifyEditorPassword,
  createSessionPayload,
  setEditorSessionCookie,
} from "@/lib/editor-auth";

const EDITOR_SETTINGS_ID = "editorSettings";

interface EditorSettings {
  _id: string;
  passwordHash: string;
  updatedAt: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { password } = body;

    if (!password || typeof password !== "string") {
      return NextResponse.json(
        { success: false, error: "Password is required" },
        { status: 400 }
      );
    }

    // Fetch editor settings from Sanity
    const editorSettings = await sanityClient.fetch<EditorSettings | null>(
      `*[_type == "editorSettings" && _id == $id][0]`,
      { id: EDITOR_SETTINGS_ID }
    );

    if (!editorSettings) {
      return NextResponse.json(
        { success: false, error: "Editor password not configured" },
        { status: 200 }
      );
    }

    if (!editorSettings.passwordHash) {
      return NextResponse.json(
        { success: false, error: "Editor password not configured" },
        { status: 200 }
      );
    }

    // Verify password with Argon2id
    const isValid = await verifyEditorPassword(
      password,
      editorSettings.passwordHash
    );

    if (!isValid) {
      return NextResponse.json(
        { success: false, error: "Invalid password" },
        { status: 401 }
      );
    }

    // Create authenticated session
    const sessionPayload = createSessionPayload();
    await setEditorSessionCookie(sessionPayload);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Editor verify error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
