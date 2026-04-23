"use client";

import { ProfileMood } from "@/lib/types";

interface MoodWidgetProps {
  mood: ProfileMood;
}

export function MoodWidget({ mood }: MoodWidgetProps) {
  const hasMood = mood.emoji && mood.text;
  
  return (
    <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-full">
      <span className="text-lg">{mood.emoji || "🎵"}</span>
      <span className="text-sm text-gray-700 dark:text-gray-300">
        {mood.text || "Feeling good"}
      </span>
    </div>
  );
}