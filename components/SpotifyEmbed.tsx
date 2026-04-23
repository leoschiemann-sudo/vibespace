"use client";

interface SpotifyEmbedProps {
  spotifyUrl: string;
}

export function SpotifyEmbed({ spotifyUrl }: SpotifyEmbedProps) {
  if (!spotifyUrl || spotifyUrl.trim() === "") {
    return null;
  }

  // Convert spotify URL to embed URL
  let embedUrl = "";
  
  if (spotifyUrl.includes("open.spotify.com")) {
    // Handle various spotify URL formats
    const match = spotifyUrl.match(/open\.spotify\.com\/(embed\/)?(.+)/);
    if (match) {
      const path = match[2];
      embedUrl = `https://open.spotify.com/embed/${path.split('?')[0]}`;
    }
  } else if (spotifyUrl.includes("spotify.com")) {
    // Handle spotify.com links without open.
    const match = spotifyUrl.match(/spotify\.com\/(embed\/)?(.+)/);
    if (match) {
      const path = match[2];
      embedUrl = `https://open.spotify.com/embed/${path.split('?')[0]}`;
    }
  }

  if (!embedUrl) {
    return null;
  }

  return (
    <div className="w-full px-4 py-2">
      <iframe
        src={embedUrl}
        width="100%"
        height="80"
        frameBorder="0"
        allowTransparency
        allow="encrypted-media"
        className="rounded-lg"
        loading="lazy"
      />
    </div>
  );
}