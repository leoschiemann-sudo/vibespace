import LZString from "lz-string";
import { ProfileData } from "./types";

export function compressProfileData(data: ProfileData): string {
  const jsonString = JSON.stringify(data);
  return LZString.compressToEncodedURIComponent(jsonString);
}

export function decompressProfileData(compressed: string): ProfileData | null {
  try {
    const decompressed = LZString.decompressFromEncodedURIComponent(compressed);
    if (!decompressed) {
      return null;
    }
    const data = JSON.parse(decompressed) as ProfileData;
    
    // Validate required fields exist
    if (!data.name || !Array.isArray(data.links)) {
      return null;
    }
    
    return data;
  } catch {
    return null;
  }
}

export function generateShareUrl(data: ProfileData): string {
  const compressed = compressProfileData(data);
  // Get base URL dynamically for client-side usage
  if (typeof window !== "undefined") {
    return `${window.location.origin}/v/${compressed}`;
  }
  return `/v/${compressed}`;
}