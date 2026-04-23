import { NextResponse } from "next/server";
import { clearEditorSessionCookie } from "@/lib/editor-auth";

export async function POST() {
  try {
    await clearEditorSessionCookie();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Editor logout error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
