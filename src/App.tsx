import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { CartProvider } from '@/context/CartContext';
import { StoreProvider, useStore } from '@/context/StoreContext';
import Header from '@/components/Header';
import MobileSidebar from '@/components/MobileSidebar';

import Index from './pages/Index';
import CategoryPage from './pages/CategoryPage';
import ProductPage from './pages/ProductPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import PromotionsPage from './pages/PromotionsPage';
import CategoriesPage from './pages/CategoriesPage';
import NotFound from './pages/NotFound';

import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminOrders from './pages/admin/AdminOrders';
import AdminProducts from './pages/admin/AdminProducts';
import AdminCategories from './pages/admin/AdminCategories';
import AdminTariffs from './pages/admin/AdminTariffs';

const queryClient = new QueryClient();

function AdminRoute({ children }: { children: React.ReactNode }) {
  const { isAdmin } = useStore();
  return isAdmin ? <>{children}</> : <Navigate to="/admin" replace />;
}

function AppContent() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="max-w-md mx-auto min-h-screen bg-background relative">
      <MobileSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <Routes>
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
        <Route path="/admin/orders" element={<AdminRoute><AdminOrders /></AdminRoute>} />
        <Route path="/admin/products" element={<AdminRoute><AdminProducts /></AdminRoute>} />
        <Route path="/admin/categories" element={<AdminRoute><AdminCategories /></AdminRoute>} />
        <Route path="/admin/tariffs" element={<AdminRoute><AdminTariffs /></AdminRoute>} />
        <Route
          path="*"
          element={
            <>
              <Header onMenuOpen={() => setSidebarOpen(true)} />
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/categorie/:id" element={<CategoryPage />} />
                <Route path="/produit/:id" element={<ProductPage />} />
                <Route path="/panier" element={<CartPage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/promotions" element={<PromotionsPage />} />
                <Route path="/categories" element={<CategoriesPage />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </>
          }
        />
      </Routes>
    </div>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Sonner />
      <StoreProvider>
        <CartProvider>
          <BrowserRouter>
            <AppContent />
          </BrowserRouter>
        </CartProvider>
      </StoreProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
