import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Contexts
import { CartProvider } from "@/contexts/CartContext";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { LanguageProvider } from "@/contexts/LanguageContext";

// Components
import { CartSidebar } from "@/components/cart/CartSidebar";

// Pages
import Home from "@/pages/Home";
import About from "@/pages/About";
import Collections from "@/pages/Collections";
import Contact from "@/pages/Contact";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Profile from "@/pages/Profile";
import Success from "@/pages/Success";
import Cancel from "@/pages/Cancel";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

// Protected Route Component
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, canAccessCollections } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (!canAccessCollections()) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
}

// Auth Route - redirect if already logged in
function AuthRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
}

// Profile Route - requires authentication
function ProfileRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
}

function AppRoutes() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/collections" element={<Collections />} />
        <Route path="/contact" element={<Contact />} />
        
        {/* Auth Routes */}
        <Route 
          path="/login" 
          element={
            <AuthRoute>
              <Login />
            </AuthRoute>
          } 
        />
        <Route 
          path="/register" 
          element={
            <AuthRoute>
              <Register />
            </AuthRoute>
          } 
        />
        
        {/* Protected Routes */}
        <Route 
          path="/profile" 
          element={
            <ProfileRoute>
              <Profile />
            </ProfileRoute>
          } 
        />
        
        {/* Payment Routes */}
        <Route path="/success" element={<Success />} />
        <Route path="/sucesso" element={<Success />} />
        <Route path="/cancel" element={<Cancel />} />
        <Route path="/cancelado" element={<Cancel />} />
        
        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      
      {/* Global Cart Sidebar */}
      <CartSidebar />
    </>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <AuthProvider>
        <CartProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <AppRoutes />
            </BrowserRouter>
          </TooltipProvider>
        </CartProvider>
      </AuthProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
