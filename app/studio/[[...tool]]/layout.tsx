import { Metadata } from "next";

export const metadata: Metadata = {
  title: "VibeSpace Studio",
  description: "Admin interface for VibeSpace profiles",
};

export default function StudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
