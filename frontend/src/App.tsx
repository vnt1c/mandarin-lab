import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ApiError } from "@/lib/apiClient";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";
import { SideNav } from "@/components/layout/SideNav";
import Landing from "./pages/Landing";
import Breakdown from "./pages/Breakdown";
import Dictionary from "./pages/Dictionary";
import Saved from "./pages/Saved";
import { X, MessageCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { TutorChat } from "@/components/tutor/TutorChat";
import Services from "./pages/Services";
import About from "./pages/About";
import NotFound from "./pages/NotFound";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-watercolor.jpg";
import AuthCallback from "./pages/AuthCallback";
import { AuthModal } from "@/components/auth/AuthModal";
import { useUIStore } from "@/stores/uiStore";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const user = useAuthStore((s) => s.user);
  const initialized = useAuthStore((s) => s.initialized);

  if (!initialized) return null; // or a spinner
  return user ? <>{children}</> : <Navigate to="/" replace />;
};

/**
 * Owns the whole authenticated chrome: the fixed sidebar, the `ml-64` gutter
 * that clears it, and the content column. Pages render their content only —
 * rendering SideNav again there would stack a second fixed <aside> and nest
 * one <main> inside another.
 */
const AuthenticatedLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex min-h-screen w-full">
      <SideNav />
      <main className="flex-1 ml-64 p-8">
        <div className="max-w-4xl mx-auto">{children}</div>
      </main>
    </div>
  );
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      // A 4xx means the request itself was wrong; retrying just repeats it.
      retry: (failureCount, error) =>
        error instanceof ApiError && error.isClientError
          ? false
          : failureCount < 2,
    },
  },
});

const App = () => {
  const user = useAuthStore((state) => state.user);
  const init = useAuthStore((s) => s.init);
  const [open, setOpen] = useState(false);

  // Global auth modal state (single mount)
  const authOpen = useUIStore((s) => s.authOpen);
  const setAuthOpen = useUIStore((s) => s.setAuthOpen);

  useEffect(() => {
    let cleanup: undefined | (() => void);

    init().then((unsub) => {
      cleanup = unsub;
    });

    return () => {
      cleanup?.();
    };
  }, [init]);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <BrowserRouter>
          {/* Single global auth modal mount */}
          <AuthModal open={authOpen} onOpenChange={setAuthOpen} />

          {/* Global background image for authenticated area */}
          {user && (
            <div
              aria-hidden="true"
              className="fixed inset-0 -z-10 pointer-events-none"
              style={{
                backgroundImage: `url(${heroImage})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                opacity: 0.15,
                width: "100vw",
                height: "100vh",
              }}
            />
          )}

          <Routes>
            <Route
              path="/"
              element={user ? <Navigate to="/breakdown" replace /> : <Landing />}
            />

            {/* OAuth callback landing pad */}
            <Route path="/auth/callback" element={<AuthCallback />} />

            {/* Public pages */}
            <Route path="/services" element={<Services />} />

            <Route path="/about" element={<About />} />


            {/* Protected pages */}
            <Route
              path="/breakdown"
              element={
                <ProtectedRoute>
                  <AuthenticatedLayout>
                    <Breakdown />
                  </AuthenticatedLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/dictionary"
              element={
                <ProtectedRoute>
                  <AuthenticatedLayout>
                    <Dictionary />
                  </AuthenticatedLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/saved"
              element={
                <ProtectedRoute>
                  <AuthenticatedLayout>
                    <Saved />
                  </AuthenticatedLayout>
                </ProtectedRoute>
              }
            />

            <Route path="*" element={<NotFound />} />
          </Routes>

          {/* Floating Ask AI Button and Chat Panel */}
          {user && !open && (
            <Button
              type="button"
              onClick={() => setOpen(true)}
              className="fixed z-50 bottom-6 right-6 text-lg flex items-center gap-2 rounded-full px-6 h-14 shadow-lg"
              variant="default"
              size="lg"
              aria-label="Ask AI"
            >
              <MessageCircle className="w-5 h-5" />
              Ask AI
            </Button>
          )}

          {user && open && (
            <div
              className="fixed z-50 bottom-6 right-6 w-full max-w-md bg-background border border-border rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 font-sans"
              style={{ height: "600px", maxHeight: "80vh" }}
            >
              <div className="flex items-center justify-between px-4 py-2 border-b bg-primary text-primary-foreground font-serif">
                <span className="font-semibold flex items-center gap-2">
                  <MessageCircle className="w-5 h-5" />
                  AI Tutor
                </span>
                <button
                  onClick={() => setOpen(false)}
                  aria-label="Close"
                  className="p-1 rounded hover:bg-primary/80 focus:outline-none"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="flex-1 min-h-0 bg-background font-sans flex flex-col">
                <TutorChat />
              </div>
            </div>
          )}
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
