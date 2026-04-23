"use client";

import { ProfileData } from "@/lib/types";
import { ProfileHeader } from "./ProfileHeader";
import { MoodWidget } from "./MoodWidget";
import { LinkItem } from "./LinkItem";
import { SpotifyEmbed } from "./SpotifyEmbed";

interface ProfilePreviewProps {
  profile: ProfileData;
}

export function ProfilePreview({ profile }: ProfilePreviewProps) {
  return (
    <div className="w-full max-w-sm mx-auto">
      {/* Phone frame */}
      <div className="bg-gray-100 dark:bg-gray-900 rounded-[3rem] p-3 shadow-2xl">
        {/* Screen */}
        <div className="bg-white dark:bg-gray-950 rounded-[2.5rem] overflow-hidden min-h-[28rem]">
          {/* Status bar area (notch simulation) */}
          <div className="h-8 bg-white dark:bg-gray-950" />
          
          {/* Content */}
          <div className="px-4 pb-6 flex flex-col items-center gap-4">
            <ProfileHeader profile={profile} />
            
            <MoodWidget mood={profile.mood} />
            
            {profile.spotifyUrl && <SpotifyEmbed spotifyUrl={profile.spotifyUrl} />}
            
            {/* Links */}
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
            
            {/* Bottom safe area */}
            <div className="h-6" />
          </div>
        </div>
      </div>
    </div>
  );
}