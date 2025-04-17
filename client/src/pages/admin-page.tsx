import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { apiRequest } from "@/lib/queryClient";

export default function AdminPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  // Check if already logged in
  useEffect(() => {
    async function checkAuthStatus() {
      try {
        const res = await apiRequest("GET", "/api/admin/me");
        if (res.ok) {
          setIsLoggedIn(true);
        }
      } catch (error) {
        // Not authenticated, that's fine
      }
    }
    
    checkAuthStatus();
  }, []);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const res = await apiRequest("POST", "/api/admin/login", { username, password });
      
      if (res.ok) {
        const data = await res.json();
        toast({
          title: "Login successful",
          description: `Welcome back, ${data.username}!`,
        });
        setIsLoggedIn(true);
      } else {
        const errorData = await res.json();
        toast({
          title: "Login failed",
          description: errorData.error || "Invalid username or password",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Login failed",
        description: "There was an error logging in. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function handleLogout() {
    try {
      const res = await apiRequest("POST", "/api/admin/logout");
      
      if (res.ok) {
        toast({
          title: "Logout successful",
          description: "You have been logged out.",
        });
        setIsLoggedIn(false);
      }
    } catch (error) {
      toast({
        title: "Logout failed",
        description: "There was an error logging out. Please try again.",
        variant: "destructive",
      });
    }
  }

  if (isLoggedIn) {
    return <AdminDashboard onLogout={handleLogout} />;
  }

  return (
    <div className="flex min-h-[calc(100vh-80px)] items-center justify-center p-4 bg-black bg-opacity-90">
      <Card className="w-full max-w-md border-orange-500">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-orange-500">Admin Login</CardTitle>
          <CardDescription>
            Enter your credentials to access the admin dashboard
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleLogin}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              type="submit" 
              className="w-full bg-orange-500 hover:bg-orange-600"
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}

interface AdminDashboardProps {
  onLogout: () => void;
}

function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState("settings");
  
  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-orange-500">Rennsz Admin Dashboard</h1>
        <Button onClick={onLogout} variant="destructive">Logout</Button>
      </div>
      
      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-64 space-y-2">
          <Button 
            variant={activeTab === "settings" ? "default" : "outline"}
            className={`w-full justify-start ${activeTab === "settings" ? "bg-orange-500 hover:bg-orange-600" : ""}`}
            onClick={() => setActiveTab("settings")}
          >
            Site Settings
          </Button>
          <Button 
            variant={activeTab === "social" ? "default" : "outline"}
            className={`w-full justify-start ${activeTab === "social" ? "bg-orange-500 hover:bg-orange-600" : ""}`}
            onClick={() => setActiveTab("social")}
          >
            Social Links
          </Button>
          <Button 
            variant={activeTab === "streams" ? "default" : "outline"}
            className={`w-full justify-start ${activeTab === "streams" ? "bg-orange-500 hover:bg-orange-600" : ""}`}
            onClick={() => setActiveTab("streams")}
          >
            Stream Channels
          </Button>
          <Button 
            variant={activeTab === "announcements" ? "default" : "outline"}
            className={`w-full justify-start ${activeTab === "announcements" ? "bg-orange-500 hover:bg-orange-600" : ""}`}
            onClick={() => setActiveTab("announcements")}
          >
            Announcements
          </Button>
          <Button 
            variant={activeTab === "content" ? "default" : "outline"}
            className={`w-full justify-start ${activeTab === "content" ? "bg-orange-500 hover:bg-orange-600" : ""}`}
            onClick={() => setActiveTab("content")}
          >
            Page Content
          </Button>
        </div>
        <div className="flex-1 border rounded-lg p-6">
          {activeTab === "settings" && <SiteSettingsPanel />}
          {activeTab === "social" && <SocialLinksPanel />}
          {activeTab === "streams" && <StreamChannelsPanel />}
          {activeTab === "announcements" && <AnnouncementsPanel />}
          {activeTab === "content" && <PageContentPanel />}
        </div>
      </div>
    </div>
  );
}

