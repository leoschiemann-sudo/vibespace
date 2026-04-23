import { createClient } from "@sanity/client";

const projectId = process.env.SANITY_PROJECT_ID;
const dataset = process.env.SANITY_DATASET || "production";
const token = process.env.SANITY_TOKEN;

// Server-side client with write access
export const sanityClient = createClient({
  projectId,
  dataset,
  token,
  apiVersion: "2024-01-01",
  useCdn: false, // Always use fresh data for writes
});

// Client-side client (read-only, uses CDN)
export const sanityClientReadonly = createClient({
  projectId,
  dataset,
  apiVersion: "2024-01-01",
  useCdn: true, // Use CDN for faster reads
});

// Check if Sanity is configured
export const isSanityConfigured = () => {
  return !!(projectId && token);
};
