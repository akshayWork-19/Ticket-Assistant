import React from 'react'
import { useNavigate } from "react-router-dom";
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardAction, CardFooter, CardHeader, CardTitle } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { toast } from 'sonner';

function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true)
    try {
      const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      })
      const data = await res.json();
      console.log(data);
      if (res.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        toast.success("Logged in successfully!");
        navigate('/');
      } else {
        toast.error(data.message || data.error || "Login Failed!");
      }
    } catch (error) {
      toast.error("Login-something went wrong");
    }
    finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen w-full lg:grid lg:grid-cols-2 bg-background">

      <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-sm space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 ">
          <div className="mx-auto w-full max-w-sm space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="space-y-2 text-center">
              <h1 className="text-3xl font-bold tracking-tight text-white/90">Welcome Back</h1>
              <p className="text-muted-foreground text-sm">
                Enter your credentials to access your workspace
              </p>
            </div>



          </div>
          <Card className="w-full max-w-sm border-border bg-indigo-950 shadow-xl/30">
            <form onSubmit={handleLogin}>
              <CardContent className="space-y-5 pt-3 pb-3">
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
              <CardFooter className="flex flex-col gap-2 pb-6">
                <Button type="submit" disabled={loading} className="w-2/3 font-bold uppercase tracking-tighter">
                  {loading ? "Verifying..." : "Sign In"}
                </Button>
                <div className="text-center text-xs text-muted-foreground">
                  Don&apos;t have an account?{" "}
                  <Button variant="link" className="p-0 h-auto font-semibold text-primary" onClick={(e) => { e.preventDefault(); navigate('/signup'); }}>
                    Sign Up

                  </Button>

                </div>
              </CardFooter>
            </form>
          </Card>
        </div>
      </div>

      <div className="hidden lg:block relative bg-muted/10 border-l border-border/10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-background z-10">
        </div>

        <div className="absolute inset-0 flex flex-col items-center justify-center z-20 p-12">
          <div className="text-center space-y-8 max-w-md animate-in fade-in zoom-in-95 duration-700 delay-150">
            <div className="inline-flex items-center justify-center rounded-2xl bg-primary/10 p-5 shadow-inner ring-1 ring-primary/20">
              <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" /><polyline points="14 2 14 8 20 8" /><path d="m9 15 2 2 4-4" /></svg>
            </div>
            <div className="space-y-2">
              <h2 className="text-3xl font-bold text-white/90 tracking-tight">AI-Powered Support</h2>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Triage, prioritize, and resolve customer tickets faster than ever using our intelligence engine.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 text-left">
              <div className="flex items-start gap-3 rounded-xl bg-white/5 border border-border/20 p-4">
                <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/20">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-white/80">Instant AI Triage</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Every ticket is automatically categorized, prioritized, and assigned the moment it arrives.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-xl bg-white/5 border border-border/20 p-4">
                <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/20">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-white/80">Smart Draft Replies</p>
                  <p className="text-xs text-muted-foreground mt-0.5">AI generates context-aware reply drafts so your agents resolve issues in record time.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-xl bg-white/5 border border-border/20 p-4">
                <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/20">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/></svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-white/80">Role-Based Access</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Secure, admin-controlled permissions so the right people see the right tickets — always.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div >
  )
}

export default Login