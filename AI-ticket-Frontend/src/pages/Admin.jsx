import React, { useEffect, useState } from 'react';
import Navbar from "../Components/Navbar";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { Badge } from "@/Components/ui/badge";
import { Search, ShieldAlert, UserCog, Check, X, Shield, Wrench, Mail } from "lucide-react";
import { toast } from "sonner";

export default function Admin() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({ role: "", skills: "" });
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  const fetchUsers = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/auth/details`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (res.ok) {
        setUsers(data.AllUsers);
        setFilteredUsers(data.AllUsers);
      } else {
        console.error(data.error);
      }
    } catch (err) {
      console.error("Error fetching users", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleEditClick = (user) => {
    setEditingUser(user.email);
    setFormData({
      role: user.role,
      skills: user.skills?.join(", ") || "",
    });
  };

  const handleUpdate = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/auth/update`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            email: editingUser,
            role: formData.role,
            skills: formData.skills
              .split(",")
              .map((skill) => skill.trim())
              .filter(Boolean),
          }),
        }
      );

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Failed to update user");
        return;
      }

      toast.success("User access modified successfully.");
      setEditingUser(null);
      setFormData({ role: "", skills: "" });
      fetchUsers();
    } catch (err) {
      console.error("Update failed", err);
      toast.error("Update failed due to network error.");
    }
  };

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    setFilteredUsers(
      users.filter((user) => user.email.toLowerCase().includes(query))
    );
  };

  const getRoleBadge = (role) => {
    switch (role?.toLowerCase()) {
      case 'admin': return <Badge variant="destructive" className="bg-red-500/20 text-red-500 border-transparent"><ShieldAlert className="w-3 h-3 mr-1" /> Admin</Badge>;
      case 'moderator': return <Badge variant="secondary" className="bg-blue-500/20 text-blue-400 border-transparent"><Shield className="w-3 h-3 mr-1" /> Mod</Badge>;
      default: return <Badge variant="outline" className="text-muted-foreground border-border/50">User</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-background pb-10">
      <Navbar />

      <div className="max-w-6xl mx-auto p-4 md:p-6 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

        {/* Header & Search Area */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border/10 pb-6 mt-4">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight text-white/90">Admin Workspace</h1>
            <p className="text-muted-foreground text-sm">Manage users, access levels, and assign routing skills.</p>
          </div>

          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search users by email..."
              className="flex h-10 w-full rounded-md border border-border/50 bg-background/50 pl-9 pr-3 py-2 text-sm text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary/40 transition-all shadow-inner"
              value={searchQuery}
              onChange={handleSearch}
            />
          </div>
        </div>

        {/* User Card Grid */}
        <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {loading ? (
            <div className="col-span-full py-20 text-center text-muted-foreground animate-pulse">Loading users...</div>
          ) : filteredUsers.length === 0 ? (
            <div className="col-span-full py-20 text-center border border-dashed border-border/20 rounded-xl bg-muted/5">
              <p className="text-muted-foreground font-medium italic">No users found matching "{searchQuery}"</p>
            </div>
          ) : (
            filteredUsers.map((user) => (
              <Card key={user._id} className={`flex flex-col border-border/40 backdrop-blur-sm transition-all shadow-sm group ${editingUser === user.email ? 'ring-1 ring-primary/50 bg-primary/5' : 'bg-card/20 hover:bg-card/40'}`}>
                <CardHeader className="pb-3 border-b border-border/10">
                  <div className="flex justify-between items-start gap-4">
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <CardTitle className="text-sm font-semibold truncate text-white/90 flex items-center gap-2">
                        <Mail className="w-3.5 h-3.5 text-muted-foreground" />
                        {user.email}
                      </CardTitle>
                    </div>
                    {/* Render different style badge based on Role */}
                    {getRoleBadge(user.role)}
                  </div>
                </CardHeader>

                <CardContent className="pt-4 flex-1">
                  {editingUser === user.email ? (
                    /* EDIT MODE */
                    <div className="space-y-4 animate-in zoom-in-95 duration-200">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Select Role</label>
                        <select
                          className="flex h-9 w-full rounded-md border border-border/50 bg-background/50 px-3 py-1 text-sm text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary/40"
                          value={formData.role}
                          onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                        >
                          <option className="bg-background" value="user">User</option>
                          <option className="bg-background" value="moderator">Moderator</option>
                          <option className="bg-background" value="admin">Admin</option>
                        </select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Technical Skills</label>
                        <input
                          type="text"
                          placeholder="React, Node.js, AWS..."
                          className="flex h-9 w-full rounded-md border border-border/50 bg-background/50 px-3 py-1 text-sm text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary/40"
                          value={formData.skills}
                          onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                        />
                      </div>
                    </div>
                  ) : (
                    /* VIEW MODE */
                    <div className="space-y-4">
                      {user.skills && user.skills.length > 0 ? (
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-widest">
                            <Wrench className="w-3.5 h-3.5" /> Skills
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {user.skills.map(skill => (
                              <Badge key={skill} variant="secondary" className="bg-primary/20 text-primary/90 text-xs px-2.5 py-1 font-medium hover:bg-primary/40 border-transparent transition-colors shadow-sm">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="text-xs italic text-muted-foreground/50 flex items-center gap-1.5">
                          <Wrench className="w-3 h-3" /> No particular skills listed
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>

                <CardFooter className="pt-0 pb-4 mt-auto justify-end border-t border-border/10 p-4">
                  {editingUser === user.email ? (
                    <div className="flex gap-2 w-full">
                      <Button size="sm" variant="ghost" className="flex-1 text-xs" onClick={() => setEditingUser(null)}>
                        <X className="w-3.5 h-3.5 mr-1" /> Cancel
                      </Button>
                      <Button size="sm" className="flex-1 text-xs" onClick={handleUpdate}>
                        <Check className="w-3.5 h-3.5 mr-1" /> Save Values
                      </Button>
                    </div>
                  ) : (
                    <Button size="sm" variant="secondary" className="w-full text-xs font-semibold bg-primary/10 text-primary hover:bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" onClick={() => handleEditClick(user)}>
                      <UserCog className="w-3.5 h-3.5 mr-2" /> Modify Access or Skills
                    </Button>
                  )}
                </CardFooter>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
