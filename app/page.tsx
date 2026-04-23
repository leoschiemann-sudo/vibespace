"use client";

import { useState } from "react";
import { ProfileData, DEFAULT_PROFILE_DATA } from "@/lib/types";
import {
  createProfileOnServer,
  saveProfileToServer,
} from "@/lib/storage";
import { EditorForm } from "@/components/EditorForm";
import { ProfilePreview } from "@/components/ProfilePreview";
import { ShareButton } from "@/components/ShareButton";
import { Smartphone, Edit3, Lock, Unlock } from "lucide-react";

export default function HomePage() {
  const [profile, setProfile] = useState<ProfileData>(DEFAULT_PROFILE_DATA);
  const [showPreview, setShowPreview] = useState(false);
  const [profileId, setProfileId] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const handleCreateProfile = async () => {
    setIsSaving(true);
    setPasswordError("");

    try {
      const result = await createProfileOnServer(profile, password || undefined);

      if (result.success && result.profile) {
        setProfileId(result.profile.id);
        setShowPasswordPrompt(false);
        return;
      }

      setPasswordError(result.error || "Failed to create profile");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveExistingProfile = async () => {
    if (!profileId) return;

    setIsSaving(true);
    setPasswordError("");

    try {
      const result = await saveProfileToServer(
        profileId,
        profile,
        password || undefined
      );

      if (result.success) {
        setShowPasswordPrompt(false);
        return;
      }

      setPasswordError(result.error || "Failed to save profile");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveClick = () => {
    setPasswordError("");
    setShowPasswordPrompt(true);
  };

  const handlePasswordSubmit = async () => {
    if (profileId) {
      await handleSaveExistingProfile();
      return;
    }

    await handleCreateProfile();
  };

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-950/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 bg-clip-text text-transparent">
            VibeSpace
          </h1>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSaveClick}
              disabled={isSaving}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 text-white font-medium rounded-full hover:opacity-90 transition-opacity text-sm disabled:opacity-50"
            >
              {profileId ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
              <span>
                {isSaving ? "Speichert..." : profileId ? "Aktualisieren" : "Speichern"}
              </span>
            </button>

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

      <div className="max-w-7xl mx-auto px-4 py-8">
        {showPreview && (
          <div className="lg:hidden mb-8 flex flex-col items-center">
            <ProfilePreview profile={profile} />
          </div>
        )}

        <div className="hidden lg:grid lg:grid-cols-2 gap-8 items-start">
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
              <Edit3 className="w-5 h-5" />
              <span className="font-medium">Editor</span>
            </div>
            <EditorForm profile={profile} onUpdate={setProfile} />
            <ShareButton profile={profile} profileId={profileId} />
          </div>

          <div className="flex flex-col items-center sticky top-24">
            <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 mb-4">
              <Smartphone className="w-5 h-5" />
              <span className="font-medium">Live Vorschau</span>
            </div>
            <ProfilePreview profile={profile} />
          </div>
        </div>

        {!showPreview && (
          <div className="lg:hidden mt-8 flex flex-col gap-6">
            <EditorForm profile={profile} onUpdate={setProfile} />
            <ShareButton profile={profile} profileId={profileId} />
          </div>
        )}
      </div>

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
                disabled={isSaving}
                className="flex-1 px-4 py-2 rounded-xl bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 text-white font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {isSaving
                  ? "Bitte warten..."
                  : profileId
                    ? "Aktualisieren"
                    : "Erstellen"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}