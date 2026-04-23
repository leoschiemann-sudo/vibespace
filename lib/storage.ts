import { ProfileData, DEFAULT_PROFILE_DATA } from "./types";

const API_BASE = "/api/profiles";

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

// Create a new profile on the server
export async function createProfileOnServer(
  data: ProfileData,
  password?: string
): Promise<CreateProfileResult> {
  try {
    const response = await fetch(API_BASE, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ profile: data, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      return { success: false, error: error.error || "Failed to create profile" };
    }

    const profile = await response.json();
    return { success: true, profile };
  } catch (error) {
    console.error("Error creating profile:", error);
    return { success: false, error: "Network error" };
  }
}

// Save (update) profile to the server
export async function saveProfileToServer(
  id: string,
  data: ProfileData,
  password?: string
): Promise<SaveProfileResult> {
  try {
    const response = await fetch(API_BASE, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, profile: data, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      return { success: false, error: error.error || "Failed to save profile" };
    }

    const profile = await response.json();
    return { success: true, profile };
  } catch (error) {
    console.error("Error saving profile:", error);
    return { success: false, error: "Network error" };
  }
}

// Load profile from the server
export async function loadProfileFromServer(
  id: string,
  password?: string
): Promise<LoadProfileResult> {
  try {
    const url = new URL(API_BASE, window.location.origin);
    url.searchParams.set("id", id);
    if (password) {
      url.searchParams.set("password", password);
    }

    const response = await fetch(url.toString(), {
      method: "GET",
    });

    if (!response.ok) {
      const error = await response.json();
      return { success: false, error: error.error || "Failed to load profile" };
    }

    const profile = await response.json();
    return { success: true, profile };
  } catch (error) {
    console.error("Error loading profile:", error);
    return { success: false, error: "Network error" };
  }
}

// Delete profile from the server
export async function deleteProfileFromServer(
  id: string,
  password?: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const url = new URL(API_BASE, window.location.origin);
    url.searchParams.set("id", id);
    if (password) {
      url.searchParams.set("password", password);
    }

    const response = await fetch(url.toString(), {
      method: "DELETE",
    });

    if (!response.ok) {
      const error = await response.json();
      return { success: false, error: error.error || "Failed to delete profile" };
    }

    return { success: true };
  } catch (error) {
    console.error("Error deleting profile:", error);
    return { success: false, error: "Network error" };
  }
}

// Legacy localStorage functions for backwards compatibility
const STORAGE_KEY = "vibespace_profile_data";
const PROFILE_ID_KEY = "vibespace_profile_id";
const PROFILE_PASSWORD_KEY = "vibespace_profile_password";

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
