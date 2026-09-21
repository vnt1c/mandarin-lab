import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/stores/authStore';
import { 
  BookOpen, 
  BookText, 
  Bookmark,
  LogOut
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { path: '/breakdown', label: 'Sentence breakdown', icon: BookText },
  { path: '/dictionary', label: 'Dictionary', icon: BookOpen },
  { path: '/saved', label: 'Saved sentences', icon: Bookmark },
];

export const SideNav = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 glass-strong border-r flex flex-col">
      <div className="p-6 border-b">
        <Link to="/breakdown" className="flex items-center gap-2">
          <BookOpen className="h-6 w-6 text-primary" />
          <span className="text-xl font-serif font-semibold">Mandarin Lab</span>
        </Link>
      </div>

      <nav className="flex-1 p-4">
        <div className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link key={item.path} to={item.path}>
                <Button
                  variant={isActive ? 'secondary' : 'ghost'}
                  className={cn(
                    'w-full justify-start gap-3 transition-smooth',
                    isActive && 'bg-primary/10 text-primary hover:bg-primary/20'
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Button>
              </Link>
            );
          })}
        </div>
      </nav>

      <div className="p-4 border-t">
        <Button
          variant="ghost"
          onClick={() => {
            logout();
            navigate('/');
          }}
          className="w-full justify-start gap-3"
        >
          <LogOut className="h-4 w-4" />
          <span>Logout</span>
        </Button>
      </div>
    </aside>
  );
};
