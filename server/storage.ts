import { 
  users, type User, type InsertUser,
  siteSettings, type SiteSettings, type InsertSiteSettings,
  socialLinks, type SocialLink, type InsertSocialLink,
  streamChannels, type StreamChannel, type InsertStreamChannel,
  announcements, type Announcement, type InsertAnnouncement,
  pageContent, type PageContent, type InsertPageContent
} from "@shared/schema";
import { db } from "./db";
import { eq, asc, desc, and, isNull, gt, or } from "drizzle-orm";
import session from "express-session";
import { pool } from "./db";

// For session store
import pgSimple from 'connect-pg-simple';
const PostgresStore = pgSimple(session);

export interface IStorage {
  // User management
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Site settings
  getSiteSettings(): Promise<SiteSettings | undefined>;
  updateSiteSettings(settings: Partial<InsertSiteSettings>): Promise<SiteSettings>;
  
  // Social links
  getAllSocialLinks(): Promise<SocialLink[]>;
  getSocialLink(id: number): Promise<SocialLink | undefined>;
  createSocialLink(link: InsertSocialLink): Promise<SocialLink>;
  updateSocialLink(id: number, link: Partial<InsertSocialLink>): Promise<SocialLink | undefined>;
  deleteSocialLink(id: number): Promise<boolean>;
  
  // Stream channels
  getAllStreamChannels(): Promise<StreamChannel[]>;
  getStreamChannel(id: number): Promise<StreamChannel | undefined>;
  createStreamChannel(channel: InsertStreamChannel): Promise<StreamChannel>;
  updateStreamChannel(id: number, channel: Partial<InsertStreamChannel>): Promise<StreamChannel | undefined>;
  deleteStreamChannel(id: number): Promise<boolean>;
  
  // Announcements
  getActiveAnnouncements(): Promise<Announcement[]>;
  getAllAnnouncements(): Promise<Announcement[]>;
  getAnnouncement(id: number): Promise<Announcement | undefined>;
  createAnnouncement(announcement: InsertAnnouncement): Promise<Announcement>;
  updateAnnouncement(id: number, announcement: Partial<InsertAnnouncement>): Promise<Announcement | undefined>;
  deleteAnnouncement(id: number): Promise<boolean>;
  
  // Page content
  getPageContent(section: string): Promise<PageContent | undefined>;
  updatePageContent(section: string, content: any): Promise<PageContent>;
  
  // Session store
  sessionStore: any;
}

export class DatabaseStorage implements IStorage {
  sessionStore: any;
  
  constructor() {
    this.sessionStore = new PostgresStore({ 
      pool,
      createTableIfMissing: true
    });
  }

