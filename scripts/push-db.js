// Script to push our schema to the database
import { drizzle } from "drizzle-orm/neon-serverless";
import { Pool, neonConfig } from "@neondatabase/serverless";
import ws from "ws";

// Required for connecting to neon database
neonConfig.webSocketConstructor = ws;

async function main() {
  console.log("Starting database migration...");
  
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL environment variable is not set");
  }
  
  console.log("Connecting to database...");
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  
  console.log("Pushing schema to database...");
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      username TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      is_admin BOOLEAN NOT NULL DEFAULT FALSE,
      created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
    );
    
    CREATE TABLE IF NOT EXISTS site_settings (
      id SERIAL PRIMARY KEY,
      primary_color TEXT NOT NULL DEFAULT '#f97316',
      secondary_color TEXT NOT NULL DEFAULT '#000000',
      border_radius TEXT NOT NULL DEFAULT '0.5rem',
      font_family TEXT NOT NULL DEFAULT '''Inter'', sans-serif',
      updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
    );
    
    CREATE TABLE IF NOT EXISTS social_links (
      id SERIAL PRIMARY KEY,
      platform TEXT NOT NULL,
      name TEXT NOT NULL,
      url TEXT NOT NULL,
      icon TEXT NOT NULL,
      color TEXT NOT NULL,
      username TEXT NOT NULL,
      description TEXT NOT NULL,
      "order" INTEGER NOT NULL
    );
    
    CREATE TABLE IF NOT EXISTS stream_channels (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      type TEXT NOT NULL,
      description TEXT NOT NULL,
      platform TEXT NOT NULL,
      url TEXT NOT NULL,
      color TEXT NOT NULL,
      "order" INTEGER NOT NULL
    );
    
    CREATE TABLE IF NOT EXISTS announcements (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      active BOOLEAN NOT NULL DEFAULT TRUE,
      created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
      expires_at TIMESTAMP WITH TIME ZONE
    );
    
    CREATE TABLE IF NOT EXISTS page_content (
      id SERIAL PRIMARY KEY,
      section TEXT NOT NULL UNIQUE,
      content JSONB NOT NULL,
      updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
    );
  `);
  
  console.log("Database migration completed successfully!");
  
  await pool.end();
  process.exit(0);
}

main().catch((err) => {
  console.error("Error during migration:", err);
  process.exit(1);
});