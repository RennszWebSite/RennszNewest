import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { db } from "./db";
import { socialLinks, streamChannels, siteSettings, announcements, pageContent } from "@shared/schema";
import { eq } from "drizzle-orm";

// Admin auth middleware
const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  if (req.isAuthenticated() && req.user && req.user.isAdmin) {
    return next();
  }
  return res.status(401).json({ error: "Unauthorized" });
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication
  setupAuth(app);

  // Public API routes
  app.get('/api/social-links', async (_req, res) => {
    try {
      const links = await storage.getAllSocialLinks();
      if (links && links.length > 0) {
        res.json(links);
      } else {
        // If no links in the database, use the default ones from the frontend
        res.json({
          success: true,
          message: 'Social links served from the frontend'
        });
      }
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch social links" });
    }
  });

  app.get('/api/stream-channels', async (_req, res) => {
    try {
      const channels = await storage.getAllStreamChannels();
      if (channels && channels.length > 0) {
        res.json(channels);
      } else {
        // If no channels in the database, use the default ones from the frontend
        res.json({
          success: true,
          message: 'Stream channels served from the frontend'
        });
      }
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch stream channels" });
    }
  });

  app.get('/api/site-settings', async (_req, res) => {
    try {
      const settings = await storage.getSiteSettings();
      res.json(settings || {
        primaryColor: "#f97316", // Default orange
        secondaryColor: "#000000", // Default black
        borderRadius: "0.5rem",
        fontFamily: "'Inter', sans-serif"
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch site settings" });
    }
  });

  app.get('/api/announcements', async (_req, res) => {
    try {
      const activeAnnouncements = await storage.getActiveAnnouncements();
      res.json(activeAnnouncements);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch announcements" });
    }
  });

  app.get('/api/page-content/:section', async (req, res) => {
    try {
      const { section } = req.params;
      const content = await storage.getPageContent(section);
      
      if (content) {
        res.json(content.content);
      } else {
        res.json(null);
      }
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch page content" });
    }
  });

  // Admin API routes - all require authentication
  
  // Social Links Management
  app.get('/api/admin/social-links', isAuthenticated, async (_req, res) => {
    try {
      const links = await storage.getAllSocialLinks();
      res.json(links);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch social links" });
    }
  });

  app.post('/api/admin/social-links', isAuthenticated, async (req, res) => {
    try {
      const newLink = await storage.createSocialLink(req.body);
      res.status(201).json(newLink);
    } catch (error) {
      res.status(500).json({ error: "Failed to create social link" });
    }
  });

  app.put('/api/admin/social-links/:id', isAuthenticated, async (req, res) => {
    try {
      const { id } = req.params;
      const updatedLink = await storage.updateSocialLink(parseInt(id), req.body);
      if (!updatedLink) {
        return res.status(404).json({ error: "Social link not found" });
      }
      res.json(updatedLink);
    } catch (error) {
      res.status(500).json({ error: "Failed to update social link" });
    }
  });

  app.delete('/api/admin/social-links/:id', isAuthenticated, async (req, res) => {
    try {
      const { id } = req.params;
      const result = await storage.deleteSocialLink(parseInt(id));
      if (!result) {
        return res.status(404).json({ error: "Social link not found" });
      }
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete social link" });
    }
  });

  // Stream Channels Management
  app.get('/api/admin/stream-channels', isAuthenticated, async (_req, res) => {
    try {
      const channels = await storage.getAllStreamChannels();
      res.json(channels);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch stream channels" });
    }
  });

  app.post('/api/admin/stream-channels', isAuthenticated, async (req, res) => {
    try {
      const newChannel = await storage.createStreamChannel(req.body);
      res.status(201).json(newChannel);
    } catch (error) {
      res.status(500).json({ error: "Failed to create stream channel" });
    }
  });

  app.put('/api/admin/stream-channels/:id', isAuthenticated, async (req, res) => {
    try {
      const { id } = req.params;
      const updatedChannel = await storage.updateStreamChannel(parseInt(id), req.body);
      if (!updatedChannel) {
        return res.status(404).json({ error: "Stream channel not found" });
      }
      res.json(updatedChannel);
    } catch (error) {
      res.status(500).json({ error: "Failed to update stream channel" });
    }
  });

  app.delete('/api/admin/stream-channels/:id', isAuthenticated, async (req, res) => {
    try {
      const { id } = req.params;
      const result = await storage.deleteStreamChannel(parseInt(id));
      if (!result) {
        return res.status(404).json({ error: "Stream channel not found" });
      }
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete stream channel" });
    }
  });

  // Site Settings Management
  app.get('/api/admin/site-settings', isAuthenticated, async (_req, res) => {
    try {
      const settings = await storage.getSiteSettings();
      res.json(settings);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch site settings" });
    }
  });

  app.put('/api/admin/site-settings', isAuthenticated, async (req, res) => {
    try {
      const updatedSettings = await storage.updateSiteSettings(req.body);
      res.json(updatedSettings);
    } catch (error) {
      res.status(500).json({ error: "Failed to update site settings" });
    }
  });

  // Announcements Management
  app.get('/api/admin/announcements', isAuthenticated, async (_req, res) => {
    try {
      const allAnnouncements = await storage.getAllAnnouncements();
      res.json(allAnnouncements);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch announcements" });
    }
  });

  app.post('/api/admin/announcements', isAuthenticated, async (req, res) => {
    try {
      const newAnnouncement = await storage.createAnnouncement(req.body);
      res.status(201).json(newAnnouncement);
    } catch (error) {
      res.status(500).json({ error: "Failed to create announcement" });
    }
  });

  app.put('/api/admin/announcements/:id', isAuthenticated, async (req, res) => {
    try {
      const { id } = req.params;
      const updatedAnnouncement = await storage.updateAnnouncement(parseInt(id), req.body);
      if (!updatedAnnouncement) {
        return res.status(404).json({ error: "Announcement not found" });
      }
      res.json(updatedAnnouncement);
    } catch (error) {
      res.status(500).json({ error: "Failed to update announcement" });
    }
  });

  app.delete('/api/admin/announcements/:id', isAuthenticated, async (req, res) => {
    try {
      const { id } = req.params;
      const result = await storage.deleteAnnouncement(parseInt(id));
      if (!result) {
        return res.status(404).json({ error: "Announcement not found" });
      }
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete announcement" });
    }
  });

  // Page Content Management
  app.get('/api/admin/page-content/:section', isAuthenticated, async (req, res) => {
    try {
      const { section } = req.params;
      const content = await storage.getPageContent(section);
      res.json(content);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch page content" });
    }
  });

  app.put('/api/admin/page-content/:section', isAuthenticated, async (req, res) => {
    try {
      const { section } = req.params;
      const updatedContent = await storage.updatePageContent(section, req.body);
      res.json(updatedContent);
    } catch (error) {
      res.status(500).json({ error: "Failed to update page content" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
