import React, { useState } from 'react';
import Navbar from '../Components/Navbar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../Components/ui/card';
import { Button } from '../Components/ui/button';
import { Badge } from '../Components/ui/badge';
import { Camera, Save, ShieldCheck, Mail, Wrench } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';


export default function Profile() {
    const navigate = useNavigate();
    const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user')) || {});
    const token = localStorage.getItem('token');

    const [skills, setSkills] = useState("");
    const [avatarUrl, setAvatarUrl] = useState("");
    const [loading, setLoading] = useState(false);

    // Sync state when user object loads/changes
    React.useEffect(() => {
        if (user) {
            setSkills(user.skills?.join(', ') || '');
            setAvatarUrl(user.avatarUrl || '');
        }
    }, [user]);

    if (!token) {
        navigate('/login');
        return null;
    }

    const handleUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);
        const parsedSkills = skills.split(',').map(s => s.trim()).filter(Boolean);
        try {
            const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/auth/profile`, {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    skills: parsedSkills,
                    avatarUrl
                })
            })

            const data = await res.json();
            if (res.ok) {
                localStorage.setItem('user', JSON.stringify(data.user));
                setUser(data.user);
                toast.success('Profile Successfully updated');
            } else {
                toast.error(data.error || 'Failed to update profile');
            }
        } catch (error) {
            toast.error('Network error updating Profile');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-background pb-10">
            <Navbar />

            <div className="max-w-4xl mx-auto p-4 md:p-6 mt-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="space-y-2 border-b border-border/10 pb-6">
                    <h1 className="text-3xl font-bold tracking-tight text-white/90">User Profile</h1>
                    <p className="text-muted-foreground text-sm">Manage your personal information and technical skill set.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-1 space-y-6">
                        <Card className="border-border/40 bg-card/20 shadow-sm relative overflow-hidden flex flex-col items-center p-6 text-center">
                            <div className="absolute top-0 left-0 w-full h-24 bg-primary/10 border-b border-border/10" />

                            <div className="relative z-10 w-24 h-24 rounded-full border-4 border-background bg-muted shadow-xl overflow-hidden mb-4">
                                <img
                                    src={user?.avatarUrl || `https://api.dicebear.com/7.x/notionists/svg?seed=${user?.email}`}
                                    alt="Avatar"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <h2 className="text-lg font-bold text-white/90">{user?.email?.split('@')[0]}</h2>
                            <div className="flex items-center gap-1.5 text-muted-foreground text-sm mt-1 mb-4">
                                <Mail className="w-4 h-4" /> {user.email}
                            </div>
                            <Badge variant="secondary" className="bg-primary/20 text-primary border-transparent">
                                <ShieldCheck className="w-3.5 h-3.5 mr-1" />
                                {user?.role?.toUpperCase()}
                            </Badge>

                            {/* Skills Display in Card */}
                            {user?.skills?.length > 0 && (
                                <div className="mt-8 pt-6 border-t border-border/10 w-full space-y-3">
                                    <div className="flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground mr-auto ml-0">
                                        <Wrench className="w-3.5 h-3.5" /> Technical Expertise
                                    </div>
                                    <div className="flex flex-wrap items-center justify-center gap-2">
                                        {user.skills.map(skill => (
                                            <Badge key={skill} variant="outline" className="text-[10px] bg-background/50 border-border/50 text-white/70 px-2 py-0.5">
                                                {skill}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </Card>
                    </div>

                    <div className="md:col-span-2">
                        <Card className="border-border/40 bg-card/10 shadow-sm">
                            <form onSubmit={handleUpdate}>
                                <CardHeader className="border-b border-border/5 pb-4">
                                    <CardTitle className="text-md">Profile Settings</CardTitle>
                                    <CardDescription>Update your avatar and skills to help us route tickets correctly.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6 pt-6">

                                    {/* Avatar URL Input */}
                                    <div className="space-y-2.5">
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                                            <Camera className="w-3.5 h-3.5" /> Avatar Image URL
                                        </label>
                                        <input
                                            type="url"
                                            placeholder="https://imgur.com/my-avatar.png (leave blank for robot)"
                                            className="flex h-10 w-full rounded-md border border-border/50 bg-background/50 px-3 py-2 text-sm text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary/40 transition-all shadow-inner"
                                            value={avatarUrl}
                                            onChange={(e) => setAvatarUrl(e.target.value)}
                                        />
                                    </div>
                                    {/* Skills Input */}
                                    <div className="space-y-2.5">
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                                            <Wrench className="w-3.5 h-3.5" /> Technical Skills
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="React, CSS, Node.js..."
                                            className="flex h-10 w-full rounded-md border border-border/50 bg-background/50 px-3 py-2 text-sm text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary/40 transition-all shadow-inner"
                                            value={skills}
                                            onChange={(e) => setSkills(e.target.value)}
                                        />
                                        <p className="text-[10px] text-muted-foreground italic">Separate skills with commas. Used for AI Smart Routing.</p>
                                    </div>
                                </CardContent>
                                <CardFooter className="bg-muted/5 border-t border-border/10 p-5 mt-4 justify-end">
                                    <Button type="submit" disabled={loading} className="font-bold tracking-wider">
                                        <Save className="w-4 h-4 mr-2" />
                                        {loading ? "SAVING..." : "SAVE CHANGES"}
                                    </Button>
                                </CardFooter>
                            </form>
                        </Card>
                    </div>


                </div>


            </div>

        </div>
    )


}