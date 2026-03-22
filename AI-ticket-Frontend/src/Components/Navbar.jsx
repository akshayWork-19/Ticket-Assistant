import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Ticket } from "lucide-react";
import { toast } from "sonner";

export default function Navbar() {
  const token = localStorage.getItem("token");
  let user = localStorage.getItem("user");
  if (user) {
    user = JSON.parse(user);
  }
  const navigate = useNavigate();
  const location = useLocation();

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-6xl mx-auto flex h-14 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="bg-primary/20 text-primary p-1.5 rounded-lg group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
              <Ticket className="h-4 w-4" />
            </div>
            <span className="font-bold tracking-tight text-white/90 group-hover:text-white transition-colors">Ticket AI</span>

          </Link>

          {token && (
            <div className="hidden md:flex items-center gap-6 ml-4">
              <Link to="/"
                className={`text-sm font-semibold transition-colors hover:text-white ${isActive('/') ? 'text-white' : 'text-muted-foreground'}`}>
                Dashboard
              </Link>
              {user?.role === "admin" && (
                <Link
                  to="/Admin"
                  className={`text-sm font-semibold transition-colors hover:text-white ${isActive('/Admin') ? 'text-white' : 'text-muted-foreground'}`}
                >
                  Admin Panel
                </Link>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center gap-4">
          {!token ? (
            <>
              <Link to="/login">
                <Button variant="ghost" size="sm" className="font-semibold text-muted-foreground hover:text-white">Login</Button>
              </Link>
              <Link to="/Signup">
                <Button size="sm" className="font-bold uppercase tracking-wider text-[10px]">Sign Up</Button>
              </Link>
            </>
          ) : (
            <div className="flex items-center gap-4">
              {/* User Identity Info */}
              <div className="hidden sm:flex flex-col items-end">
                <span className="text-sm font-semibold leading-none text-white/80">{user?.email?.split('@')[0]}</span>
                <span className="text-[10px] text-primary uppercase font-bold tracking-wider">{user?.role || 'User'}</span>
              </div>

              {/* Modern Avatar instead of raw text */}
              <Link to="/profile">

                <Avatar className="h-8 w-8 border border-border/50 transition-transform hover:scale-110 hover:ring-2 ring-primary/40 shadow-sm cursor-pointer">
                  <AvatarImage src={user?.avatarUrl || `https://api.dicebear.com/7.x/notionists/svg?seed=${user?.email}`} />
                  <AvatarFallback className="bg-muted text-muted-foreground text-xs font-bold">
                    {user?.email?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </Link>
              <div className="h-4 w-px bg-border/50 mx-1 hidden sm:block"></div>
              <Button onClick={logout} variant="secondary" size="sm" className="font-bold uppercase tracking-wider text-[10px] ml-1">
                Logout
              </Button>
            </div>
          )}

        </div>

      </div>

    </nav>
  );
}