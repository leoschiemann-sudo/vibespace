import { NextRequest, NextResponse } from "next/server";
import { sanityClient, sanityReadonlyClient } from "@/lib/sanity";
import type { ProfileData } from "@/lib/types";
import type { SanityProfile } from "@/lib/schemas/profile";

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

interface UpdateProfileRequest {
  profile: ProfileData;
  password?: string;
}

interface DeleteProfileRequest {
  password?: string;
}

function sanityToProfileData(profile: SanityProfile): ProfileData {
  return {
    name: profile.name || "",
    bio: profile.bio || "",
    avatarUrl: profile.avatarUrl || "",
    mood: profile.mood || { emoji: "🎵", text: "Feeling good" },
    spotifyUrl: profile.spotifyUrl || "",
    links: profile.links?.map((link) => ({
      title: link.title,
      url: link.url,
    })) || [],
  };
}

async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

async function getProfileById(id: string): Promise<SanityProfile | null> {
  return sanityClient.fetch<SanityProfile | null>(
    `*[_type == "profile" && _id == $id][0]`,
    { id }
  );
}

async function verifyPassword(
  profile: SanityProfile,
  password?: string
): Promise<{ ok: boolean; error?: string }> {
  if (!profile.passwordHash) {
    return { ok: true };
  }

  if (!password) {
    return { ok: false, error: "Password required" };
  }

  const inputHash = await hashPassword(password);

  if (inputHash !== profile.passwordHash) {
    return { ok: false, error: "Invalid password" };
  }

  return { ok: true };
}

export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const password = request.nextUrl.searchParams.get("password") || undefined;

    const profile = await sanityReadonlyClient.fetch<SanityProfile | null>(
      `*[_type == "profile" && _id == $id][0]`,
      { id }
    );

    if (!profile) {
      return NextResponse.json(
        { success: false, error: "Profile not found" },
        { status: 404 }
      );
    }

    const auth = await verifyPassword(profile, password);

    if (!auth.ok) {
      return NextResponse.json(
        { success: false, error: auth.error },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      profile: {
        ...sanityToProfileData(profile),
        id: profile._id,
        createdAt: profile.createdAt,
        updatedAt: profile.updatedAt,
      },
    });
  } catch (error) {
    console.error("Error loading profile:", error);

    return NextResponse.json(
      { success: false, error: "Failed to load profile" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const body = (await request.json()) as UpdateProfileRequest;

    if (!body?.profile) {
      return NextResponse.json(
        { success: false, error: "Missing profile data" },
        { status: 400 }
      );
    }

    const existing = await getProfileById(id);

    if (!existing) {
      return NextResponse.json(
        { success: false, error: "Profile not found" },
        { status: 404 }
      );
    }

    const auth = await verifyPassword(existing, body.password);

    if (!auth.ok) {
      return NextResponse.json(
        { success: false, error: auth.error },
        { status: 401 }
      );
    }

    const now = new Date().toISOString();

    const updates: Record<string, unknown> = {
      name: body.profile.name,
      bio: body.profile.bio,
      avatarUrl: body.profile.avatarUrl,
      mood: body.profile.mood,
      spotifyUrl: body.profile.spotifyUrl,
      links: body.profile.links.map((link) => ({
        _key: crypto.randomUUID(),
        title: link.title,
        url: link.url,
      })),
      updatedAt: now,
    };

    if (body.password) {
      updates.passwordHash = await hashPassword(body.password);
    }

    const result = await sanityClient.patch(id).set(updates).commit();

    return NextResponse.json({
      success: true,
      profile: {
        ...sanityToProfileData(result as SanityProfile),
        id: result._id,
        createdAt: existing.createdAt,
        updatedAt: now,
      },
    });
  } catch (error) {
    console.error("Error saving profile:", error);

    return NextResponse.json(
      { success: false, error: "Failed to save profile" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const body = (await request.json()) as DeleteProfileRequest;

    const existing = await getProfileById(id);

    if (!existing) {
      return NextResponse.json(
        { success: false, error: "Profile not found" },
        { status: 404 }
      );
    }

    const auth = await verifyPassword(existing, body?.password);

    if (!auth.ok) {
      return NextResponse.json(
        { success: false, error: auth.error },
        { status: 401 }
      );
    }

    await sanityClient.delete(id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting profile:", error);

    return NextResponse.json(
      { success: false, error: "Failed to delete profile" },
      { status: 500 }
    );
  }
}