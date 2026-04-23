// Sanity Schema Types for Profile

export interface SanityProfile {
  _id: string;
  _type: "profile";
  name: string;
  bio: string;
  avatarUrl: string;
  mood: {
    emoji: string;
    text: string;
  };
  spotifyUrl: string;
  links: Array<{
    _key: string;
    title: string;
    url: string;
  }>;
  passwordHash?: string;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
}

// Input type for creating/updating profiles (without _id, _type, timestamps)
export type SanityProfileInput = Omit<
  SanityProfile,
  "_id" | "_type" | "createdAt" | "updatedAt"
>;
