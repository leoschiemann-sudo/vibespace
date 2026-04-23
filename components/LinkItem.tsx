"use client";

import { ChevronRight } from "lucide-react";

interface LinkItemProps {
  title: string;
  url: string;
  isLast?: boolean;
}

export function LinkItem({ title, url, isLast = false }: LinkItemProps) {
  return (
    <>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-between px-4 py-3 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
      >
        <div className="flex flex-col">
          <span className="text-base font-medium text-gray-900 dark:text-white">
            {title || "Link"}
          </span>
          <span className="text-xs text-gray-400 dark:text-gray-500 truncate max-w-[200px]">
            {url || "#"}
          </span>
        </div>
        <ChevronRight className="w-5 h-5 text-gray-400 dark:text-gray-500 flex-shrink-0" />
      </a>
      {!isLast && (
        <div className="h-px bg-gray-200 dark:bg-gray-700 mx-4" />
      )}
    </>
  );
}