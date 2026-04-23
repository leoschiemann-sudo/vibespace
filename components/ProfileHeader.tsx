"use client";

import { ProfileData } from "@/lib/types";

interface ProfileHeaderProps {
  profile: ProfileData;
}

export function ProfileHeader({ profile }: ProfileHeaderProps) {
  const hasAvatar = profile.avatarUrl && profile.avatarUrl.trim() !== "";
  
  return (
    <div className="flex flex-col items-center gap-3">
      {/* Avatar with gradient border */}
      <div className="relative">
        <div 
          className="w-24 h-24 rounded-full p-1"
          style={{
            background: "linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888, #833ab4, #fd5949, #fbad50)",
            backgroundSize: "400% 400%",
            animation: "gradient-rotate 3s ease infinite",
          }}
        >
          {hasAvatar ? (
            <img
              src={profile.avatarUrl}
              alt={profile.name || "Avatar"}
              className="w-full h-full rounded-full object-cover bg-white dark:bg-gray-800"
            />
          ) : (
            <div className="w-full h-full rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
              <span className="text-3xl text-gray-400 dark:text-gray-500">
                {profile.name ? profile.name[0].toUpperCase() : "?"}
              </span>
            </div>
          )}
        </div>
      </div>
      
      {/* Name */}
      <h1 className="text-xl font-bold text-gray-900 dark:text-white text-center">
        {profile.name || "Your Name"}
      </h1>
      
      {/* Bio */}
      <p className="text-sm text-gray-500 dark:text-gray-400 text-center max-w-xs px-4">
        {profile.bio || "Tell us about yourself..."}
      </p>
    </div>
  );
}