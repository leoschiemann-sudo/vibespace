import { notFound } from "next/navigation";
import { sanityReadonlyClient } from "@/lib/sanity";
import { ProfilePreview } from "@/components/ProfilePreview";
import type { ProfileData } from "@/lib/types";
import type { SanityProfile } from "@/lib/schemas/profile";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

function sanityToProfileData(profile: SanityProfile): ProfileData {
  return {
    name: profile.name || "",
    bio: profile.bio || "",
    avatarUrl: profile.avatarUrl || "",
    mood: profile.mood || { emoji: "🎵", text: "Feeling good" },
    spotifyUrl: profile.spotifyUrl || "",
    links: profile.links?.map((l) => ({ title: l.title, url: l.url })) || [],
  };
}

export default async function PublicProfilePage({ params }: PageProps) {
  const { id } = await params;

  const profile = await sanityReadonlyClient.fetch<SanityProfile | null>(
    `*[_type == "profile" && _id == $id][0]`,
    { id }
  );

  if (!profile) {
    notFound();
  }

  if (profile.passwordHash) {
    return (
      <main className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center px-4">
        <div className="w-full max-w-md rounded-3xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-8 text-center shadow-xl">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
            Geschütztes Profil
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Dieses Profil ist passwortgeschützt und kann nur über den Editor geladen werden.
          </p>
        </div>
      </main>
    );
  }

  const data = sanityToProfileData(profile);

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-950 px-4 py-10">
      <div className="max-w-5xl mx-auto flex justify-center">
        <ProfilePreview profile={data} />
      </div>
    </main>
  );
}