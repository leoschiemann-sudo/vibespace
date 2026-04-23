import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "VibeSpace - Dein Link-in-Bio",
  description: "Erstelle deine persönliche Link-in-Bio Seite mit allen wichtigen Links an einem Ort.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de" className="h-full">
      <body className="h-full antialiased bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
