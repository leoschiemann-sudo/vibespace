/**
 * Script to set the editor password in Sanity.
 * 
 * Usage:
 *   npx tsx scripts/set-editor-password.ts
 * 
 * Environment variables required (will auto-load from .env.local):
 *   - NEXT_PUBLIC_SANITY_PROJECT_ID
 *   - NEXT_PUBLIC_SANITY_DATASET
 *   - SANITY_TOKEN
 *   - EDITOR_INITIAL_PASSWORD
 */

import { config } from "dotenv";
import { join } from "path";
import { createClient } from "@sanity/client";
import { hash } from "@node-rs/argon2";

// Load environment from .env.local
config({ path: join(process.cwd(), ".env.local") });

const EDITOR_SETTINGS_ID = "editorSettings";

async function main() {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
  const token = process.env.SANITY_TOKEN;
  const password = process.env.EDITOR_INITIAL_PASSWORD;

  if (!projectId) {
    console.error("ERROR: NEXT_PUBLIC_SANITY_PROJECT_ID is not set.");
    console.error("Please check your .env.local file.");
    process.exit(1);
  }

  if (!token) {
    console.error("ERROR: SANITY_TOKEN is not set.");
    console.error("Please check your .env.local file.");
    process.exit(1);
  }

  if (!password) {
    console.error("ERROR: EDITOR_INITIAL_PASSWORD is not set.");
    console.error("Please check your .env.local file.");
    process.exit(1);
  }

  console.log("Hashing password with Argon2id...");
  const passwordHash = await hash(password, {
    memoryCost: 65536,
    timeCost: 3,
    parallelism: 4,
  });

  console.log("Creating Sanity client...");
  const client = createClient({
    projectId,
    dataset,
    token,
    apiVersion: "2024-01-01",
    useCdn: false,
  });

  console.log("Upserting editorSettings document...");
  const result = await client.createOrReplace({
    _id: EDITOR_SETTINGS_ID,
    _type: "editorSettings",
    passwordHash,
    updatedAt: new Date().toISOString(),
  });

  console.log(`Successfully set editor password. Document ID: ${result._id}`);
  console.log(`Updated at: ${result.updatedAt}`);
}

main().catch((error) => {
  console.error("Error setting editor password:", error);
  process.exit(1);
});
