import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BookOpen } from "lucide-react";
import { useAuthStore } from "@/stores/authStore";
import { useUIStore } from "@/stores/uiStore";

export const TopNav = () => {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const openAuth = useUIStore((s) => s.openAuth);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-primary" />
            <span className="text-xl font-serif font-semibold">Mandarin Lab</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link
              to="/"
              className="text-sm font-medium hover:text-primary transition-smooth"
            >
              Home
            </Link>
            <Link
              to="/services"
              className="text-sm font-medium hover:text-primary transition-smooth"
            >
              Services
            </Link>

            <Link
              to="/about"
              className="text-sm font-medium hover:text-primary transition-smooth"
            >
              About us
            </Link>

          </div>

          <div className="flex items-center gap-3">
            {user ? (
              <Button variant="outline" onClick={logout} size="sm">
                Logout
              </Button>
            ) : (
              <Button
                className="rounded-full bg-primary text-primary-foreground shadow-lg px-8 py-3 text-lg font-semibold hover:bg-primary/90 transition-all border-0"
                size="lg"
                onClick={openAuth}
              >
                Get Started
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
