import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../Components/ui/button";
import { Ticket, Cpu, Zap, Shield, ArrowRight, Send, Sparkles, Fingerprint } from "lucide-react";
import Navbar from "../Components/Navbar";

// Local Assets
import DashboardImg from "../assets/Dashboard.png";
import AiTriageImg from "../assets/ai-triage.png";
import AdminWorkspaceImg from "../assets/admin-workspace.png";
import NewTicketImg from "../assets/New-ticket.png";
import ResolutionImg from "../assets/resolution.png";
import TriageProcessingImg from "../assets/triage-processing.png";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#020203] text-white selection:bg-primary/30 selection:text-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        {/* Background Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-primary/10 blur-[120px] rounded-full pointer-events-none -z-10 opacity-50" />

        <div className="max-w-6xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] font-medium tracking-wide uppercase text-white/60 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <Zap className="h-3 w-3 text-primary" />
            <span>Powering Next-Gen Support</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-100">
            The AI-native ticketing <br className="hidden md:block" /> system for modern teams.
          </h1>

          <p className="max-w-2xl mx-auto text-lg md:text-xl text-white/50 mb-10 leading-relaxed animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-200">
            Automate triage, match experts instantly, and resolve tickets faster <br className="hidden md:block" /> with Gemini-powered intelligence.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-16 duration-1000 delay-300">
            <Link to="/Signup">
              <Button size="lg" className="px-8 h-12 text-sm font-semibold rounded-full group">
                Start Using Now
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="outline" size="lg" className="px-8 h-14 text-sm font-semibold rounded-full border-white/10 hover:border-white/20 hover:bg-white/10 transition-all">
                Log In
              </Button>
            </Link>
          </div>

          {/* Hero Product Shot */}
          <div className="mt-20 relative group animate-in fade-in zoom-in-95 duration-1000 delay-500">
            <div className="absolute inset-0 bg-primary/20 blur-[100px] rounded-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-1000" />
            <div className="relative border border-white/10 rounded-2xl overflow-hidden bg-[#080808a0] backdrop-blur-xl shadow-2xl">
              <div className="flex items-center gap-1.5 px-4 h-10 border-b border-white/10 bg-white/[0.02]">
                <div className="h-2 w-2 rounded-full bg-white/10" />
                <div className="h-2 w-2 rounded-full bg-white/10" />
                <div className="h-2 w-2 rounded-full bg-white/10" />
              </div>
              <img src={DashboardImg} alt="Dashboard Overview" className="w-full h-auto" />
            </div>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="py-24 border-t border-white/5 bg-[#020203]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-32">
            <div>
              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-6">
                <Cpu className="h-5 w-5" />
              </div>
              <h2 className="text-3xl font-bold mb-4 tracking-tight">AI-Powered Smart Triage</h2>
              <p className="text-white/50 text-lg leading-relaxed mb-6">
                Gemini analyzes every ticket instantly. It generates summaries, identifies priority, and extracts technical matches so your team can focus on solving, not sorting.
              </p>
              <ul className="space-y-3 text-sm text-white/40">
                <li className="flex items-center gap-2"><Zap className="h-3 w-3 text-primary" /> Automated Priority Detection</li>
                <li className="flex items-center gap-2"><Zap className="h-3 w-3 text-primary" /> Technical Skill Matching</li>
                <li className="flex items-center gap-2"><Zap className="h-3 w-3 text-primary" /> Instant AI Triage Notes</li>
              </ul>
            </div>
            <div className="border border-white/10 rounded-xl overflow-hidden bg-white/[0.02] shadow-2xl skew-x-1 group hover:skew-x-0 transition-transform duration-700">
              <img src={AiTriageImg} alt="AI Triage Intelligence" className="w-full opacity-80 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>

          {/* AI Workflow Timeline - "Changelog" Style */}
          <div className="mt-20 mb-40 animate-in fade-in slide-in-from-bottom-12 duration-1000 px-4">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-16 px-2">Thinking pipeline</h2>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-12 relative max-w-5xl mx-auto">
              {/* Timeline Connector Line */}
              <div className="hidden md:block absolute top-[11px] left-0 right-0 h-[1px] bg-white/5 -z-10" />

              {[
                {
                  step: "Ingestion",
                  title: "Ticket Captured",
                  desc: "Inngest hooks intercept support events as they happen.",
                  icon: <Send className="h-4 w-4" />,
                  active: true
                },
                {
                  step: "Analysis",
                  title: "Gemini Analysis",
                  desc: "Gemini 2.0 Flash Lite extracts technical context & sentiment.",
                  icon: <Sparkles className="h-4 w-4" />,
                  active: false
                },
                {
                  step: "Matching",
                  title: "Skill Selection",
                  desc: "Triage Agent finds the moderator with the highest expertise score.",
                  icon: <Fingerprint className="h-4 w-4" />,
                  active: false
                },
                {
                  step: "Routing",
                  title: "Deep Routing",
                  desc: "Direct push to resolution threads with AI-drafted replies.",
                  icon: <Zap className="h-4 w-4" />,
                  active: false
                }
              ].map((item, i) => (
                <div key={i} className="flex flex-col gap-6 group relative">
                  {/* Step Connector (Mobile only) */}
                  <div className="md:hidden absolute left-[19px] top-12 bottom-0 w-[1px] bg-white/5 -z-10" />

                  <div className="flex items-center gap-6 md:block">
                    <div className={`relative h-10 w-10 rounded-xl border flex items-center justify-center transition-all duration-700 md:mb-6 
                      ${item.active
                        ? 'bg-primary/20 border-primary shadow-[0_0_20px_-5px_rgba(255,255,255,0.2)] text-primary'
                        : 'bg-white/[0.03] border-white/10 group-hover:border-white/20 text-white/40 group-hover:text-white'}`}>
                      {item.icon}

                      {/* Active Pulse */}
                      {item.active && (
                        <div className="absolute -inset-1 bg-primary/20 rounded-xl blur-sm animate-pulse -z-10" />
                      )}
                    </div>

                    <div className="md:hidden">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-primary/60 mb-1 block">{item.step}</span>
                      <h4 className="text-sm font-bold text-white group-hover:text-primary transition-colors">{item.title}</h4>
                    </div>
                  </div>

                  <div className="hidden md:block">
                    <h4 className="text-sm font-bold text-white mb-2 group-hover:text-primary transition-colors">{item.title}</h4>
                    <p className="text-xs text-white/40 leading-relaxed font-medium">
                      {item.desc}
                    </p>
                  </div>

                  <div className="md:hidden">
                    <p className="text-xs text-white/40 leading-relaxed font-medium pr-8">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-32">
            <div className="order-2 md:order-1 border border-white/10 rounded-xl overflow-hidden bg-white/[0.02] shadow-2xl -skew-x-1 group hover:skew-x-0 transition-transform duration-700">
              <img src={AdminWorkspaceImg} alt="Admin Routing Control" className="w-full opacity-80 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="order-1 md:order-2">
              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-6">
                <Shield className="h-5 w-5" />
              </div>
              <h2 className="text-3xl font-bold mb-4 tracking-tight">Enterprise-Grade Routing</h2>
              <p className="text-white/50 text-lg leading-relaxed mb-6">
                Manage users and access levels with precision. AI automatically routes tickets to the moderator with the best technical skill match.
              </p>
              <ul className="space-y-3 text-sm text-white/40">
                <li className="flex items-center gap-2"><Zap className="h-3 w-3 text-primary" /> Role-based Access Controls</li>
                <li className="flex items-center gap-2"><Zap className="h-3 w-3 text-primary" /> Global Skill Directory</li>
                <li className="flex items-center gap-2"><Zap className="h-3 w-3 text-primary" /> Automated Moderator Assignment</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Mini Feature Rows */}
      <section className="py-24 bg-[#050505]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold tracking-tight bg-gradient-to-b from-white to-white/40 bg-clip-text text-transparent">Built for Speed.</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: "Resolution Thread", img: ResolutionImg, desc: "Collaborate seamlessly with direct AI-assisted drafting." },
              { title: "Smart Forms", img: NewTicketImg, desc: "AI understands context while users type their issues." },
              { title: "Global Tracking", img: DashboardImg, desc: "A unified view of all active support queues." }
            ].map((feature, i) => (
              <div key={i} className="p-1 rounded-2xl bg-gradient-to-b from-white/10 to-transparent">
                <div className="h-full bg-black rounded-2xl border border-white/5 p-6 flex flex-col">
                  <h3 className="font-semibold mb-2">{feature.title}</h3>
                  <p className="text-xs text-white/40 mb-6 leading-relaxed">{feature.desc}</p>
                  <div className="mt-auto border border-white/10 rounded-lg overflow-hidden">
                    <img src={feature.img} alt={feature.title} className="w-full opacity-60 hover:opacity-100 transition-opacity" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA - Side-by-Side Presentation */}
      <section className="py-40 relative group overflow-hidden border-t border-white/5 bg-[#010102]">
        <div className="max-w-6xl mx-auto px-6 relative z-10">
          {/* Section Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-primary/5 blur-[120px] rounded-full pointer-events-none -z-10" />

          <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-16 items-center">
            {/* Left Side: Visual Proof */}
            <div className="relative group/image animate-in fade-in slide-in-from-left-8 duration-1000">
              <div className="absolute -inset-4 bg-white/5 blur-2xl rounded-[32px] opacity-0 group-hover/image:opacity-100 transition-opacity duration-1000" />
              <div className="relative border border-white/10 rounded-2xl overflow-hidden bg-black shadow-2xl">
                <div className="flex items-center gap-1.5 px-4 h-10 border-b border-white/10 bg-white/[0.02]">
                  <div className="h-2 w-2 rounded-full bg-white/10" />
                  <div className="h-2 w-2 rounded-full bg-white/10" />
                  <div className="h-2 w-2 rounded-full bg-white/10" />
                </div>
                <img src={TriageProcessingImg} alt="Intelligence at work" className="w-full h-auto opacity-80 group-hover/image:opacity-100 transition-opacity duration-700" />
              </div>
            </div>

            {/* Right Side: CTA Component */}
            <div className="text-left animate-in fade-in slide-in-from-right-8 duration-1000">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold tracking-widest uppercase text-primary mb-8">
                Automation at Scale
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight bg-gradient-to-b from-white to-white/40 bg-clip-text text-transparent">
                Experience support, <br /> evolved.
              </h2>
              <p className="text-white/50 mb-10 text-lg leading-relaxed max-w-md">
                Discover a ticketing system that actually thinks. Automate the triage bottleneck and empower your team to solve what matters.
              </p>
              <div className="flex items-center gap-6 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
                <Link to="/Signup">
                  <Button size="lg" className="px-10 h-14 text-sm font-bold rounded-full bg-white text-black hover:bg-white/90 transition-all active:scale-95 group/btn shadow-sm">
                    Start Using Now
                    <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link to="/login">
                  <Button variant="outline" size="lg" className="px-8 h-14 text-sm font-semibold rounded-full border-white/10 hover:border-white/20 hover:bg-white/10 transition-all">
                    Log In
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-24 border-t border-white/5 bg-[#010102]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16 px-4">
            {/* Logo and Tagline Column */}
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-3 group mb-6">
                <div className="bg-primary/20 text-primary p-2.5 rounded-xl group-hover:scale-110 transition-transform duration-300">
                  <Ticket className="h-6 w-6" />
                </div>
                <span className="text-2xl font-bold tracking-tighter text-white">Ticket AI</span>
              </div>
              <div className="relative inline-block group">
                <p className="text-xl font-bold text-white tracking-tight leading-tight">
                  Support at the speed <br /> of intelligence.
                </p>
                <div className="h-1 w-12 bg-primary/60 rounded-full mt-3 group-hover:w-20 transition-all duration-500" />
              </div>
            </div>

            {/* Product Column */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-white/40 mb-6">Product</h4>
              <ul className="space-y-4 text-sm text-white/40 font-medium">
                <li><Link to="/" className="hover:text-white transition-colors">Features</Link></li>
                <li><Link to="/" className="hover:text-white transition-colors">AI Triage</Link></li>
                <li><Link to="/" className="hover:text-white transition-colors">Pricing</Link></li>
                <li><Link to="/" className="hover:text-white transition-colors">Security</Link></li>
              </ul>
            </div>

            {/* Company Column */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-white/40 mb-6">Company</h4>
              <ul className="space-y-4 text-sm text-white/40 font-medium">
                <li><Link to="/" className="hover:text-white transition-colors">About</Link></li>
                <li><Link to="/" className="hover:text-white transition-colors">Blog</Link></li>
                <li><Link to="/" className="hover:text-white transition-colors">Careers</Link></li>
                <li><a href="https://github.com/akshayWork-19/Ticket-Assistant" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Github</a></li>
              </ul>
            </div>
          </div>

          <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-[11px] font-medium uppercase tracking-widest text-white/20">
            <p>© 2026 Ticket AI Inc. All Rights Reserved.</p>
            <div className="flex gap-8">
              <Link to="/" className="hover:text-white transition-colors">Privacy Policy</Link>
              <Link to="/" className="hover:text-white transition-colors">Terms of Service</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
