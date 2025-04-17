import { 
  type User, type InsertUser,
  type SiteSettings, type InsertSiteSettings,
  type SocialLink, type InsertSocialLink,
  type StreamChannel, type InsertStreamChannel,
  type Announcement, type InsertAnnouncement,
  type PageContent, type InsertPageContent
} from "@shared/schema";
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
  updateUserPassword(id: number, password: string): Promise<User | undefined>;
  
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

import { type SocialLink, type StreamChannel, type SiteSettings, type Announcement, type PageContent } from "@shared/schema";

class InMemoryStorage implements IStorage {
  private socialLinks: SocialLink[] = [];
  private streamChannels: StreamChannel[] = [];
  private siteSettings: SiteSettings | null = null;
  private announcements: Announcement[] = [];
  private pageContents: Map<string, PageContent> = new Map();
  private nextId = 1;
  sessionStore: any;

  constructor() {
    this.sessionStore = new PostgresStore({ 
      pool,
      createTableIfMissing: true
    });
  }

  // Social Links
  async getAllSocialLinks(): Promise<SocialLink[]> {
    return this.socialLinks;
  }

  async getSocialLink(id: number): Promise<SocialLink | undefined> {
    return this.socialLinks.find(l => l.id === id);
  }

  async createSocialLink(link: Omit<SocialLink, "id">): Promise<SocialLink> {
    const newLink = { ...link, id: this.nextId++ };
    this.socialLinks.push(newLink);
    return newLink;
  }

  async updateSocialLink(id: number, link: Partial<SocialLink>): Promise<SocialLink | undefined> {
    const index = this.socialLinks.findIndex(l => l.id === id);
    if (index === -1) return undefined;
    this.socialLinks[index] = { ...this.socialLinks[index], ...link };
    return this.socialLinks[index];
  }

  async deleteSocialLink(id: number): Promise<boolean> {
    const index = this.socialLinks.findIndex(l => l.id === id);
    if (index === -1) return false;
    this.socialLinks.splice(index, 1);
    return true;
  }

  // Stream Channels
  async getAllStreamChannels(): Promise<StreamChannel[]> {
    return this.streamChannels;
  }

  async getStreamChannel(id: number): Promise<StreamChannel | undefined> {
    return this.streamChannels.find(c => c.id === id);
  }

  async createStreamChannel(channel: Omit<StreamChannel, "id">): Promise<StreamChannel> {
    const newChannel = { ...channel, id: this.nextId++ };
    this.streamChannels.push(newChannel);
    return newChannel;
  }

  async updateStreamChannel(id: number, channel: Partial<StreamChannel>): Promise<StreamChannel | undefined> {
    const index = this.streamChannels.findIndex(c => c.id === id);
    if (index === -1) return undefined;
    this.streamChannels[index] = { ...this.streamChannels[index], ...channel };
    return this.streamChannels[index];
  }

  async deleteStreamChannel(id: number): Promise<boolean> {
    const index = this.streamChannels.findIndex(c => c.id === id);
    if (index === -1) return false;
    this.streamChannels.splice(index, 1);
    return true;
  }

  // Site Settings
  async getSiteSettings(): Promise<SiteSettings | null> {
    return this.siteSettings || {
      id: 1,
      primaryColor: "#f97316",
      secondaryColor: "#000000",
      borderRadius: "0.5rem",
      fontFamily: "'Inter', sans-serif",
      updatedAt: new Date()
    };
  }

  async updateSiteSettings(settings: Partial<SiteSettings>): Promise<SiteSettings> {
    const currentSettings = await this.getSiteSettings();
    this.siteSettings = { ...currentSettings!, ...settings, updatedAt: new Date() };
    return this.siteSettings;
  }

  // Announcements
  async getActiveAnnouncements(): Promise<Announcement[]> {
    return this.announcements.filter(a => a.active && (!a.expiresAt || a.expiresAt > new Date()));
  }

  async getAllAnnouncements(): Promise<Announcement[]> {
    return this.announcements;
  }

  async getAnnouncement(id: number): Promise<Announcement | undefined> {
    return this.announcements.find(a => a.id === id);
  }


  async createAnnouncement(announcement: Omit<Announcement, "id" | "createdAt">): Promise<Announcement> {
    const newAnnouncement = { 
      ...announcement, 
      id: this.nextId++,
      createdAt: new Date()
    };
    this.announcements.push(newAnnouncement);
    return newAnnouncement;
  }

  async updateAnnouncement(id: number, announcement: Partial<Announcement>): Promise<Announcement | undefined> {
    const index = this.announcements.findIndex(a => a.id === id);
    if (index === -1) return undefined;
    this.announcements[index] = { ...this.announcements[index], ...announcement };
    return this.announcements[index];
  }

  async deleteAnnouncement(id: number): Promise<boolean> {
    const index = this.announcements.findIndex(a => a.id === id);
    if (index === -1) return false;
    this.announcements.splice(index, 1);
    return true;
  }

  // Page Content
  async getPageContent(section: string): Promise<PageContent | undefined> {
    return this.pageContents.get(section);
  }

  async updatePageContent(section: string, content: any): Promise<PageContent> {
    const pageContent = {
      id: this.nextId++,
      section,
      content,
      updatedAt: new Date()
    };
    this.pageContents.set(section, pageContent);
    return pageContent;
  }

  //Dummy User Methods -  These need proper implementation based on the User schema
  async getUser(id: number): Promise<User | undefined> { return undefined; }
  async getUserByUsername(username: string): Promise<User | undefined> { return undefined; }
  async createUser(user: InsertUser): Promise<User> { return user as User; }
  async updateUserPassword(id: number, password: string): Promise<User | undefined> { return undefined; }

}

export const storage = new InMemoryStorage();