// Sanity Schema Types for Profile

export interface SanityProfileLink {
  _key: string;
  title: string;
  url: string;
}

export interface SanityProfileMood {
  emoji: string;
  text: string;
}

export interface SanityProfile {
  _id: string;
  _type: "profile";
  name: string;
  bio: string;
  avatarUrl: string;
  mood: SanityProfileMood;
  spotifyUrl: string;
  links: SanityProfileLink[];
  passwordHash?: string;
  ownerId?: string;
  createdAt: string;
  updatedAt: string;
}

// Input type for creating/updating profiles
export type SanityProfileInput = Omit<
  SanityProfile,
  "_id" | "_type" | "createdAt" | "updatedAt"
>;