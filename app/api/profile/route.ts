import { NextRequest, NextResponse } from "next/server";
import { sanityClient } from "@/lib/sanity";
import type { ProfileData } from "@/lib/types";
import type { SanityProfile } from "@/lib/schemas/profile";

interface CreateProfileRequest {
  profile: ProfileData;
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

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as CreateProfileRequest;

    if (!body?.profile) {
      return NextResponse.json(
        { success: false, error: "Missing profile data" },
        { status: 400 }
      );
    }

    const now = new Date().toISOString();
    const passwordHash = body.password ? await hashPassword(body.password) : "";

    const doc = {
      _type: "profile",
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
      passwordHash,
      ownerId: crypto.randomUUID(),
      createdAt: now,
      updatedAt: now,
    };

    const result = await sanityClient.create(doc) as unknown as SanityProfile;

    return NextResponse.json({
      success: true,
      profile: {
        ...sanityToProfileData(result),
        id: result._id,
        createdAt: now,
        updatedAt: now,
      },
    });
  } catch (error) {
    console.error("Error creating profile:", error);

    return NextResponse.json(
      { success: false, error: "Failed to create profile" },
      { status: 500 }
    );
  }
}