"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ProfilePreview } from "@/components/ProfilePreview";
import { DEFAULT_PROFILE_DATA, type ProfileData } from "@/lib/types";
import { loadProfileFromServer } from "@/lib/storage";

export default function PublicProfilePage() {
  const params = useParams<{ id: string }>();
  const id = params?.id;

  const [profile, setProfile] = useState<ProfileData>(DEFAULT_PROFILE_DATA);
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isUnlocking, setIsUnlocking] = useState(false);
  const [requiresPassword, setRequiresPassword] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;

    const loadPublicProfile = async () => {
      setIsLoading(true);
      setError("");

      const result = await loadProfileFromServer(id);

      if (result.success && result.profile) {
        setProfile(result.profile);
        setRequiresPassword(false);
        setIsLoading(false);
        return;
      }

      if (result.error === "Password required") {
        setRequiresPassword(true);
        setIsLoading(false);
        return;
      }

      setError(result.error || "Profil konnte nicht geladen werden.");
      setIsLoading(false);
    };

    loadPublicProfile();
  }, [id]);

  const handleUnlock = async () => {
    if (!id) return;

    setIsUnlocking(true);
    setError("");

    try {
      const result = await loadProfileFromServer(id, password);

      if (result.success && result.profile) {
        setProfile(result.profile);
        setRequiresPassword(false);
        return;
      }

      setError(result.error || "Profil konnte nicht geladen werden.");
    } finally {
      setIsUnlocking(false);
    }
  };

  if (isLoading) {
    return (
      <main className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center px-4">
        <div className="text-gray-500 dark:text-gray-400 animate-pulse">
          Laden...
        </div>
      </main>
    );
  }

  if (requiresPassword) {
    return (
      <main className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center px-4">
        <div className="w-full max-w-md rounded-3xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-8 shadow-xl">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 text-center">
            Geschütztes Profil
          </h1>

          <p className="text-gray-600 dark:text-gray-300 text-center mb-6">
            Dieses Profil ist passwortgeschützt. Bitte gib das Passwort ein, um es anzusehen.
          </p>

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Passwort eingeben"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
          />

          {error && (
            <p className="text-sm text-red-500 mb-4 text-center">{error}</p>
          )}

          <button
            onClick={handleUnlock}
            disabled={!password || isUnlocking}
            className="w-full px-4 py-3 rounded-xl bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 text-white font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {isUnlocking ? "Prüfe Passwort..." : "Profil öffnen"}
          </button>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center px-4">
        <div className="w-full max-w-md rounded-3xl border border-red-200 dark:border-red-900 bg-white dark:bg-gray-900 p-8 text-center shadow-xl">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
            Fehler
          </h1>
          <p className="text-red-500">{error}</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-950 px-4 py-10">
      <div className="max-w-5xl mx-auto flex justify-center">
        <ProfilePreview profile={profile} />
      </div>
    </main>
  );
}