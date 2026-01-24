import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { BookOpen } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';

export const TopNav = () => {
  const { user, logout } = useAuthStore();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-primary" />
            <span className="text-xl font-serif font-semibold">Mandarin Lab</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-sm font-medium hover:text-primary transition-smooth">
              Home
            </Link>
            <Link to="/services" className="text-sm font-medium hover:text-primary transition-smooth">
              Services
            </Link>
            <Link to="/pricing" className="text-sm font-medium hover:text-primary transition-smooth">
              Pricing
            </Link>
            <Link to="/about" className="text-sm font-medium hover:text-primary transition-smooth">
              About us
            </Link>
            <Link to="/contact" className="text-sm font-medium hover:text-primary transition-smooth">
              Contact us
            </Link>
          </div>

          <div className="flex items-center gap-3">
            {user ? (
              <Button variant="outline" onClick={logout} size="sm">
                Logout
              </Button>
            ) : (
              <>
                <Link to="/auth">
                  <Button variant="ghost" size="sm">
                    Login
                  </Button>
                </Link>
                <Link to="/auth">
                  <Button size="sm">
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