// Site Settings Panel
function SiteSettingsPanel() {
  const [settings, setSettings] = useState({
    primaryColor: "#f97316",
    secondaryColor: "#000000",
    borderRadius: "0.5rem",
    fontFamily: "'Inter', sans-serif"
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  
  useEffect(() => {
    async function loadSettings() {
      try {
        setIsLoading(true);
        const res = await apiRequest("GET", "/api/admin/site-settings");
        if (res.ok) {
          const data = await res.json();
          setSettings({
            primaryColor: data.primaryColor,
            secondaryColor: data.secondaryColor,
            borderRadius: data.borderRadius,
            fontFamily: data.fontFamily
          });
        }
      } catch (error) {
        toast({
          title: "Error loading settings",
          description: "Failed to load site settings",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    }
    
    loadSettings();
  }, [toast]);
  
  async function handleSaveSettings() {
    try {
      setIsSaving(true);
      const res = await apiRequest("POST", "/api/admin/site-settings", settings);
      
      if (res.ok) {
        toast({
          title: "Settings saved",
          description: "The site settings have been updated successfully."
        });
      } else {
        toast({
          title: "Error saving settings",
          description: "There was an error saving the site settings.",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error saving settings",
        description: "There was an error saving the site settings.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  }
  
  function handleChange(key: string, value: string) {
    setSettings({
      ...settings,
      [key]: value
    });
  }
  
  if (isLoading) {
    return <div className="flex justify-center items-center h-64">Loading settings...</div>;
  }
  
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Site Settings</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="primaryColor">Primary Color</Label>
          <div className="flex gap-2">
            <Input
              id="primaryColor"
              type="color"
              value={settings.primaryColor}
              onChange={(e) => handleChange("primaryColor", e.target.value)}
              className="w-16 h-10"
            />
            <Input
              type="text"
              value={settings.primaryColor}
              onChange={(e) => handleChange("primaryColor", e.target.value)}
              className="flex-1"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="secondaryColor">Secondary Color</Label>
          <div className="flex gap-2">
            <Input
              id="secondaryColor"
              type="color"
              value={settings.secondaryColor}
              onChange={(e) => handleChange("secondaryColor", e.target.value)}
              className="w-16 h-10"
            />
            <Input
              type="text"
              value={settings.secondaryColor}
              onChange={(e) => handleChange("secondaryColor", e.target.value)}
              className="flex-1"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="borderRadius">Border Radius</Label>
          <Input
            id="borderRadius"
            value={settings.borderRadius}
            onChange={(e) => handleChange("borderRadius", e.target.value)}
            placeholder="0.5rem"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="fontFamily">Font Family</Label>
          <Input
            id="fontFamily"
            value={settings.fontFamily}
            onChange={(e) => handleChange("fontFamily", e.target.value)}
            placeholder="'Inter', sans-serif"
          />
        </div>
      </div>
      
      <div className="pt-4">
        <Button 
          onClick={handleSaveSettings} 
          disabled={isSaving}
          className="bg-orange-500 hover:bg-orange-600"
        >
          {isSaving ? "Saving..." : "Save Settings"}
        </Button>
      </div>
      
      <div className="pt-6 border-t mt-8">
        <h3 className="text-lg font-semibold mb-4">Preview</h3>
        <div className="flex flex-wrap gap-4">
          <div 
            className="p-4 rounded shadow text-white" 
            style={{ 
              backgroundColor: settings.primaryColor,
              borderRadius: settings.borderRadius
            }}
          >
            Primary Color
          </div>
          <div 
            className="p-4 rounded shadow text-white" 
            style={{ 
              backgroundColor: settings.secondaryColor,
              borderRadius: settings.borderRadius
            }}
          >
            Secondary Color
          </div>
          <div 
            className="p-4 rounded shadow border" 
            style={{ 
              fontFamily: settings.fontFamily,
              borderRadius: settings.borderRadius
            }}
          >
            Font Preview
          </div>
        </div>
      </div>
    </div>
  );
}

function SocialLinksPanel() {
  const [socialLinks, setSocialLinks] = useState<Array<{
    id?: number;
    platform: string;
    name: string;
    url: string;
    icon: string;
    color: string;
    username: string;
    description: string;
    order: number;
  }>>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [editingLink, setEditingLink] = useState<number | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const { toast } = useToast();
  
  const [newLink, setNewLink] = useState({
    platform: "",
    name: "",
    url: "",
    icon: "",
    color: "#000000",
    username: "",
    description: "",
    order: 0
  });
  
  useEffect(() => {
    async function loadSocialLinks() {
      try {
        setIsLoading(true);
        const res = await apiRequest("GET", "/api/admin/social-links");
        if (res.ok) {
          const data = await res.json();
          setSocialLinks(data);
        }
      } catch (error) {
        toast({
          title: "Error loading social links",
          description: "Failed to load social links",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    }
    
    loadSocialLinks();
  }, [toast]);
  
  async function handleSaveSocialLink(link: typeof newLink, id?: number) {
    try {
      setIsSaving(true);
      
      let res;
      if (id) {
        // Update existing link
        res = await apiRequest("PUT", `/api/admin/social-links/${id}`, link);
      } else {
        // Create new link
        res = await apiRequest("POST", "/api/admin/social-links", link);
      }
      
      if (res.ok) {
        const updatedLink = await res.json();
        
        if (id) {
          // Update in the list
          setSocialLinks(links => 
            links.map(l => l.id === id ? updatedLink : l)
          );
          setEditingLink(null);
        } else {
          // Add to the list
          setSocialLinks(links => [...links, updatedLink]);
          setShowAddForm(false);
          setNewLink({
            platform: "",
            name: "",
            url: "",
            icon: "",
            color: "#000000",
            username: "",
            description: "",
            order: socialLinks.length + 1
          });
        }
        
        toast({
          title: id ? "Link updated" : "Link added",
          description: id ? "Social link updated successfully." : "New social link added successfully."
        });
      } else {
        toast({
          title: "Error saving link",
          description: "There was an error saving the social link.",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error saving link",
        description: "There was an error saving the social link.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  }
  
  async function handleDeleteSocialLink(id: number) {
    if (!confirm("Are you sure you want to delete this social link?")) {
      return;
    }
    
    try {
      const res = await apiRequest("DELETE", `/api/admin/social-links/${id}`);
      
      if (res.ok) {
        setSocialLinks(links => links.filter(l => l.id !== id));
        toast({
          title: "Link deleted",
          description: "Social link deleted successfully."
        });
      } else {
        toast({
          title: "Error deleting link",
          description: "There was an error deleting the social link.",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error deleting link",
        description: "There was an error deleting the social link.",
        variant: "destructive"
      });
    }
  }
  
  function handleChangeNewLink(key: string, value: string | number) {
    setNewLink({
      ...newLink,
      [key]: value
    });
  }
  
  function handleEditLink(id: number) {
    const linkToEdit = socialLinks.find(l => l.id === id);
    if (linkToEdit) {
      setEditingLink(id);
    }
  }
  
  function handleUpdateEditingLink(key: string, value: string | number) {
    setSocialLinks(links => 
      links.map(l => 
        l.id === editingLink 
          ? { ...l, [key]: value } 
          : l
      )
    );
  }
  
  if (isLoading) {
    return <div className="flex justify-center items-center h-64">Loading social links...</div>;
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Social Links</h2>
        <Button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-orange-500 hover:bg-orange-600"
        >
          {showAddForm ? "Cancel" : "Add New Link"}
        </Button>
      </div>
      
      {showAddForm && (
        <Card className="p-4 border-orange-500">
          <h3 className="text-lg font-semibold mb-4">Add New Social Link</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="platform">Platform</Label>
              <Input
                id="platform"
                value={newLink.platform}
                onChange={(e) => handleChangeNewLink("platform", e.target.value)}
                placeholder="twitch"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="name">Display Name</Label>
              <Input
                id="name"
                value={newLink.name}
                onChange={(e) => handleChangeNewLink("name", e.target.value)}
                placeholder="Twitch"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="url">URL</Label>
              <Input
                id="url"
                value={newLink.url}
                onChange={(e) => handleChangeNewLink("url", e.target.value)}
                placeholder="https://twitch.tv/username"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="icon">Icon</Label>
              <Input
                id="icon"
                value={newLink.icon}
                onChange={(e) => handleChangeNewLink("icon", e.target.value)}
                placeholder="SiTwitch"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="color">Color</Label>
              <div className="flex gap-2">
                <Input
                  id="color"
                  type="color"
                  value={newLink.color}
                  onChange={(e) => handleChangeNewLink("color", e.target.value)}
                  className="w-16 h-10"
                />
                <Input
                  type="text"
                  value={newLink.color}
                  onChange={(e) => handleChangeNewLink("color", e.target.value)}
                  className="flex-1"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={newLink.username}
                onChange={(e) => handleChangeNewLink("username", e.target.value)}
                placeholder="username"
              />
            </div>
            
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={newLink.description}
                onChange={(e) => handleChangeNewLink("description", e.target.value)}
                placeholder="My Twitch channel"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="order">Display Order</Label>
              <Input
                id="order"
                type="number"
                value={newLink.order}
                onChange={(e) => handleChangeNewLink("order", parseInt(e.target.value))}
              />
            </div>
          </div>
          
          <div className="mt-4 flex justify-end">
            <Button 
              onClick={() => handleSaveSocialLink(newLink)}
              disabled={isSaving}
              className="bg-orange-500 hover:bg-orange-600"
            >
              {isSaving ? "Saving..." : "Add Link"}
            </Button>
          </div>
        </Card>
      )}
      
      <div className="space-y-4">
        {socialLinks.length === 0 ? (
          <p className="text-center py-8 text-gray-500">No social links added yet.</p>
        ) : (
          socialLinks.sort((a, b) => a.order - b.order).map(link => (
            <Card key={link.id} className="p-4">
              {editingLink === link.id ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor={`edit-platform-${link.id}`}>Platform</Label>
                    <Input
                      id={`edit-platform-${link.id}`}
                      value={link.platform}
                      onChange={(e) => handleUpdateEditingLink("platform", e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor={`edit-name-${link.id}`}>Display Name</Label>
                    <Input
                      id={`edit-name-${link.id}`}
                      value={link.name}
                      onChange={(e) => handleUpdateEditingLink("name", e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor={`edit-url-${link.id}`}>URL</Label>
                    <Input
                      id={`edit-url-${link.id}`}
                      value={link.url}
                      onChange={(e) => handleUpdateEditingLink("url", e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor={`edit-icon-${link.id}`}>Icon</Label>
                    <Input
                      id={`edit-icon-${link.id}`}
                      value={link.icon}
                      onChange={(e) => handleUpdateEditingLink("icon", e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor={`edit-color-${link.id}`}>Color</Label>
                    <div className="flex gap-2">
                      <Input
                        id={`edit-color-${link.id}`}
                        type="color"
                        value={link.color}
                        onChange={(e) => handleUpdateEditingLink("color", e.target.value)}
                        className="w-16 h-10"
                      />
                      <Input
                        type="text"
                        value={link.color}
                        onChange={(e) => handleUpdateEditingLink("color", e.target.value)}
                        className="flex-1"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor={`edit-username-${link.id}`}>Username</Label>
                    <Input
                      id={`edit-username-${link.id}`}
                      value={link.username}
                      onChange={(e) => handleUpdateEditingLink("username", e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor={`edit-description-${link.id}`}>Description</Label>
                    <Input
                      id={`edit-description-${link.id}`}
                      value={link.description}
                      onChange={(e) => handleUpdateEditingLink("description", e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor={`edit-order-${link.id}`}>Display Order</Label>
                    <Input
                      id={`edit-order-${link.id}`}
                      type="number"
                      value={link.order}
                      onChange={(e) => handleUpdateEditingLink("order", parseInt(e.target.value))}
                    />
                  </div>
                  
                  <div className="md:col-span-2 flex justify-end gap-2">
                    <Button 
                      variant="outline" 
                      onClick={() => setEditingLink(null)}
                    >
                      Cancel
                    </Button>
                    <Button 
                      onClick={() => handleSaveSocialLink(link, link.id)}
                      disabled={isSaving}
                      className="bg-orange-500 hover:bg-orange-600"
                    >
                      {isSaving ? "Saving..." : "Save Changes"}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col md:flex-row md:items-center justify-between">
                  <div className="flex gap-4 items-center">
                    <div 
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white"
                      style={{ backgroundColor: link.color }}
                    >
                      {link.platform.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-semibold">{link.name}</h3>
                      <p className="text-sm text-gray-500">{link.url}</p>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4 md:mt-0">
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="border-orange-500 text-orange-500"
                      onClick={() => handleEditLink(link.id as number)}
                    >
                      Edit
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => handleDeleteSocialLink(link.id as number)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

function StreamChannelsPanel() {
  return <h2 className="text-2xl font-bold">Stream Channels</h2>;
}

function AnnouncementsPanel() {
  return <h2 className="text-2xl font-bold">Announcements</h2>;
}

function PageContentPanel() {
  return <h2 className="text-2xl font-bold">Page Content</h2>;
}