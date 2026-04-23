import { ProfileData } from "./types";

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

export interface DeleteProfileResult {
  success: boolean;
  error?: string;
}

async function parseJsonSafe<T>(response: Response): Promise<T | null> {
  try {
    return (await response.json()) as T;
  } catch {
    return null;
  }
}

export async function createProfileOnServer(
  data: ProfileData,
  password?: string
): Promise<CreateProfileResult> {
  const response = await fetch("/api/profile", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      profile: data,
      password: password || undefined,
    }),
  });

  const result = await parseJsonSafe<CreateProfileResult>(response);

  if (!response.ok) {
    return {
      success: false,
      error: result?.error || "Failed to create profile",
    };
  }

  return result || { success: false, error: "Invalid server response" };
}

export async function saveProfileToServer(
  id: string,
  data: ProfileData,
  password?: string
): Promise<SaveProfileResult> {
  const response = await fetch(`/api/profile/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      profile: data,
      password: password || undefined,
    }),
  });

  const result = await parseJsonSafe<SaveProfileResult>(response);

  if (!response.ok) {
    return {
      success: false,
      error: result?.error || "Failed to save profile",
    };
  }

  return result || { success: false, error: "Invalid server response" };
}

export async function loadProfileFromServer(
  id: string,
  password?: string
): Promise<LoadProfileResult> {
  const query = password
    ? `?password=${encodeURIComponent(password)}`
    : "";

  const response = await fetch(`/api/profile/${id}${query}`, {
    method: "GET",
    cache: "no-store",
  });

  const result = await parseJsonSafe<LoadProfileResult>(response);

  if (!response.ok) {
    return {
      success: false,
      error: result?.error || "Failed to load profile",
    };
  }

  return result || { success: false, error: "Invalid server response" };
}

export async function deleteProfileFromServer(
  id: string,
  password?: string
): Promise<DeleteProfileResult> {
  const response = await fetch(`/api/profile/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      password: password || undefined,
    }),
  });

  const result = await parseJsonSafe<DeleteProfileResult>(response);

  if (!response.ok) {
    return {
      success: false,
      error: result?.error || "Failed to delete profile",
    };
  }

  return result || { success: false, error: "Invalid server response" };
}