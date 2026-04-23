"use client";

import { useMemo, useState } from "react";
import { Check, Copy } from "lucide-react";
import { ProfileData } from "@/lib/types";

interface ShareButtonProps {
  profile: ProfileData;
  profileId?: string | null;
}

export function ShareButton({ profile, profileId }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const shareUrl = useMemo(() => {
    if (!profileId || typeof window === "undefined") {
      return "";
    }

    return `${window.location.origin}/v/${profileId}`;
  }, [profileId]);

  const handleShare = async () => {
    if (!profileId || !shareUrl) {
      setError("Speichere das Profil zuerst");
      setCopied(false);
      return;
    }

    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setError(null);

      window.setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch {
      setError("Konnte nicht kopieren");
      setCopied(false);
    }
  };

  const isDisabled = !profile.name || !profileId;

  return (
    <div className="flex flex-col items-center gap-2 w-full max-w-md">
      <button
        onClick={handleShare}
        disabled={isDisabled}
        className={`
          flex items-center justify-center gap-2 w-full px-6 py-3 rounded-xl font-medium text-white transition-all
          ${
            !isDisabled
              ? "bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 hover:opacity-90 shadow-lg"
              : "bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed"
          }
        `}
      >
        {copied ? (
          <>
            <Check className="w-5 h-5" />
            <span>Kopiert!</span>
          </>
        ) : (
          <>
            <Copy className="w-5 h-5" />
            <span>Share Link kopieren</span>
          </>
        )}
      </button>

      {error && <p className="text-sm text-red-500">{error}</p>}

      {!profile.name && (
        <p className="text-xs text-gray-400 dark:text-gray-500">
          Bitte gib zuerst einen Namen ein
        </p>
      )}

      {profile.name && !profileId && (
        <p className="text-xs text-gray-400 dark:text-gray-500">
          Bitte speichere zuerst dein Profil
        </p>
      )}
    </div>
  );
}