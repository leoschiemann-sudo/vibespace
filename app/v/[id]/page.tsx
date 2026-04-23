"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { decompressProfileData } from "@/lib/compression";
import { ProfileData } from "@/lib/types";
import { ProfileHeader } from "@/components/ProfileHeader";
import { MoodWidget } from "@/components/MoodWidget";
import { LinkItem } from "@/components/LinkItem";
import { SpotifyEmbed } from "@/components/SpotifyEmbed";
import { AlertCircle, Home } from "lucide-react";
import Link from "next/link";

export default function ProfilePage() {
  const params = useParams();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const id = params.id as string;
    
    if (!id) {
      setError(true);
      setLoading(false);
      return;
    }

    const decompressed = decompressProfileData(id);
    
    if (decompressed) {
      setProfile(decompressed);
    } else {
      setError(true);
    }
    
    setLoading(false);
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="animate-pulse text-gray-400 dark:text-gray-600">Laden...</div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-950 px-4">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center">
            <AlertCircle className="w-8 h-8 text-gray-400 dark:text-gray-500" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Profil nicht gefunden
            </h1>
            <p className="text-gray-500 dark:text-gray-400 max-w-xs">
              Dieser Link ist ungültig oder das Profil wurde gelöscht.
            </p>
          </div>
          <Link
            href="/"
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 text-white font-medium rounded-full hover:opacity-90 transition-opacity"
          >
            <Home className="w-4 h-4" />
            <span>Eigenes Profil erstellen</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-950/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-xl mx-auto px-4 py-3">
          <Link 
            href="/"
            className="text-lg font-bold bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 bg-clip-text text-transparent"
          >
            VibeSpace
          </Link>
        </div>
      </header>

      {/* Profile content */}
      <main className="max-w-sm mx-auto px-4 py-8 flex flex-col items-center gap-4">
        <ProfileHeader profile={profile} />
        
        <MoodWidget mood={profile.mood} />
        
        {profile.spotifyUrl && (
          <SpotifyEmbed spotifyUrl={profile.spotifyUrl} />
        )}
        
        {profile.links.length > 0 && (
          <div className="w-full mt-2 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800">
            {profile.links.map((link, index) => (
              <LinkItem
                key={index}
                title={link.title}
                url={link.url}
                isLast={index === profile.links.length - 1}
              />
            ))}
          </div>
        )}
        
        {/* Footer branding */}
        <div className="mt-8 pt-4 border-t border-gray-200 dark:border-gray-800 w-full text-center">
          <Link 
            href="/"
            className="text-xs text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            Erstellt mit VibeSpace
          </Link>
        </div>
      </main>
    </div>
  );
}