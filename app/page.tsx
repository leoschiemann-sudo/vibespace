"use client";

import { useState, useEffect } from "react";
import { ProfileData, DEFAULT_PROFILE_DATA } from "@/lib/types";
import { loadProfileFromStorage, saveProfileToStorage } from "@/lib/storage";
import { EditorForm } from "@/components/EditorForm";
import { ProfilePreview } from "@/components/ProfilePreview";
import { ShareButton } from "@/components/ShareButton";
import { Smartphone, Edit3 } from "lucide-react";

export default function HomePage() {
  const [profile, setProfile] = useState<ProfileData>(DEFAULT_PROFILE_DATA);
  const [isLoading, setIsLoading] = useState(true);
  const [showPreview, setShowPreview] = useState(false);

  // Load profile from localStorage on mount
  useEffect(() => {
    const stored = loadProfileFromStorage();
    setProfile(stored);
    setIsLoading(false);
  }, []);

  // Save to localStorage whenever profile changes
  useEffect(() => {
    if (!isLoading) {
      saveProfileToStorage(profile);
    }
  }, [profile, isLoading]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-gray-400 dark:text-gray-600">Laden...</div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-950/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 bg-clip-text text-transparent">
            VibeSpace
          </h1>
          
          {/* Mobile preview toggle */}
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="lg:hidden flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-full text-sm text-gray-700 dark:text-gray-300"
          >
            {showPreview ? (
              <>
                <Edit3 className="w-4 h-4" />
                <span>Bearbeiten</span>
              </>
            ) : (
              <>
                <Smartphone className="w-4 h-4" />
                <span>Vorschau</span>
              </>
            )}
          </button>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Mobile: Preview first (collapsible) */}
        {showPreview && (
          <div className="lg:hidden mb-8 flex flex-col items-center">
            <ProfilePreview profile={profile} />
          </div>
        )}
        
        {/* Desktop: Split layout */}
        <div className="hidden lg:grid lg:grid-cols-2 gap-8 items-start">
          {/* Left: Editor */}
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
              <Edit3 className="w-5 h-5" />
              <span className="font-medium">Editor</span>
            </div>
            <EditorForm profile={profile} onUpdate={setProfile} />
            <ShareButton profile={profile} />
          </div>
          
          {/* Right: Preview */}
          <div className="flex flex-col items-center sticky top-24">
            <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 mb-4">
              <Smartphone className="w-5 h-5" />
              <span className="font-medium">Live Vorschau</span>
            </div>
            <ProfilePreview profile={profile} />
          </div>
        </div>
        
        {/* Mobile: Editor below preview (when preview is hidden) */}
        {!showPreview && (
          <div className="lg:hidden mt-8 flex flex-col gap-6">
            <EditorForm profile={profile} onUpdate={setProfile} />
            <ShareButton profile={profile} />
          </div>
        )}
      </div>
    </main>
  );
}
