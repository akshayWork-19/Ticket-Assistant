import React, { useEffect } from 'react'
import { Link } from "react-router-dom";
import { useState } from "react";
import Navbar from "../Components/Navbar";
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/Components/ui/card';
import { Tabs, TabsList, TabsTrigger } from "@/Components/ui/tabs";
import { Badge } from "@/Components/ui/badge";
import { Skeleton } from "@/Components/ui/skeleton";
import DashboardStats from '../Components/DashboardStats';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { MessageCircle } from 'lucide-react';

function Tickets() {

  const [form, setForm] = useState({ title: "", description: "" });
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [filterStatus, setFilterStatus] = useState("ALL");

  const navigate = useNavigate();




  const token = localStorage.getItem("token");
  // console.log(token);

  const fetchTickets = async () => {
    try {
      console.log(import.meta.env.VITE_SERVER_URL)
      const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/tickets`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        method: "GET"
      })
      // console.log(res);
      if (res.status === 401 || res.status === 403 || res.status === 500) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
        return;

      }

      const data = await res.json();
      if (res.ok && Array.isArray(data)) {
        setTickets(data);
      } else {
        setTickets([]);
      }

    } catch (error) {
      console.error("Failed to Fetch tickets", error)
    } finally {
      // 🚨 CRITICAL FIX: This MUST run after the initial fetch is complete
      setLoading(false);
    }
  }

  useEffect(() => {

    if (!token) {
      navigate('/login');
    }

    fetchTickets();

    // const intervalId = setInterval(fetchTickets, 10000); // Poll every 10 seconds (10000ms)

    // // 3. Clean up the interval when the component unmounts
    // return () => clearInterval(intervalId);
  }, [])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/tickets`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form)
      })
      const data = await res.json();
      console.log(data);

      if (res.ok) {
        setForm({ title: "", description: "" });
        fetchTickets(); // Refresh list
        setActiveTab("all");
        setFilterStatus("ALL");
        toast.success("Ticket created successfully!");
      } else {
        toast.error(data.message || "Ticket creation failed");
      }
    } catch (err) {
      toast.error("Error creating ticket");
      console.error(err);
    } finally {
      // Keep this one, it's the correct placement.
      setLoading(false);
    }
  }


  const getStatusBadge = (status) => {
    switch (status) {
      case "TODO": return <Badge variant="outline" className="border-orange-500/50 text-orange-500 bg-orange-500/10" > TODO</Badge>;
      case "IN_PROGRESS": return <Badge variant='outline' className="border-blue-500/50 text-blue-500 bg-blue-500/10" > Working</Badge>;
      case "RESOLVED": return <Badge variant="outline" className="border-green-500/50 text-green-500 bg-green-500/10" > Resolved</Badge>;
      default: return <Badge variant='secondary'>{status}</Badge>
    }
  }

  const displayedTickets = tickets.filter(t => filterStatus === "ALL" || t.status === filterStatus);
  return (
    <div className='min-h-screen bg-background pb-10'>
      <Navbar />
      <div className="max-w-6xl mx-auto p-4 md:p-6 space-y-8">
        <div className='flex flex-col gap-2"'>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className='text-muted-foreground'>Manage and track your support tickets efficiently.</p>
        </div>

        <DashboardStats tickets={tickets} currentFilter={filterStatus}
          onFilterChange={setFilterStatus} />
        <div className="flex items-center justify-between border-b border-border/10 pb-6">
          <div className="space-y-1">
            <h2 className="text-xl font-semibold text-white/80 flex items-center gap-2">
              Support Queue
              <Badge variant="secondary" className="h-5 px-1.5 text-[10px] bg-muted/30">{tickets.length}</Badge>
            </h2>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-fit">
            <TabsList className="h-9 bg-muted/20 border border-border/50 p-1">
              <TabsTrigger value="all" className="h-7 text-xs px-4">Active Feed</TabsTrigger>
              <TabsTrigger value="create" className="h-7 text-xs px-4 font-bold text-primary transition-all data-[state=active]:bg-primary data-[state=active]:text-primary-foreground hover:bg-primary/20">+ Create New Ticket</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        {/* 4. The Content Area (Separate List on next line) */}
        <div className="pt-2">
          {activeTab === "all" ? (
            <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {loading ? (
                // Shimmering Loaders
                [1, 2, 3].map((i) => (
                  <Card key={i} className="border-border/40 bg-card/10">
                    <CardHeader className="gap-2">
                      <Skeleton className="h-5 w-2/3" />
                      <Skeleton className="h-4 w-1/3" />
                    </CardHeader>
                  </Card>
                ))
              ) : (
                // The Actual Ticket List
                displayedTickets.map((ticket) => (
                  <Link key={ticket._id} to={`/tickets/${ticket._id}`}>
                    <Card className="h-full hover:border-primary/50 transition-all border-border/40 bg-card/20 hover:bg-card/40 cursor-pointer shadow-sm group">
                      <CardHeader className="pb-3 text-white/80">
                        <div className="flex justify-between items-start gap-4">
                          <CardTitle className="text-md font-semibold line-clamp-1 group-hover:text-primary transition-colors">{ticket.title}</CardTitle>
                          {getStatusBadge(ticket.status)}
                        </div>
                        <CardDescription className="line-clamp-2 text-xs text-muted-foreground font-medium">
                          {ticket.description}
                        </CardDescription>
                      </CardHeader>
                      <CardFooter className="pt-2 text-[10px] uppercase tracking-wider font-bold text-muted-foreground/40 border-t border-border/10 mt-2 flex justify-between items-center">
                        <div className="flex items-center gap-2 pt-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary/40" />
                          Created {new Date(ticket.createdAt).toLocaleDateString()}
                        </div>
                        {ticket.responses?.length > 0 && (
                          <div className="mt-4 flex items-center gap-3 bg-zinc-900/80 border border-zinc-800 rounded-lg p-1.5 w-2/3 group-hover:border-primary/50 transition-all shadow-inner group-hover:bg-zinc-900">
                            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 border border-primary/25 shadow-inner">
                              <MessageCircle className="w-4 h-4 text-primary" />
                            </div>
                            <div className="flex flex-col">
                              <span className="text-[11px] font-bold text-white/95 leading-none uppercase tracking-tight">
                                {ticket.responses.length} NEW MESSAGE{ticket.responses.length > 1 ? 'S' : ''}
                              </span>
                            </div>
                          </div>
                        )}
                      </CardFooter>

                    </Card>
                  </Link>
                ))
              )}
              {!loading && tickets.length === 0 && (
                <div className="col-span-full py-20 text-center border border-dashed border-border/20 rounded-xl bg-muted/5">
                  <p className="text-muted-foreground font-medium italic">Your queue is empty.</p>
                  {filterStatus !== "ALL" && (
                    <Button variant="link" onClick={() => setFilterStatus("ALL")} className="mt-2 text-primary">
                      Clear Filter
                    </Button>
                  )}
                </div>
              )}
            </div>
          ) : (
            /* Inline Creation Form - Only shows when 'New Ticket' is selected */
            <Card className="max-w-2xl border-border/40 bg-card/40 backdrop-blur-sm animate-in fade-in slide-in-from-top-2 duration-300 shadow-xl overflow-hidden">
              <div className="h-1 bg-primary/60" />
              <CardHeader>
                <CardTitle className="text-lg">Open a New Ticket</CardTitle>
                <CardDescription className="text-xs">Describe the issue and our AI will triage it for you.</CardDescription>
              </CardHeader>
              <form onSubmit={handleSubmit}>
                <CardContent className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Title</label>
                    <input
                      name="title"
                      value={form.title}
                      onChange={handleChange}
                      placeholder="e.g., Cannot access billing page"
                      className="flex h-10 w-full rounded-md border border-border/50 bg-background/50 px-3 py-2 text-sm text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary/40 transition-all"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Description</label>
                    <textarea
                      name="description"
                      value={form.description}
                      onChange={handleChange}
                      placeholder="Be specific... AI works best with technical details!"
                      className="flex min-h-[140px] w-full rounded-md border border-border/50 bg-background/50 px-3 py-2 text-sm text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary/40 transition-all"
                      required
                    ></textarea>
                  </div>
                </CardContent>
                <CardFooter className="bg-muted/10 p-6 border-t border-border/10 mt-4">
                  <Button className="font-bold uppercase tracking-tighter" type="submit" disabled={loading}>
                    {loading ? "Analyzing..." : "Submit Ticket"}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          )}
        </div>
      </div>
    </div >
  )
}

export default Tickets