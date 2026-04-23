"use client";

import { useState, useEffect } from "react";
import { ProfileData, DEFAULT_PROFILE_DATA } from "@/lib/types";
import {
  loadProfileFromStorage,
  saveProfileToStorage,
  saveProfileId,
  loadProfileId,
  saveProfilePassword,
  loadProfilePassword,
  createProfileOnServer,
  saveProfileToServer,
  loadProfileFromServer,
} from "@/lib/storage";
import { EditorForm } from "@/components/EditorForm";
import { ProfilePreview } from "@/components/ProfilePreview";
import { ShareButton } from "@/components/ShareButton";
import { Smartphone, Edit3, Lock, Unlock } from "lucide-react";

export default function HomePage() {
  const [profile, setProfile] = useState<ProfileData>(DEFAULT_PROFILE_DATA);
  const [isLoading, setIsLoading] = useState(true);
  const [showPreview, setShowPreview] = useState(false);
  const [profileId, setProfileId] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  // Load profile from server on mount
  useEffect(() => {
    const loadProfile = async () => {
      const storedId = loadProfileId();
      const storedPassword = loadProfilePassword();

      if (storedId) {
        setProfileId(storedId);
        const result = await loadProfileFromServer(storedId, storedPassword || undefined);
        if (result.success && result.profile) {
          setProfile(result.profile);
          if (storedPassword) {
            setPassword(storedPassword);
          }
        }
      } else {
        // Fallback to localStorage for migration
        const stored = loadProfileFromStorage();
        setProfile(stored);
      }
      setIsLoading(false);
    };

    loadProfile();
  }, []);

  // Save to server whenever profile changes
  useEffect(() => {
    if (isLoading) return;

    const saveProfile = async () => {
      if (profileId) {
        // Update existing profile on server
        const result = await saveProfileToServer(profileId, profile, password || undefined);
        if (!result.success) {
          console.error("Failed to save to server:", result.error);
          // Fallback to localStorage
          saveProfileToStorage(profile);
        }
      } else {
        // Save to localStorage as fallback
        saveProfileToStorage(profile);
      }
    };

    saveProfile();
  }, [profile, isLoading, profileId, password]);

  // Create new profile on server
  const handleCreateProfile = async (pwd: string) => {
    const result = await createProfileOnServer(profile, pwd || undefined);
    if (result.success && result.profile) {
      setProfileId(result.profile.id);
      saveProfileId(result.profile.id);
      if (pwd) {
        setPassword(pwd);
        saveProfilePassword(pwd);
      }
      setShowPasswordPrompt(false);
      setPasswordError("");
    } else {
      setPasswordError(result.error || "Failed to create profile");
    }
  };

  // Save current profile to server
  const handleSaveToServer = async () => {
    if (!profileId) {
      // Create new profile if no ID exists
      setShowPasswordPrompt(true);
      return;
    }

    const result = await saveProfileToServer(profileId, profile, password || undefined);
    if (result.success) {
      // Profile saved successfully
    } else {
      setPasswordError(result.error || "Failed to save");
    }
  };

  // Handle password submission for saving
  const handlePasswordSubmit = () => {
    if (profileId) {
      handleSaveToServer();
    } else {
      handleCreateProfile(password);
    }
  };

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
          
          <div className="flex items-center gap-2">
            {/* Save to Server button */}
            <button
              onClick={() => setShowPasswordPrompt(true)}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 text-white font-medium rounded-full hover:opacity-90 transition-opacity text-sm"
            >
              {profileId ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
              <span>{profileId ? "Gespeichert" : "Speichern"}</span>
            </button>
            
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

      {/* Password Prompt Modal */}
      {showPasswordPrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 w-full max-w-sm shadow-xl">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              {profileId ? "Profil aktualisieren" : "Profil erstellen"}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Optional: Legen Sie ein Passwort fest, um Ihr Profil zu schützen.
            </p>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Passwort (optional)"
              className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
            />
            {passwordError && (
              <p className="text-red-500 text-sm mb-4">{passwordError}</p>
            )}
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowPasswordPrompt(false);
                  setPasswordError("");
                }}
                className="flex-1 px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                Abbrechen
              </button>
              <button
                onClick={handlePasswordSubmit}
                className="flex-1 px-4 py-2 rounded-xl bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 text-white font-medium hover:opacity-90 transition-opacity"
              >
                {profileId ? "Aktualisieren" : "Erstellen"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