  // User management
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }
  
  // Site settings
  async getSiteSettings(): Promise<SiteSettings | undefined> {
    const [settings] = await db.select().from(siteSettings).limit(1);
    return settings;
  }
  
  async updateSiteSettings(settings: Partial<InsertSiteSettings>): Promise<SiteSettings> {
    // Check if settings exist
    const existingSettings = await this.getSiteSettings();
    
    if (existingSettings) {
      // Update existing settings
      const [updated] = await db
        .update(siteSettings)
        .set({ ...settings, updatedAt: new Date() })
        .where(eq(siteSettings.id, existingSettings.id))
        .returning();
      return updated;
    } else {
      // Create settings if they don't exist
      const [created] = await db
        .insert(siteSettings)
        .values({ 
          primaryColor: settings.primaryColor || "#f97316", 
          secondaryColor: settings.secondaryColor || "#000000",
          borderRadius: settings.borderRadius || "0.5rem",
          fontFamily: settings.fontFamily || "'Inter', sans-serif"
        })
        .returning();
      return created;
    }
  }
  
  // Social links
  async getAllSocialLinks(): Promise<SocialLink[]> {
    return db.select().from(socialLinks).orderBy(asc(socialLinks.order));
  }
  
  async getSocialLink(id: number): Promise<SocialLink | undefined> {
    const [link] = await db.select().from(socialLinks).where(eq(socialLinks.id, id));
    return link;
  }
  
  async createSocialLink(link: InsertSocialLink): Promise<SocialLink> {
    const [created] = await db.insert(socialLinks).values(link).returning();
    return created;
  }
  
  async updateSocialLink(id: number, link: Partial<InsertSocialLink>): Promise<SocialLink | undefined> {
    const [updated] = await db
      .update(socialLinks)
      .set(link)
      .where(eq(socialLinks.id, id))
      .returning();
    return updated;
  }
  
  async deleteSocialLink(id: number): Promise<boolean> {
    const result = await db.delete(socialLinks).where(eq(socialLinks.id, id));
    return true; // PostgreSQL with Drizzle doesn't always return count
  }
  
  // Stream channels
  async getAllStreamChannels(): Promise<StreamChannel[]> {
    return db.select().from(streamChannels).orderBy(asc(streamChannels.order));
  }
  
  async getStreamChannel(id: number): Promise<StreamChannel | undefined> {
    const [channel] = await db.select().from(streamChannels).where(eq(streamChannels.id, id));
    return channel;
  }
  
  async createStreamChannel(channel: InsertStreamChannel): Promise<StreamChannel> {
    const [created] = await db.insert(streamChannels).values(channel).returning();
    return created;
  }
  
  async updateStreamChannel(id: number, channel: Partial<InsertStreamChannel>): Promise<StreamChannel | undefined> {
    const [updated] = await db
      .update(streamChannels)
      .set(channel)
      .where(eq(streamChannels.id, id))
      .returning();
    return updated;
  }
  
  async deleteStreamChannel(id: number): Promise<boolean> {
    const result = await db.delete(streamChannels).where(eq(streamChannels.id, id));
    return true; // PostgreSQL with Drizzle doesn't always return count
  }
  
  // Announcements
  async getActiveAnnouncements(): Promise<Announcement[]> {
    const now = new Date();
    return db
      .select()
      .from(announcements)
      .where(
        and(
          eq(announcements.active, true),
          or(
            isNull(announcements.expiresAt),
            gt(announcements.expiresAt, now)
          )
        )
      )
      .orderBy(desc(announcements.createdAt));
  }
  
  async getAllAnnouncements(): Promise<Announcement[]> {
    return db.select().from(announcements).orderBy(desc(announcements.createdAt));
  }
  
  async getAnnouncement(id: number): Promise<Announcement | undefined> {
    const [announcement] = await db.select().from(announcements).where(eq(announcements.id, id));
    return announcement;
  }
  
  async createAnnouncement(announcement: InsertAnnouncement): Promise<Announcement> {
    const [created] = await db.insert(announcements).values(announcement).returning();
    return created;
  }
  
  async updateAnnouncement(id: number, announcement: Partial<InsertAnnouncement>): Promise<Announcement | undefined> {
    const [updated] = await db
      .update(announcements)
      .set(announcement)
      .where(eq(announcements.id, id))
      .returning();
    return updated;
  }
  
  async deleteAnnouncement(id: number): Promise<boolean> {
    const result = await db.delete(announcements).where(eq(announcements.id, id));
    return true; // PostgreSQL with Drizzle doesn't always return count
  }
  
  // Page content
  async getPageContent(section: string): Promise<PageContent | undefined> {
    const [content] = await db
      .select()
      .from(pageContent)
      .where(eq(pageContent.section, section));
    return content;
  }
  
  async updatePageContent(section: string, content: any): Promise<PageContent> {
    // Check if content exists for this section
    const existingContent = await this.getPageContent(section);
    
    if (existingContent) {
      // Update existing content
      const [updated] = await db
        .update(pageContent)
        .set({ 
          content, 
          updatedAt: new Date() 
        })
        .where(eq(pageContent.section, section))
        .returning();
      return updated;
    } else {
      // Create new content entry
      const [created] = await db
        .insert(pageContent)
        .values({
          section,
          content,
        })
        .returning();
      return created;
    }
  }
}

export const storage = new DatabaseStorage();
