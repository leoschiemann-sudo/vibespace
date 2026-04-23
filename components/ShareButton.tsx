"use client";

import { useState } from "react";
import { Link2, Check, Copy } from "lucide-react";
import { ProfileData } from "@/lib/types";
import { compressProfileData } from "@/lib/compression";

interface ShareButtonProps {
  profile: ProfileData;
}

export function ShareButton({ profile }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleShare = async () => {
    try {
      const compressed = compressProfileData(profile);
      const shareUrl = `${window.location.origin}/v/${compressed}`;
      
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setError(null);
      
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      setError("Konnte nicht kopieren");
      setCopied(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-2 w-full max-w-md">
      <button
        onClick={handleShare}
        disabled={!profile.name}
        className={`
          flex items-center justify-center gap-2 w-full px-6 py-3 rounded-xl font-medium text-white transition-all
          ${profile.name 
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
      
      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}
      
      {!profile.name && (
        <p className="text-xs text-gray-400 dark:text-gray-500">
          Bitte gib zuerst einen Namen ein
        </p>
      )}
    </div>
  );
}