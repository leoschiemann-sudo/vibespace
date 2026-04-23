import { ProfileData, DEFAULT_PROFILE_DATA } from "./types";

const STORAGE_KEY = "vibespace_profile_data";

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
    
    // Ensure all required fields exist
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
  } catch (error) {
    console.error("Failed to clear profile from localStorage:", error);
  }
}