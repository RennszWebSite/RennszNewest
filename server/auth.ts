import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Express } from "express";
import session from "express-session";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
import { storage } from "./storage";
import { User } from "@shared/schema";
import { log } from "./vite";

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

async function comparePasswords(supplied: string, stored: string) {
  const [hashed, salt] = stored.split(".");
  const hashedBuf = Buffer.from(hashed, "hex");
  const suppliedBuf = (await scryptAsync(supplied, salt, 64)) as Buffer;
  return timingSafeEqual(hashedBuf, suppliedBuf);
}

export function setupAuth(app: Express) {
  const sessionSettings: session.SessionOptions = {
    secret: process.env.SESSION_SECRET || 'rennsz-landing-page-secret',
    resave: false,
    saveUninitialized: false,
    store: storage.sessionStore || undefined,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
      secure: process.env.NODE_ENV === 'production',
    }
  };

  app.set("trust proxy", 1);
  app.use(session(sessionSettings));
  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        const user = await storage.getUserByUsername(username);
        if (!user) {
          return done(null, false, { message: "Invalid username or password" });
        }
        const isValidPassword = await comparePasswords(password, user.password);
        if (!isValidPassword) {
          return done(null, false, { message: "Invalid username or password" });
        }
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }),
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user);
    } catch (err) {
      done(err);
    }
  });

  // Auth Routes
  app.post("/api/admin/login", passport.authenticate("local"), (req, res) => {
    const user = req.user as Express.User;
    if (!user.isAdmin) {
      req.logout((err) => {
        if (err) {
          log("Error logging out non-admin user", "auth");
        }
      });
      return res.status(403).json({ error: "Not authorized" });
    }
    res.json({ id: user.id, username: user.username, isAdmin: user.isAdmin });
  });

  app.post("/api/admin/logout", (req, res, next) => {
    req.logout((err) => {
      if (err) return next(err);
      res.sendStatus(200);
    });
  });

  app.get("/api/admin/me", (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    
    const user = req.user as Express.User;
    if (!user.isAdmin) {
      return res.status(403).json({ error: "Not authorized" });
    }
    
    res.json({ id: user.id, username: user.username, isAdmin: user.isAdmin });
  });
  
  // Change password endpoint
  app.post("/api/admin/change-password", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    
    const user = req.user as Express.User;
    if (!user.isAdmin) {
      return res.status(403).json({ error: "Not authorized" });
    }
    
    const { currentPassword, newPassword } = req.body;
    
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: "Current password and new password are required" });
    }
    
    try {
      // Verify current password
      const isValidPassword = await comparePasswords(currentPassword, user.password);
      if (!isValidPassword) {
        return res.status(400).json({ error: "Current password is incorrect" });
      }
      
      // Hash the new password
      const hashedPassword = await hashPassword(newPassword);
      
      // Update the user password
      const updatedUser = await storage.updateUserPassword(user.id, hashedPassword);
      
      if (!updatedUser) {
        return res.status(500).json({ error: "Failed to update password" });
      }
      
      // Return success
      res.json({ success: true, message: "Password updated successfully" });
    } catch (error) {
      console.error("Password change error:", error);
      res.status(500).json({ error: "Failed to update password" });
    }
  });

  // Create admin user if it doesn't exist
  createAdminUserIfNeeded();
}

// Create admin user on startup if it doesn't exist
async function createAdminUserIfNeeded() {
  try {
    const adminUser = await storage.getUserByUsername("admin");
    if (!adminUser) {
      log("Creating admin user", "auth");
      await storage.createUser({
        username: "admin",
        password: await hashPassword("admin"),
        isAdmin: true
      });
      log("Admin user created successfully", "auth");
    }
  } catch (error) {
    log(`Error creating admin user: ${error}`, "auth");
  }
}