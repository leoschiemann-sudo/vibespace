import { ProfileData, DEFAULT_PROFILE_DATA } from "./types";
import { sanityClient, isSanityConfigured } from "./sanity";
import { SanityProfile } from "./schemas/profile";

// Storage keys for localStorage fallback
const STORAGE_KEY = "vibespace_profile_data";
const PROFILE_ID_KEY = "vibespace_profile_id";
const PROFILE_PASSWORD_KEY = "vibespace_profile_password";

// Convert Sanity profile to ProfileData
function sanityToProfileData(profile: SanityProfile): ProfileData {
  return {
    name: profile.name || "",
    bio: profile.bio || "",
    avatarUrl: profile.avatarUrl || "",
    mood: profile.mood || { emoji: "🎵", text: "Feeling good" },
    spotifyUrl: profile.spotifyUrl || "",
    links: profile.links?.map((l) => ({ title: l.title, url: l.url })) || [],
  };
}

export interface ServerProfile extends ProfileData {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProfileResult {
  success: boolean;
  profile?: ServerProfile;
  error?: string;
}

export interface SaveProfileResult {
  success: boolean;
  profile?: ServerProfile;
  error?: string;
}

export interface LoadProfileResult {
  success: boolean;
  profile?: ServerProfile;
  error?: string;
}

// Create a new profile in Sanity
export async function createProfileOnServer(
  data: ProfileData,
  password?: string
): Promise<CreateProfileResult> {
  if (!isSanityConfigured()) {
    return { success: false, error: "Sanity not configured" };
  }

  try {
    // Hash password client-side before sending
    let passwordHash = "";
    if (password) {
      const encoder = new TextEncoder();
      const data = encoder.encode(password);
      const hashBuffer = await crypto.subtle.digest("SHA-256", data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      passwordHash = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
    }

    const ownerId = crypto.randomUUID();
    const now = new Date().toISOString();

    const doc = {
      _type: "profile",
      name: data.name,
      bio: data.bio,
      avatarUrl: data.avatarUrl,
      mood: data.mood,
      spotifyUrl: data.spotifyUrl,
      links: data.links.map((l, i) => ({
        _key: crypto.randomUUID(),
        title: l.title,
        url: l.url,
      })),
      passwordHash,
      ownerId,
      createdAt: now,
      updatedAt: now,
    };

    const result = await sanityClient.create(doc);

    return {
      success: true,
      profile: {
        ...sanityToProfileData(result as unknown as SanityProfile),
        id: result._id,
        createdAt: now,
        updatedAt: now,
      },
    };
  } catch (error) {
    console.error("Error creating profile in Sanity:", error);
    return { success: false, error: "Failed to create profile" };
  }
}

// Save (update) profile in Sanity
export async function saveProfileToServer(
  id: string,
  data: ProfileData,
  password?: string
): Promise<SaveProfileResult> {
  if (!isSanityConfigured()) {
    return { success: false, error: "Sanity not configured" };
  }

  try {
    // Hash password if provided
    let passwordHash = "";
    if (password) {
      const encoder = new TextEncoder();
      const passData = encoder.encode(password);
      const hashBuffer = await crypto.subtle.digest("SHA-256", passData);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      passwordHash = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
    }

    const now = new Date().toISOString();

    // First, get the existing document to preserve passwordHash and ownerId
    const existing = await sanityClient.fetch<SanityProfile>(`*[_type == "profile" && _id == $id][0]`, { id });

    if (!existing) {
      return { success: false, error: "Profile not found" };
    }

    const updates = {
      name: data.name,
      bio: data.bio,
      avatarUrl: data.avatarUrl,
      mood: data.mood,
      spotifyUrl: data.spotifyUrl,
      links: data.links.map((l) => ({
        _key: crypto.randomUUID(),
        title: l.title,
        url: l.url,
      })),
      updatedAt: now,
    };

    // Update password only if provided
    if (passwordHash) {
      (updates as Record<string, unknown>).passwordHash = passwordHash;
    }

    const result = await sanityClient.patch(id).set(updates).commit();

    return {
      success: true,
      profile: {
        ...sanityToProfileData(result as unknown as SanityProfile),
        id: result._id,
        createdAt: existing.createdAt,
        updatedAt: now,
      },
    };
  } catch (error) {
    console.error("Error saving profile to Sanity:", error);
    return { success: false, error: "Failed to save profile" };
  }
}

// Load profile from Sanity
export async function loadProfileFromServer(
  id: string,
  password?: string
): Promise<LoadProfileResult> {
  if (!isSanityConfigured()) {
    return { success: false, error: "Sanity not configured" };
  }

  try {
    const profile = await sanityClient.fetch<SanityProfile>(
      `*[_type == "profile" && _id == $id][0]`,
      { id }
    );

    if (!profile) {
      return { success: false, error: "Profile not found" };
    }

    // Verify password if profile is protected
    if (profile.passwordHash && password) {
      const encoder = new TextEncoder();
      const passData = encoder.encode(password);
      const hashBuffer = await crypto.subtle.digest("SHA-256", passData);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const inputHash = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");

      if (inputHash !== profile.passwordHash) {
        return { success: false, error: "Invalid password" };
      }
    }

    return {
      success: true,
      profile: {
        ...sanityToProfileData(profile),
        id: profile._id,
        createdAt: profile.createdAt,
        updatedAt: profile.updatedAt,
      },
    };
  } catch (error) {
    console.error("Error loading profile from Sanity:", error);
    return { success: false, error: "Failed to load profile" };
  }
}

// Delete profile from Sanity
export async function deleteProfileFromServer(
  id: string,
  password?: string
): Promise<{ success: boolean; error?: string }> {
  if (!isSanityConfigured()) {
    return { success: false, error: "Sanity not configured" };
  }

  try {
    // Get existing profile to verify password
    const profile = await sanityClient.fetch<SanityProfile>(
      `*[_type == "profile" && _id == $id][0]`,
      { id }
    );

    if (!profile) {
      return { success: false, error: "Profile not found" };
    }

    // Verify password if profile is protected
    if (profile.passwordHash && password) {
      const encoder = new TextEncoder();
      const passData = encoder.encode(password);
      const hashBuffer = await crypto.subtle.digest("SHA-256", passData);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const inputHash = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");

      if (inputHash !== profile.passwordHash) {
        return { success: false, error: "Invalid password" };
      }
    }

    await sanityClient.delete(id);
    return { success: true };
  } catch (error) {
    console.error("Error deleting profile from Sanity:", error);
    return { success: false, error: "Failed to delete profile" };
  }
}

// Legacy localStorage functions for backwards compatibility
export function saveProfileToStorage(data: ProfileData): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error("Failed to save profile to localStorage:", error);
  }
}

