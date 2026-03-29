import React from 'react'
import { useNavigate } from "react-router-dom";
import { useState } from 'react';
import { Card, CardContent, CardFooter } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { toast } from 'sonner';

function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true)
    try {
      const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form),
      })
      console.log(res);
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        toast.success("Account created successfully!");
        navigate('/')
      } else {
        toast.error(data.message || "Signup Failed!");
      }
    } catch (error) {
      toast.error("Signup-something went wrong");
    }
    finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen w-full lg:grid lg:grid-cols-2 bg-background">
      {/* Left Column - Form */}
      <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-sm space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold tracking-tight text-white/90">Create an account</h1>
            <p className="text-muted-foreground text-sm">
              Enter your email below to join early access
            </p>
          </div>

          <Card className="w-full max-w-sm border-border bg-indigo-950 shadow-xl/30">
            <form onSubmit={handleSignup}>
              <CardContent className="space-y-5 pt-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                    Email
                  </label>
                  <input type="email" name="email" placeholder='name@example.com' className='flex h-10 w-full rounded-md border border-border/50 bg-background/50 px-3 py-2 text-sm text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary/40 transition-all' value={form.email} onChange={handleChange} required />
                </div>

                <div className="space-y-2 pb-3">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                      Password
                    </label>
                    <a href="#" className="text-[10px] font-semibold text-primary/80 hover:text-primary transition-colors">Forgot password?</a>
                  </div>
                  <input type="password" name="password" placeholder='••••••••' className='flex h-10 w-full rounded-md border border-border/50 bg-background/50 px-3 py-2 text-sm text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary/40 transition-all' value={form.password} onChange={handleChange} required />
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-4 pb-6">
                <Button type="submit" disabled={loading} className="w-full font-bold uppercase tracking-tighter">
                  {loading ? "Creating account..." : "Sign Up"}
                </Button>
                <div className="text-center text-xs text-muted-foreground">
                  Already have an account?{" "}
                  <Button variant="link" className="p-0 h-auto font-semibold text-primary" onClick={(e) => { e.preventDefault(); navigate('/login'); }}>
                    Log in
                  </Button>
                </div>
              </CardFooter>
            </form>
          </Card>
        </div>
      </div>

      {/* Right Column - Illustration Placeholder */}
      <div className="hidden lg:block relative bg-muted/10 border-l border-border/10 overflow-hidden">
        {/* Subtle Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 via-background to-background z-10"></div>

        {/* Content Container */}
        <div className="absolute inset-0 flex flex-col items-center justify-center z-20 p-12">
          <div className="text-center space-y-8 max-w-md animate-in fade-in zoom-in-95 duration-700 delay-150">
            <div className="inline-flex items-center justify-center rounded-2xl bg-secondary/20 p-5 shadow-inner ring-1 ring-secondary/30">
              <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground"><circle cx="12" cy="12" r="10" /><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" /><path d="M2 12h20" /></svg>
            </div>
            <div className="space-y-2">
              <h2 className="text-3xl font-bold text-white/90 tracking-tight">Scale Your Support</h2>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Join thousands of modern startups utilizing AI to automate their helpdesk and keep customers happy.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 text-left">
              <div className="flex items-start gap-3 rounded-xl bg-white/5 border border-border/20 p-4">
                <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/20">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/></svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-white/80">Enterprise Security</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Built with data privacy in mind. We ensure your customer interactions remain private and secure.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-xl bg-white/5 border border-border/20 p-4">
                <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/20">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-white/80">Smart Insights</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Gain deep understanding of customer pain points with AI-generated trend analysis and reports.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-xl bg-white/5 border border-border/20 p-4">
                <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/20">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-white/80">Collaborative Workflow</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Seamlessly hand off complex issues from AI to human agents without losing context.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Signup
