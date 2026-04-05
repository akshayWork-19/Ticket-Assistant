import React from 'react'
import { useNavigate, Link } from "react-router-dom";
import { useState } from 'react';
import { Card, CardContent, CardFooter } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { toast } from 'sonner';
import { Ticket, Github, Chrome, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import DashboardImg from "../assets/Dashboard.png";

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
    <div className="min-h-screen w-full lg:grid lg:grid-cols-[1fr_1.2fr] bg-[#020203] text-white">

      {/* Left Column - Form */}
      <div className="flex flex-col items-center justify-center py-12 px-8 sm:px-12 lg:px-20 relative overflow-hidden">
        {/* Abstract Glow */}
        <div className="absolute top-0 left-0 w-full h-full bg-primary/5 blur-[100px] rounded-full -z-10 translate-x-[-30%] translate-y-[-30%]" />

        <div className="w-full max-w-sm space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          {/* Logo & Header */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center gap-2 group w-fit">
              <div className="bg-primary/20 text-primary p-2 rounded-xl group-hover:scale-110 transition-transform">
                <Ticket className="h-5 w-5" />
              </div>
              <span className="font-bold text-lg tracking-tight">Ticket AI</span>
            </Link>
            
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent">Welcome back</h1>
              <p className="text-white/40 text-sm font-medium">Log in to your account to continue.</p>
            </div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 ml-1">Email Address</label>
                <input 
                  type="email" 
                  name="email" 
                  placeholder='name@example.com' 
                  className='flex h-12 w-full rounded-xl border border-white/10 bg-white/[0.02] px-4 py-2 text-sm text-white placeholder:text-white/20 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary/40 transition-all focus:border-primary/30' 
                  value={form.email} 
                  onChange={handleChange} 
                  required 
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between ml-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">Password</label>
                  <a href="#" className="text-[10px] font-bold text-primary/60 hover:text-primary transition-colors">Forgot password?</a>
                </div>
                <input 
                  type="password" 
                  name="password" 
                  placeholder='••••••••' 
                  className='flex h-12 w-full rounded-xl border border-white/10 bg-white/[0.02] px-4 py-2 text-sm text-white placeholder:text-white/20 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary/40 transition-all focus:border-primary/30' 
                  value={form.password} 
                  onChange={handleChange} 
                  required 
                />
              </div>
            </div>

            <Button type="submit" disabled={loading} className="w-full h-12 font-bold rounded-xl bg-white text-black hover:bg-white/90 transition-all active:scale-95 shadow-[0_0_20px_-5px_rgba(255,255,255,0.3)]">
              {loading ? "Verifying..." : "Sign In"}
            </Button>

            <p className="text-center text-xs text-white/30 font-medium">
              Don&apos;t have an account?{" "}
              <Link to="/signup" className="text-primary hover:text-primary/80 transition-colors font-bold underline underline-offset-4 decoration-primary/30">
                Create account
              </Link>
            </p>
          </form>
        </div>
      </div>

      {/* Right Column - Immersive Visual */}
      <div className="hidden lg:flex relative bg-[#010102] border-l border-white/5 items-center justify-center p-12 overflow-hidden">
        {/* Immersive Background Elements */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="relative z-10 w-full max-w-2xl animate-in fade-in zoom-in-95 duration-1000">
           <div className="mb-12 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold tracking-widest uppercase text-primary">
                 <ShieldCheck className="h-3 w-3" /> Secure Access
              </div>
              <h2 className="text-5xl font-bold tracking-tight bg-gradient-to-b from-white to-white/40 bg-clip-text text-transparent leading-tight">
                 Support at the speed <br /> of intelligence.
              </h2>
           </div>

           <div className="relative group/image">
              <div className="absolute -inset-4 bg-primary/10 blur-3xl rounded-[32px] opacity-0 group-hover/image:opacity-100 transition-opacity duration-1000" />
              <div className="relative border border-white/10 rounded-2xl overflow-hidden bg-black shadow-2xl scale-100 hover:scale-[1.02] transition-transform duration-700">
                 <div className="flex items-center gap-1.5 px-4 h-10 border-b border-white/10 bg-white/[0.02]">
                    <div className="h-2 w-2 rounded-full bg-white/10" />
                    <div className="h-2 w-2 rounded-full bg-white/10" />
                    <div className="h-2 w-2 rounded-full bg-white/10" />
                 </div>
                 <img src={DashboardImg} alt="Platform Dashboard" className="w-full h-auto opacity-80 group-hover/image:opacity-100 transition-opacity duration-700" />
              </div>
           </div>
        </div>
      </div>

    </div >
  )
}

export default Login