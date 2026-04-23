export interface ProfileLink {
  title: string;
  url: string;
}

export interface ProfileMood {
  emoji: string;
  text: string;
}

export interface ProfileData {
  name: string;
  bio: string;
  avatarUrl: string;
  mood: ProfileMood;
  spotifyUrl: string;
  links: ProfileLink[];
}

export const DEFAULT_PROFILE_DATA: ProfileData = {
  name: "",
  bio: "",
  avatarUrl: "",
  mood: {
    emoji: "🎵",
    text: "Feeling good",
  },
  spotifyUrl: "",
  links: [],
};