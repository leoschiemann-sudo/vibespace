"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { ProfileData, ProfileLink } from "@/lib/types";

interface EditorFormProps {
  profile: ProfileData;
  onUpdate: (profile: ProfileData) => void;
}

export function EditorForm({ profile, onUpdate }: EditorFormProps) {
  const [newLinkTitle, setNewLinkTitle] = useState("");
  const [newLinkUrl, setNewLinkUrl] = useState("");

  const handleNameChange = (name: string) => {
    onUpdate({ ...profile, name });
  };

  const handleBioChange = (bio: string) => {
    onUpdate({ ...profile, bio });
  };

  const handleAvatarUrlChange = (avatarUrl: string) => {
    onUpdate({ ...profile, avatarUrl });
  };

  const handleMoodEmojiChange = (emoji: string) => {
    onUpdate({ ...profile, mood: { ...profile.mood, emoji } });
  };

  const handleMoodTextChange = (text: string) => {
    onUpdate({ ...profile, mood: { ...profile.mood, text } });
  };

  const handleSpotifyUrlChange = (spotifyUrl: string) => {
    onUpdate({ ...profile, spotifyUrl });
  };

  const handleAddLink = () => {
    if (newLinkTitle.trim() === "" || newLinkUrl.trim() === "") return;
    
    const newLink: ProfileLink = {
      title: newLinkTitle.trim(),
      url: newLinkUrl.trim(),
    };
    
    onUpdate({ ...profile, links: [...profile.links, newLink] });
    setNewLinkTitle("");
    setNewLinkUrl("");
  };

  const handleRemoveLink = (index: number) => {
    const newLinks = profile.links.filter((_, i) => i !== index);
    onUpdate({ ...profile, links: newLinks });
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-md">
      {/* Name */}
      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Name
        </label>
        <input
          type="text"
          value={profile.name}
          onChange={(e) => handleNameChange(e.target.value)}
          placeholder="Dein Name"
          className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Bio */}
      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Bio
        </label>
        <textarea
          value={profile.bio}
          onChange={(e) => handleBioChange(e.target.value)}
          placeholder="Über dich..."
          rows={3}
          className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
        />
      </div>

      {/* Avatar URL */}
      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Avatar URL
        </label>
        <input
          type="url"
          value={profile.avatarUrl}
          onChange={(e) => handleAvatarUrlChange(e.target.value)}
          placeholder="https://..."
          className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Mood */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Mood
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={profile.mood.emoji}
            onChange={(e) => handleMoodEmojiChange(e.target.value)}
            placeholder="🎵"
            maxLength={2}
            className="w-16 px-3 py-2 text-center rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            value={profile.mood.text}
            onChange={(e) => handleMoodTextChange(e.target.value)}
            placeholder="Feeling good"
            className="flex-1 px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Spotify URL */}
      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Spotify URL
        </label>
        <input
          type="url"
          value={profile.spotifyUrl}
          onChange={(e) => handleSpotifyUrlChange(e.target.value)}
          placeholder="https://open.spotify.com/..."
          className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Links */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Links ({profile.links.length})
        </label>
        
        {/* Existing links */}
        {profile.links.length > 0 && (
          <div className="space-y-2">
            {profile.links.map((link, index) => (
              <div
                key={index}
                className="flex items-center justify-between px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-xl"
              >
                <div className="flex flex-col min-w-0 flex-1">
                  <span className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {link.title}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {link.url}
                  </span>
                </div>
                <button
                  onClick={() => handleRemoveLink(index)}
                  className="ml-2 p-2 text-gray-400 hover:text-red-500 transition-colors"
                  aria-label="Link entfernen"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
        
        {/* Add new link */}
        <div className="flex flex-col gap-2">
          <input
            type="text"
            value={newLinkTitle}
            onChange={(e) => setNewLinkTitle(e.target.value)}
            placeholder="Link-Titel"
            className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="url"
            value={newLinkUrl}
            onChange={(e) => setNewLinkUrl(e.target.value)}
            placeholder="https://..."
            className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleAddLink}
            disabled={!newLinkTitle.trim() || !newLinkUrl.trim()}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 dark:disabled:bg-gray-700 text-white disabled:text-gray-500 rounded-xl transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Link hinzufügen</span>
          </button>
        </div>
      </div>
    </div>
  );
}