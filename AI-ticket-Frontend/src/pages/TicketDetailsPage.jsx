import { useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Badge } from "@/Components/ui/badge";
import { Skeleton } from "@/Components/ui/skeleton";
import { Calendar, User, Tag, AlertCircle, Sparkles } from "lucide-react";
import Navbar from "../Components/Navbar";
import { toast } from "sonner";
import { Button } from "@/Components/ui/button";



function TicketDetailsPage() {
  const { id } = useParams();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [replyText, setReplyText] = useState("");
  const [generating, setGenerating] = useState(false);
  const token = localStorage.getItem("token");
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user')) || {});



  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/tickets/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        });
        const data = await res.json();

        if (res.ok) {
          setTicket(data.ticket);
        } else {
          toast.error(data.message || "Failed to fetch ticket");
        }
      } catch (err) {
        console.error(err);
        toast.error("Something went wrong");
      } finally {
        setLoading(false);
      }

    }
    fetchTicket();
  }, [id]);


  const handleGenerateDraft = async () => {
    setGenerating(true);

    try {
      const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/tickets/${id}/draft`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        setReplyText(data.draft);
        toast.success("AI Draft Generated!");
      } else {
        toast.error("Failed to generate draft.");
      }
    } catch (error) {
      toast.error("Network error");
    }
    setGenerating(false);
  }

  const handleSendReply = async () => {
    if (!replyText.trim()) return toast.error("Write a message first!");
    try {
      const result = await fetch(`${import.meta.env.VITE_SERVER_URL}/tickets/${id}/responses`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ message: replyText })
      });

      const data = await result.json();
      if (result.ok) {
        setTicket(data.ticket);
        setReplyText("");
        toast.success("Reply sent");
      } else {
        toast.error("Failed to send reply!")
      }

    } catch (error) {
      toast.error("Network Error!");

    }
  }


  const getStatusBadge = (status) => {
    switch (status) {
      case "TODO": return <Badge variant="outline" className="border-orange-500/50 text-orange-500 bg-orange-500/10">Awaiting Action</Badge>;
      case "IN_PROGRESS": return <Badge variant='outline' className="border-blue-500/50 text-blue-500 bg-blue-500/10">Working</Badge>;
      case "RESOLVED": return <Badge variant="outline" className="border-green-500/50 text-green-500 bg-green-500/10">Resolved</Badge>;
      default: return <Badge variant='secondary'>{status}</Badge>;
    }
  }

  const getPriorityBadge = (priority) => {
    if (!priority) return null;
    const p = priority.toLowerCase();
    if (p === 'high' || p === 'p0') return <Badge variant="destructive" className="bg-red-500/20 text-red-500 hover:bg-red-500/30">High Priority</Badge>;
    if (p === 'medium' || p === 'p1') return <Badge variant="secondary" className="bg-orange-500/20 text-orange-500 hover:bg-orange-500/30">Medium Priority</Badge>;
    return <Badge variant="outline" className="text-muted-foreground border-border/50">Low Priority</Badge>;
  }

  if (loading) return (
    <div className="min-h-screen bg-background pb-10">
      <Navbar />
      <div className="max-w-5xl mx-auto p-4 md:p-6 mt-6 space-y-6">
        <Skeleton className="h-10 w-1/3 bg-muted/20" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton className="h-[400px] lg:col-span-2 bg-muted/20" />
          <Skeleton className="h-[300px] bg-muted/20" />

        </div>
      </div>
    </div>
  )

  if (!ticket) return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-center space-y-4">
          <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto" />
          <h2 className="text-2xl font-bold tracking-tight">Ticket Not Found</h2>
          <p className="text-muted-foreground">The ticket you're looking for doesn't exist or you lack permission.</p>
        </div>
      </div>
    </div>
  )

  return (
    <div className="max-w-3xl mx-auto p-4">

      <Navbar />

      <div className="max-w-5xl mx-auto p-4 md:p-6 mt-4 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/10 pb-6">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight text-white/90">
              {ticket.title}
            </h1>

            <div className="flex items-center gap-3 mt-2">
              <span className="text-xs font-mono font-bold tracking-widest text-muted-foreground bg-muted/30 px-2 py-0.5 rounded border border-border/40">
                #{ticket._id.slice(-6).toUpperCase()}
              </span>
              {getStatusBadge(ticket.status)}
              {getPriorityBadge(ticket.priority)}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-border/40 bg-card/20 shadow-sm">
              <CardHeader className="pb-3 border-b border-border/10">
                <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  Original User Request
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 text-white/80 leading-relaxed whitespace-pre-wrap">
                {ticket.description}
              </CardContent>
            </Card>
            {/* AI Notes Section Component (Always Rendered, Fixed Min Height) */}
            <Card className="border-primary/20 bg-primary/5 shadow-lg relative overflow-hidden min-h-[250px] flex flex-col">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Sparkles className="w-32 h-32 text-primary" />
              </div>
              <CardHeader className="pb-3 border-b border-primary/10">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-primary group-hover:animate-spin" />
                  <CardTitle className="text-sm font-bold uppercase tracking-wider text-primary">
                    AI Triage Notes
                  </CardTitle>
                </div>
              </CardHeader>

              <CardContent className="pt-4 flex-1 flex flex-col z-10 relative">
                {ticket.helpfulNotes ? (
                  /* Render Markdown if notes exist */
                  <div className="prose prose-invert prose-p:leading-relaxed prose-sm max-w-none text-white/80">
                    <ReactMarkdown>{ticket.helpfulNotes}</ReactMarkdown>
                  </div>
                ) : (
                  /* Awesome Loading State if notes don't exist yet */
                  <div className="flex flex-col items-center justify-center flex-1 space-y-3 py-10 opacity-80">
                    <Sparkles className="w-10 h-10 animate-pulse text-primary/60" />
                    <p className="text-sm font-semibold tracking-wide text-primary/80 uppercase">AI is analyzing this ticket</p>
                    <p className="text-xs text-muted-foreground">Triage notes will appear here shortly...</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="border-border/40 bg-card/40 backdrop-blur-sm shadow-sm ring-1 ring-white/5">
              <CardHeader className="pb-3 border-b border-border/10">
                <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  Ticket Metadata
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 space-y-5">

                {/* Assignee Box */}
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-widest">
                    <User className="w-3.5 h-3.5" /> Assignee
                  </div>
                  <div className="text-sm text-white/90 font-medium bg-muted/20 px-3 py-2 rounded-md border border-border/30 shadow-inner">
                    {ticket.assignedTo?.email || "Unassigned"}
                  </div>
                </div>
                {/* Created At Date */}
                {ticket.createdAt && (
                  <div className="space-y-1.5 pt-2 border-t border-border/10">
                    <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-widest">
                      <Calendar className="w-3.5 h-3.5" /> Created Date
                    </div>
                    <div className="text-sm font-medium text-white/80">
                      {new Date(ticket.createdAt).toLocaleString(undefined, {
                        dateStyle: 'medium',
                        timeStyle: 'short'
                      })}
                    </div>
                  </div>
                )}
                {/* Technical Skills Map */}
                {ticket.relatedSkills?.length > 0 && (
                  <div className="space-y-2 pt-2 border-t border-border/10">
                    <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-widest pb-1">
                      <Tag className="w-3.5 h-3.5" /> Technical Match
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {ticket.relatedSkills.map(skill => (
                        <Badge key={skill} variant="secondary" className="bg-primary/20 text-primary hover:bg-primary/30 border-transparent">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-3 space-y-4">
            <Card className="border-border/40 bg-card/20 shadow-sm mt-4">
              <CardHeader className="border-b border-border/10 pb-3">
                <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  Resolution Thread
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 space-y-4 flex flex-col">
                {/* Existing Responses */}
                {ticket.responses?.length === 0 && (
                  <p className="text-xs text-muted-foreground italic text-center py-4">No replies yet. Start the conversation below!</p>
                )}

                {/* Chat as GitHub-style Comments */}
                {ticket.responses?.map((r, i) => {
                  const isStaff = r.senderRole !== "user";
                  return (
                    <div key={i} className="flex flex-col border border-border/40 rounded-lg overflow-hidden bg-card/10">
                      {/* Comment Header */}
                      <div className={`px-4 py-2 border-b border-border/20 flex items-center justify-between ${isStaff ? 'bg-primary/10' : 'bg-muted/20'}`}>
                        <div className="flex items-center gap-2">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${isStaff ? 'bg-primary text-primary-foreground' : 'bg-muted-foreground text-background'}`}>
                            {r.senderRole?.charAt(0).toUpperCase() || "U"}
                          </div>
                          <span className={`text-xs font-bold tracking-tight ${isStaff ? 'text-primary' : 'text-white/80'}`}>
                            {r.senderRole?.toUpperCase() || "USER"}
                          </span>
                          <span className="text-[10px] text-muted-foreground font-medium">
                            commented on {new Date(r.createdAt).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        {isStaff && (
                          <Badge variant="outline" className="h-5 px-1.5 text-[9px] border-primary/30 text-primary bg-primary/5 uppercase font-bold tracking-widest">
                            Staff
                          </Badge>
                        )}
                      </div>
                      {/* Comment Body */}
                      <div className="p-4 text-sm text-white/90 prose prose-invert prose-p:leading-relaxed prose-sm max-w-none">
                        <ReactMarkdown>{r.message}</ReactMarkdown>
                      </div>
                    </div>
                  )
                })}
                {/* Reply Box (All Users can reply) */}
                <div className="flex flex-col gap-3 mt-4 pt-4 border-t border-border/10 w-full">
                  <textarea
                    className="w-full bg-background/50 border border-border/50 rounded-md p-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-primary/50 min-h-[100px] shadow-inner placeholder:text-muted-foreground/50"
                    placeholder="Type your response to continue the conversation..."
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                  />
                  <div className="flex justify-between items-center">
                    <div>
                      {/* Hide AI Draft from normal users */}
                      {(user?.role === 'admin' || user?.role === 'moderator') && (
                        <Button variant="secondary" onClick={handleGenerateDraft} disabled={generating} className="bg-primary/20 text-primary hover:bg-primary/30 text-xs font-semibold shadow-sm">
                          <Sparkles className="w-3.5 h-3.5 mr-2" />
                          {generating ? "Drafting..." : "Auto-Draft AI Reply"}
                        </Button>
                      )}
                    </div>
                    <Button onClick={handleSendReply} className="text-xs font-bold tracking-wide shadow-lg">
                      Send Reply
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>


        </div>

      </div>

    </div >
  );
}


export default TicketDetailsPage