export function loadProfileFromStorage(): ProfileData {
  if (typeof window === "undefined") {
    return DEFAULT_PROFILE_DATA;
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return DEFAULT_PROFILE_DATA;
    }

    const data = JSON.parse(stored) as ProfileData;

    return {
      name: data.name ?? DEFAULT_PROFILE_DATA.name,
      bio: data.bio ?? DEFAULT_PROFILE_DATA.bio,
      avatarUrl: data.avatarUrl ?? DEFAULT_PROFILE_DATA.avatarUrl,
      mood: {
        emoji: data.mood?.emoji ?? DEFAULT_PROFILE_DATA.mood.emoji,
        text: data.mood?.text ?? DEFAULT_PROFILE_DATA.mood.text,
      },
      spotifyUrl: data.spotifyUrl ?? DEFAULT_PROFILE_DATA.spotifyUrl,
      links: Array.isArray(data.links) ? data.links : DEFAULT_PROFILE_DATA.links,
    };
  } catch {
    return DEFAULT_PROFILE_DATA;
  }
}

export function clearProfileStorage(): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(PROFILE_ID_KEY);
    localStorage.removeItem(PROFILE_PASSWORD_KEY);
  } catch (error) {
    console.error("Failed to clear profile from localStorage:", error);
  }
}

// Server profile ID management
export function saveProfileId(id: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(PROFILE_ID_KEY, id);
}

export function loadProfileId(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(PROFILE_ID_KEY);
}

export function saveProfilePassword(password: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(PROFILE_PASSWORD_KEY, password);
}

export function loadProfilePassword(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(PROFILE_PASSWORD_KEY);
}
