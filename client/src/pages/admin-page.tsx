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
          <Button 
            variant={activeTab === "profile" ? "default" : "outline"}
            className={`w-full justify-start ${activeTab === "profile" ? "bg-orange-500 hover:bg-orange-600" : ""}`}
            onClick={() => setActiveTab("profile")}
          >
            Admin Profile
          </Button>
        </div>
        <div className="flex-1 border rounded-lg p-6">
          {activeTab === "settings" && <SiteSettingsPanel />}
          {activeTab === "social" && <SocialLinksPanel />}
          {activeTab === "streams" && <StreamChannelsPanel />}
          {activeTab === "announcements" && <AnnouncementsPanel />}
          {activeTab === "content" && <PageContentPanel />}
          {activeTab === "profile" && <ProfilePanel />}
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
  const [streamChannels, setStreamChannels] = useState<Array<{
    id?: number;
    name: string;
    type: 'primary' | 'secondary';
    description: string;
    platform: string;
    url: string;
    color: string;
    order: number;
  }>>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [editingChannel, setEditingChannel] = useState<number | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const { toast } = useToast();
  
  const [newChannel, setNewChannel] = useState({
    name: "",
    type: "primary" as 'primary' | 'secondary',
    description: "",
    platform: "",
    url: "",
    color: "#9146FF",
    order: 0
  });
  
  useEffect(() => {
    async function loadStreamChannels() {
      try {
        setIsLoading(true);
        const res = await apiRequest("GET", "/api/admin/stream-channels");
        if (res.ok) {
          const data = await res.json();
          setStreamChannels(data);
        }
      } catch (error) {
        toast({
          title: "Error loading stream channels",
          description: "Failed to load stream channels",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    }
    
    loadStreamChannels();
  }, [toast]);
  
  async function handleSaveStreamChannel(channel: typeof newChannel, id?: number) {
    try {
      setIsSaving(true);
      
      let res;
      if (id) {
        // Update existing channel
        res = await apiRequest("PUT", `/api/admin/stream-channels/${id}`, channel);
      } else {
        // Create new channel
        res = await apiRequest("POST", "/api/admin/stream-channels", channel);
      }
      
      if (res.ok) {
        const updatedChannel = await res.json();
        
        if (id) {
          // Update in the list
          setStreamChannels(channels => 
            channels.map(c => c.id === id ? updatedChannel : c)
          );
          setEditingChannel(null);
        } else {
          // Add to the list
          setStreamChannels(channels => [...channels, updatedChannel]);
          setShowAddForm(false);
          setNewChannel({
            name: "",
            type: "primary",
            description: "",
            platform: "",
            url: "",
            color: "#9146FF",
            order: streamChannels.length + 1
          });
        }
        
        toast({
          title: id ? "Channel updated" : "Channel added",
          description: id ? "Stream channel updated successfully." : "New stream channel added successfully."
        });
      } else {
        toast({
          title: "Error saving channel",
          description: "There was an error saving the stream channel.",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error saving channel",
        description: "There was an error saving the stream channel.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  }
  
  async function handleDeleteStreamChannel(id: number) {
    if (!confirm("Are you sure you want to delete this stream channel?")) {
      return;
    }
    
    try {
      const res = await apiRequest("DELETE", `/api/admin/stream-channels/${id}`);
      
      if (res.ok) {
        setStreamChannels(channels => channels.filter(c => c.id !== id));
        toast({
          title: "Channel deleted",
          description: "Stream channel deleted successfully."
        });
      } else {
        toast({
          title: "Error deleting channel",
          description: "There was an error deleting the stream channel.",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error deleting channel",
        description: "There was an error deleting the stream channel.",
        variant: "destructive"
      });
    }
  }
  
  function handleChangeNewChannel(key: string, value: string | number) {
    setNewChannel({
      ...newChannel,
      [key]: value
    });
  }
  
  function handleEditChannel(id: number) {
    const channelToEdit = streamChannels.find(c => c.id === id);
    if (channelToEdit) {
      setEditingChannel(id);
    }
  }
  
  function handleUpdateEditingChannel(key: string, value: string | number) {
    setStreamChannels(channels => 
      channels.map(c => 
        c.id === editingChannel 
          ? { ...c, [key]: value } 
          : c
      )
    );
  }
  
  if (isLoading) {
    return <div className="flex justify-center items-center h-64">Loading stream channels...</div>;
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Stream Channels</h2>
        <Button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-orange-500 hover:bg-orange-600"
        >
          {showAddForm ? "Cancel" : "Add New Channel"}
        </Button>
      </div>
      
      {showAddForm && (
        <Card className="p-4 border-orange-500">
          <h3 className="text-lg font-semibold mb-4">Add New Stream Channel</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Channel Name</Label>
              <Input
                id="name"
                value={newChannel.name}
                onChange={(e) => handleChangeNewChannel("name", e.target.value)}
                placeholder="Main Stream"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="type">Channel Type</Label>
              <select 
                id="type"
                className="w-full px-3 py-2 border rounded-md"
                value={newChannel.type}
                onChange={(e) => handleChangeNewChannel("type", e.target.value)}
              >
                <option value="primary">Primary</option>
                <option value="secondary">Secondary</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="platform">Platform</Label>
              <Input
                id="platform"
                value={newChannel.platform}
                onChange={(e) => handleChangeNewChannel("platform", e.target.value)}
                placeholder="Twitch"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="url">URL</Label>
              <Input
                id="url"
                value={newChannel.url}
                onChange={(e) => handleChangeNewChannel("url", e.target.value)}
                placeholder="https://twitch.tv/channelname"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="color">Color</Label>
              <div className="flex gap-2">
                <Input
                  id="color"
                  type="color"
                  value={newChannel.color}
                  onChange={(e) => handleChangeNewChannel("color", e.target.value)}
                  className="w-16 h-10"
                />
                <Input
                  type="text"
                  value={newChannel.color}
                  onChange={(e) => handleChangeNewChannel("color", e.target.value)}
                  className="flex-1"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="order">Display Order</Label>
              <Input
                id="order"
                type="number"
                value={newChannel.order}
                onChange={(e) => handleChangeNewChannel("order", parseInt(e.target.value))}
              />
            </div>
            
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={newChannel.description}
                onChange={(e) => handleChangeNewChannel("description", e.target.value)}
                placeholder="Main IRL streaming channel"
              />
            </div>
          </div>
          
          <div className="mt-4 flex justify-end">
            <Button 
              onClick={() => handleSaveStreamChannel(newChannel)}
              disabled={isSaving}
              className="bg-orange-500 hover:bg-orange-600"
            >
              {isSaving ? "Saving..." : "Add Channel"}
            </Button>
          </div>
        </Card>
      )}
      
      <div className="space-y-4">
        {streamChannels.length === 0 ? (
          <p className="text-center py-8 text-gray-500">No stream channels added yet.</p>
        ) : (
          streamChannels.sort((a, b) => a.order - b.order).map(channel => (
            <Card key={channel.id} className="p-4">
              {editingChannel === channel.id ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor={`edit-name-${channel.id}`}>Channel Name</Label>
                    <Input
                      id={`edit-name-${channel.id}`}
                      value={channel.name}
                      onChange={(e) => handleUpdateEditingChannel("name", e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor={`edit-type-${channel.id}`}>Channel Type</Label>
                    <select 
                      id={`edit-type-${channel.id}`}
                      className="w-full px-3 py-2 border rounded-md"
                      value={channel.type}
                      onChange={(e) => handleUpdateEditingChannel("type", e.target.value)}
                    >
                      <option value="primary">Primary</option>
                      <option value="secondary">Secondary</option>
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor={`edit-platform-${channel.id}`}>Platform</Label>
                    <Input
                      id={`edit-platform-${channel.id}`}
                      value={channel.platform}
                      onChange={(e) => handleUpdateEditingChannel("platform", e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor={`edit-url-${channel.id}`}>URL</Label>
                    <Input
                      id={`edit-url-${channel.id}`}
                      value={channel.url}
                      onChange={(e) => handleUpdateEditingChannel("url", e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor={`edit-color-${channel.id}`}>Color</Label>
                    <div className="flex gap-2">
                      <Input
                        id={`edit-color-${channel.id}`}
                        type="color"
                        value={channel.color}
                        onChange={(e) => handleUpdateEditingChannel("color", e.target.value)}
                        className="w-16 h-10"
                      />
                      <Input
                        type="text"
                        value={channel.color}
                        onChange={(e) => handleUpdateEditingChannel("color", e.target.value)}
                        className="flex-1"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor={`edit-order-${channel.id}`}>Display Order</Label>
                    <Input
                      id={`edit-order-${channel.id}`}
                      type="number"
                      value={channel.order}
                      onChange={(e) => handleUpdateEditingChannel("order", parseInt(e.target.value))}
                    />
                  </div>
                  
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor={`edit-description-${channel.id}`}>Description</Label>
                    <Input
                      id={`edit-description-${channel.id}`}
                      value={channel.description}
                      onChange={(e) => handleUpdateEditingChannel("description", e.target.value)}
                    />
                  </div>
                  
                  <div className="md:col-span-2 flex justify-end gap-2">
                    <Button 
                      variant="outline" 
                      onClick={() => setEditingChannel(null)}
                    >
                      Cancel
                    </Button>
                    <Button 
                      onClick={() => handleSaveStreamChannel(channel, channel.id)}
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
                      style={{ backgroundColor: channel.color }}
                    >
                      {channel.platform.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{channel.name}</h3>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          channel.type === 'primary' 
                            ? 'bg-orange-100 text-orange-800' 
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {channel.type === 'primary' ? 'Primary' : 'Secondary'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500">{channel.url}</p>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4 md:mt-0">
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="border-orange-500 text-orange-500"
                      onClick={() => handleEditChannel(channel.id as number)}
                    >
                      Edit
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => handleDeleteStreamChannel(channel.id as number)}
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

function AnnouncementsPanel() {
  const [announcements, setAnnouncements] = useState<Array<{
    id?: number;
    title: string;
    content: string;
    active: boolean;
    createdAt?: string;
    expiresAt?: string | null;
  }>>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState<number | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const { toast } = useToast();
  
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: "",
    content: "",
    active: true,
    expiresAt: ""
  });
  
  useEffect(() => {
    async function loadAnnouncements() {
      try {
        setIsLoading(true);
        const res = await apiRequest("GET", "/api/admin/announcements");
        if (res.ok) {
          const data = await res.json();
          setAnnouncements(data);
        }
      } catch (error) {
        toast({
          title: "Error loading announcements",
          description: "Failed to load announcements",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    }
    
    loadAnnouncements();
  }, [toast]);
  
  async function handleSaveAnnouncement(announcement: any, id?: number) {
    try {
      setIsSaving(true);
      
      const formattedAnnouncement = {
        ...announcement,
        expiresAt: announcement.expiresAt ? new Date(announcement.expiresAt).toISOString() : null
      };
      
      let res;
      if (id) {
        // Update existing announcement
        res = await apiRequest("PUT", `/api/admin/announcements/${id}`, formattedAnnouncement);
      } else {
        // Create new announcement
        res = await apiRequest("POST", "/api/admin/announcements", formattedAnnouncement);
      }
      
      if (res.ok) {
        const updatedAnnouncement = await res.json();
        
        if (id) {
          // Update in the list
          setAnnouncements(items => 
            items.map(a => a.id === id ? updatedAnnouncement : a)
          );
          setEditingAnnouncement(null);
        } else {
          // Add to the list
          setAnnouncements(items => [...items, updatedAnnouncement]);
          setShowAddForm(false);
          setNewAnnouncement({
            title: "",
            content: "",
            active: true,
            expiresAt: ""
          });
        }
        
        toast({
          title: id ? "Announcement updated" : "Announcement added",
          description: id ? "Announcement updated successfully." : "New announcement added successfully."
        });
      } else {
        toast({
          title: "Error saving announcement",
          description: "There was an error saving the announcement.",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error saving announcement",
        description: "There was an error saving the announcement.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  }
  
  async function handleDeleteAnnouncement(id: number) {
    if (!confirm("Are you sure you want to delete this announcement?")) {
      return;
    }
    
    try {
      const res = await apiRequest("DELETE", `/api/admin/announcements/${id}`);
      
      if (res.ok) {
        setAnnouncements(items => items.filter(a => a.id !== id));
        toast({
          title: "Announcement deleted",
          description: "Announcement deleted successfully."
        });
      } else {
        toast({
          title: "Error deleting announcement",
          description: "There was an error deleting the announcement.",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error deleting announcement",
        description: "There was an error deleting the announcement.",
        variant: "destructive"
      });
    }
  }
  
  function handleChangeNewAnnouncement(key: string, value: string | boolean) {
    setNewAnnouncement({
      ...newAnnouncement,
      [key]: value
    });
  }
  
  function handleEditAnnouncement(id: number) {
    const announcementToEdit = announcements.find(a => a.id === id);
    if (announcementToEdit) {
      // Format the dates for the form
      const formattedAnnouncement = {
        ...announcementToEdit,
        expiresAt: announcementToEdit.expiresAt 
          ? new Date(announcementToEdit.expiresAt).toISOString().slice(0, 16) 
          : ""
      };
      
      setAnnouncements(items => 
        items.map(a => a.id === id ? formattedAnnouncement : a)
      );
      setEditingAnnouncement(id);
    }
  }
  
  function handleUpdateEditingAnnouncement(key: string, value: string | boolean) {
    setAnnouncements(items => 
      items.map(a => 
        a.id === editingAnnouncement 
          ? { ...a, [key]: value } 
          : a
      )
    );
  }
  
  function formatDate(dateString: string | undefined | null) {
    if (!dateString) return "Never";
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
  
  if (isLoading) {
    return <div className="flex justify-center items-center h-64">Loading announcements...</div>;
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Announcements</h2>
        <Button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-orange-500 hover:bg-orange-600"
        >
          {showAddForm ? "Cancel" : "Add New Announcement"}
        </Button>
      </div>
      
      {showAddForm && (
        <Card className="p-4 border-orange-500">
          <h3 className="text-lg font-semibold mb-4">Add New Announcement</h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={newAnnouncement.title}
                onChange={(e) => handleChangeNewAnnouncement("title", e.target.value)}
                placeholder="Announcement Title"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="content">Content</Label>
              <textarea
                id="content"
                className="w-full p-2 border rounded-md min-h-[100px]"
                value={newAnnouncement.content}
                onChange={(e) => handleChangeNewAnnouncement("content", e.target.value)}
                placeholder="Announcement content..."
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="expiresAt">Expiration Date (Optional)</Label>
                <Input
                  id="expiresAt"
                  type="datetime-local"
                  value={newAnnouncement.expiresAt}
                  onChange={(e) => handleChangeNewAnnouncement("expiresAt", e.target.value)}
                />
              </div>
              
              <div className="flex items-center space-x-2 mt-8">
                <input
                  id="active"
                  type="checkbox"
                  className="h-4 w-4"
                  checked={newAnnouncement.active}
                  onChange={(e) => handleChangeNewAnnouncement("active", e.target.checked)}
                />
                <Label htmlFor="active">Active announcement</Label>
              </div>
            </div>
          </div>
          
          <div className="mt-4 flex justify-end">
            <Button 
              onClick={() => handleSaveAnnouncement(newAnnouncement)}
              disabled={isSaving}
              className="bg-orange-500 hover:bg-orange-600"
            >
              {isSaving ? "Saving..." : "Add Announcement"}
            </Button>
          </div>
        </Card>
      )}
      
      <div className="space-y-4">
        {announcements.length === 0 ? (
          <p className="text-center py-8 text-gray-500">No announcements added yet.</p>
        ) : (
          announcements.map(announcement => (
            <Card key={announcement.id} className="p-4">
              {editingAnnouncement === announcement.id ? (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor={`edit-title-${announcement.id}`}>Title</Label>
                    <Input
                      id={`edit-title-${announcement.id}`}
                      value={announcement.title}
                      onChange={(e) => handleUpdateEditingAnnouncement("title", e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor={`edit-content-${announcement.id}`}>Content</Label>
                    <textarea
                      id={`edit-content-${announcement.id}`}
                      className="w-full p-2 border rounded-md min-h-[100px]"
                      value={announcement.content}
                      onChange={(e) => handleUpdateEditingAnnouncement("content", e.target.value)}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor={`edit-expiresAt-${announcement.id}`}>Expiration Date (Optional)</Label>
                      <Input
                        id={`edit-expiresAt-${announcement.id}`}
                        type="datetime-local"
                        value={announcement.expiresAt || ""}
                        onChange={(e) => handleUpdateEditingAnnouncement("expiresAt", e.target.value)}
                      />
                    </div>
                    
                    <div className="flex items-center space-x-2 mt-8">
                      <input
                        id={`edit-active-${announcement.id}`}
                        type="checkbox"
                        className="h-4 w-4"
                        checked={announcement.active}
                        onChange={(e) => handleUpdateEditingAnnouncement("active", e.target.checked)}
                      />
                      <Label htmlFor={`edit-active-${announcement.id}`}>Active announcement</Label>
                    </div>
                  </div>
                  
                  <div className="flex justify-end gap-2">
                    <Button 
                      variant="outline" 
                      onClick={() => setEditingAnnouncement(null)}
                    >
                      Cancel
                    </Button>
                    <Button 
                      onClick={() => handleSaveAnnouncement(announcement, announcement.id)}
                      disabled={isSaving}
                      className="bg-orange-500 hover:bg-orange-600"
                    >
                      {isSaving ? "Saving..." : "Save Changes"}
                    </Button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-semibold">{announcement.title}</h3>
                        {announcement.active ? (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-800">
                            Active
                          </span>
                        ) : (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-800">
                            Inactive
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        Created: {formatDate(announcement.createdAt)}
                        {announcement.expiresAt && ` • Expires: ${formatDate(announcement.expiresAt)}`}
                      </p>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="border-orange-500 text-orange-500"
                        onClick={() => handleEditAnnouncement(announcement.id as number)}
                      >
                        Edit
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => handleDeleteAnnouncement(announcement.id as number)}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                  
                  <div className="mt-4 p-3 bg-gray-50 rounded-md">
                    <p className="whitespace-pre-wrap">{announcement.content}</p>
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

function PageContentPanel() {
  const [pageContents, setPageContents] = useState<Array<{
    id?: number;
    section: string;
    content: any;
    updatedAt?: string;
  }>>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [editingContent, setEditingContent] = useState<string | null>(null);
  const { toast } = useToast();
  
  useEffect(() => {
    async function loadPageContents() {
      try {
        setIsLoading(true);
        const res = await apiRequest("GET", "/api/admin/page-content");
        if (res.ok) {
          const data = await res.json();
          setPageContents(data);
        }
      } catch (error) {
        toast({
          title: "Error loading page content",
          description: "Failed to load page content",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    }
    
    loadPageContents();
  }, [toast]);
  
  async function handleSavePageContent(section: string) {
    const contentToSave = pageContents.find(c => c.section === section);
    if (!contentToSave) return;
    
    try {
      setIsSaving(true);
      
      const res = await apiRequest("PUT", `/api/admin/page-content/${section}`, {
        content: contentToSave.content
      });
      
      if (res.ok) {
        const updatedContent = await res.json();
        
        setPageContents(contents => 
          contents.map(c => c.section === section ? updatedContent : c)
        );
        setEditingContent(null);
        
        toast({
          title: "Content updated",
          description: `${section} content updated successfully.`
        });
      } else {
        toast({
          title: "Error saving content",
          description: "There was an error saving the page content.",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error saving content",
        description: "There was an error saving the page content.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  }
  
  function handleEditContent(section: string) {
    setEditingContent(section);
  }
  
  function handleUpdateContent(section: string, key: string, value: any) {
    setPageContents(contents => 
      contents.map(c => 
        c.section === section 
          ? { 
              ...c, 
              content: { 
                ...c.content, 
                [key]: value 
              } 
            } 
          : c
      )
    );
  }
  
  function formatDate(dateString: string | undefined) {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
  
  if (isLoading) {
    return <div className="flex justify-center items-center h-64">Loading page content...</div>;
  }
  
  // Group content by section for better organization
  const heroContent = pageContents.find(c => c.section === "hero");
  const streamContent = pageContents.find(c => c.section === "streams");
  const connectContent = pageContents.find(c => c.section === "connect");
  const ctaContent = pageContents.find(c => c.section === "cta");
  const footerContent = pageContents.find(c => c.section === "footer");
  
  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold">Page Content</h2>
      <p className="text-gray-500">
        Edit the content for each section of your website. Changes will be reflected immediately on the live site.
      </p>
      
      {/* Hero Section */}
      {heroContent && (
        <Card className="p-4">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-lg font-semibold">Hero Section</h3>
              <p className="text-sm text-gray-500">
                Last updated: {formatDate(heroContent.updatedAt)}
              </p>
            </div>
            {editingContent === "hero" ? (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setEditingContent(null)}
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={() => handleSavePageContent("hero")}
                  disabled={isSaving}
                  className="bg-orange-500 hover:bg-orange-600"
                >
                  {isSaving ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            ) : (
              <Button
                variant="outline"
                size="sm"
                className="border-orange-500 text-orange-500"
                onClick={() => handleEditContent("hero")}
              >
                Edit Content
              </Button>
            )}
          </div>
          
          {editingContent === "hero" ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="hero-title">Hero Title</Label>
                <Input
                  id="hero-title"
                  value={heroContent.content.title || ""}
                  onChange={(e) => handleUpdateContent("hero", "title", e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="hero-subtitle">Hero Subtitle</Label>
                <Input
                  id="hero-subtitle"
                  value={heroContent.content.subtitle || ""}
                  onChange={(e) => handleUpdateContent("hero", "subtitle", e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="hero-cta">Call to Action Text</Label>
                <Input
                  id="hero-cta"
                  value={heroContent.content.ctaText || ""}
                  onChange={(e) => handleUpdateContent("hero", "ctaText", e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="hero-image">Background Image URL</Label>
                <Input
                  id="hero-image"
                  value={heroContent.content.backgroundImage || ""}
                  onChange={(e) => handleUpdateContent("hero", "backgroundImage", e.target.value)}
                  placeholder="/path/to/image.jpg"
                />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="font-medium">Title:</p>
                <p className="text-gray-700">{heroContent.content.title || "Not set"}</p>
              </div>
              <div>
                <p className="font-medium">Subtitle:</p>
                <p className="text-gray-700">{heroContent.content.subtitle || "Not set"}</p>
              </div>
              <div>
                <p className="font-medium">CTA Text:</p>
                <p className="text-gray-700">{heroContent.content.ctaText || "Not set"}</p>
              </div>
              <div>
                <p className="font-medium">Background Image:</p>
                <p className="text-gray-700 truncate">{heroContent.content.backgroundImage || "Not set"}</p>
              </div>
            </div>
          )}
        </Card>
      )}
      
      {/* Streams Section */}
      {streamContent && (
        <Card className="p-4">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-lg font-semibold">Streams Section</h3>
              <p className="text-sm text-gray-500">
                Last updated: {formatDate(streamContent.updatedAt)}
              </p>
            </div>
            {editingContent === "streams" ? (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setEditingContent(null)}
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={() => handleSavePageContent("streams")}
                  disabled={isSaving}
                  className="bg-orange-500 hover:bg-orange-600"
                >
                  {isSaving ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            ) : (
              <Button
                variant="outline"
                size="sm"
                className="border-orange-500 text-orange-500"
                onClick={() => handleEditContent("streams")}
              >
                Edit Content
              </Button>
            )}
          </div>
          
          {editingContent === "streams" ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="streams-title">Section Title</Label>
                <Input
                  id="streams-title"
                  value={streamContent.content.title || ""}
                  onChange={(e) => handleUpdateContent("streams", "title", e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="streams-description">Section Description</Label>
                <textarea
                  id="streams-description"
                  className="w-full p-2 border rounded-md min-h-[100px]"
                  value={streamContent.content.description || ""}
                  onChange={(e) => handleUpdateContent("streams", "description", e.target.value)}
                />
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <p className="font-medium">Title:</p>
                <p className="text-gray-700">{streamContent.content.title || "Not set"}</p>
              </div>
              <div>
                <p className="font-medium">Description:</p>
                <p className="text-gray-700">{streamContent.content.description || "Not set"}</p>
              </div>
            </div>
          )}
        </Card>
      )}
      
      {/* Connect Section */}
      {connectContent && (
        <Card className="p-4">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-lg font-semibold">Connect Section</h3>
              <p className="text-sm text-gray-500">
                Last updated: {formatDate(connectContent.updatedAt)}
              </p>
            </div>
            {editingContent === "connect" ? (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setEditingContent(null)}
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={() => handleSavePageContent("connect")}
                  disabled={isSaving}
                  className="bg-orange-500 hover:bg-orange-600"
                >
                  {isSaving ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            ) : (
              <Button
                variant="outline"
                size="sm"
                className="border-orange-500 text-orange-500"
                onClick={() => handleEditContent("connect")}
              >
                Edit Content
              </Button>
            )}
          </div>
          
          {editingContent === "connect" ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="connect-title">Section Title</Label>
                <Input
                  id="connect-title"
                  value={connectContent.content.title || ""}
                  onChange={(e) => handleUpdateContent("connect", "title", e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="connect-description">Section Description</Label>
                <textarea
                  id="connect-description"
                  className="w-full p-2 border rounded-md min-h-[100px]"
                  value={connectContent.content.description || ""}
                  onChange={(e) => handleUpdateContent("connect", "description", e.target.value)}
                />
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <p className="font-medium">Title:</p>
                <p className="text-gray-700">{connectContent.content.title || "Not set"}</p>
              </div>
              <div>
                <p className="font-medium">Description:</p>
                <p className="text-gray-700">{connectContent.content.description || "Not set"}</p>
              </div>
            </div>
          )}
        </Card>
      )}
      
      {/* CTA Section */}
      {ctaContent && (
        <Card className="p-4">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-lg font-semibold">Call to Action Section</h3>
              <p className="text-sm text-gray-500">
                Last updated: {formatDate(ctaContent.updatedAt)}
              </p>
            </div>
            {editingContent === "cta" ? (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setEditingContent(null)}
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={() => handleSavePageContent("cta")}
                  disabled={isSaving}
                  className="bg-orange-500 hover:bg-orange-600"
                >
                  {isSaving ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            ) : (
              <Button
                variant="outline"
                size="sm"
                className="border-orange-500 text-orange-500"
                onClick={() => handleEditContent("cta")}
              >
                Edit Content
              </Button>
            )}
          </div>
          
          {editingContent === "cta" ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="cta-title">Title</Label>
                <Input
                  id="cta-title"
                  value={ctaContent.content.title || ""}
                  onChange={(e) => handleUpdateContent("cta", "title", e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="cta-description">Description</Label>
                <textarea
                  id="cta-description"
                  className="w-full p-2 border rounded-md min-h-[100px]"
                  value={ctaContent.content.description || ""}
                  onChange={(e) => handleUpdateContent("cta", "description", e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="cta-button">Button Text</Label>
                <Input
                  id="cta-button"
                  value={ctaContent.content.buttonText || ""}
                  onChange={(e) => handleUpdateContent("cta", "buttonText", e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="cta-url">Button URL</Label>
                <Input
                  id="cta-url"
                  value={ctaContent.content.buttonUrl || ""}
                  onChange={(e) => handleUpdateContent("cta", "buttonUrl", e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="cta-image">Background Image URL</Label>
                <Input
                  id="cta-image"
                  value={ctaContent.content.backgroundImage || ""}
                  onChange={(e) => handleUpdateContent("cta", "backgroundImage", e.target.value)}
                  placeholder="/path/to/image.jpg"
                />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="font-medium">Title:</p>
                <p className="text-gray-700">{ctaContent.content.title || "Not set"}</p>
              </div>
              <div>
                <p className="font-medium">Button Text:</p>
                <p className="text-gray-700">{ctaContent.content.buttonText || "Not set"}</p>
              </div>
              <div>
                <p className="font-medium">Button URL:</p>
                <p className="text-gray-700">{ctaContent.content.buttonUrl || "Not set"}</p>
              </div>
              <div>
                <p className="font-medium">Background Image:</p>
                <p className="text-gray-700 truncate">{ctaContent.content.backgroundImage || "Not set"}</p>
              </div>
              <div className="col-span-2">
                <p className="font-medium">Description:</p>
                <p className="text-gray-700">{ctaContent.content.description || "Not set"}</p>
              </div>
            </div>
          )}
        </Card>
      )}
      
      {/* Footer Section */}
      {footerContent && (
        <Card className="p-4">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-lg font-semibold">Footer Section</h3>
              <p className="text-sm text-gray-500">
                Last updated: {formatDate(footerContent.updatedAt)}
              </p>
            </div>
            {editingContent === "footer" ? (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setEditingContent(null)}
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={() => handleSavePageContent("footer")}
                  disabled={isSaving}
                  className="bg-orange-500 hover:bg-orange-600"
                >
                  {isSaving ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            ) : (
              <Button
                variant="outline"
                size="sm"
                className="border-orange-500 text-orange-500"
                onClick={() => handleEditContent("footer")}
              >
                Edit Content
              </Button>
            )}
          </div>
          
          {editingContent === "footer" ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="footer-copyright">Copyright Text</Label>
                <Input
                  id="footer-copyright"
                  value={footerContent.content.copyright || ""}
                  onChange={(e) => handleUpdateContent("footer", "copyright", e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="footer-credits">Credits</Label>
                <Input
                  id="footer-credits"
                  value={footerContent.content.credits || ""}
                  onChange={(e) => handleUpdateContent("footer", "credits", e.target.value)}
                />
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <p className="font-medium">Copyright:</p>
                <p className="text-gray-700">{footerContent.content.copyright || "Not set"}</p>
              </div>
              <div>
                <p className="font-medium">Credits:</p>
                <p className="text-gray-700">{footerContent.content.credits || "Not set"}</p>
              </div>
            </div>
          )}
        </Card>
      )}
    </div>
  );
}