import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";
import { SideNav } from "@/components/layout/SideNav";
import Landing from "./pages/Landing";
import Auth from "./pages/Auth";
import Breakdown from "./pages/Breakdown";
import Dictionary from "./pages/Dictionary";
import Saved from "./pages/Saved";
import Tutor from "./pages/Tutor";
import Services from "./pages/Services";
import Pricing from "./pages/Pricing";
import About from "./pages/About";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const user = useAuthStore((state) => state.user);
  return user ? <>{children}</> : <Navigate to="/auth" replace />;
};

const AuthenticatedLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex min-h-screen">
      <SideNav />
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
};

const queryClient = new QueryClient();

const App = () => {
  const user = useAuthStore((state) => state.user);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={user ? <Navigate to="/breakdown" replace /> : <Landing />} />
            <Route path="/auth" element={user ? <Navigate to="/breakdown" replace /> : <Auth />} />
            <Route path="/services" element={<Services />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            
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
            <Route
              path="/tutor"
              element={
                <ProtectedRoute>
                  <AuthenticatedLayout>
                    <Tutor />
                  </AuthenticatedLayout>
                </ProtectedRoute>
              }
            />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
