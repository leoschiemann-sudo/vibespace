import { NextResponse } from "next/server";
import { getEditorSession } from "@/lib/editor-auth";

export async function GET() {
  try {
    const session = await getEditorSession();

    if (!session) {
      return NextResponse.json({ authenticated: false });
    }

    return NextResponse.json({ authenticated: true });
  } catch (error) {
    console.error("Editor session check error:", error);
    return NextResponse.json({ authenticated: false });
  }
}
