import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { Header } from './components/Header';
import { DiwaliBanner } from './components/DiwaliBanner';
import { CartDrawer } from './components/CartDrawer';
import { WhatsAppButton } from './components/WhatsAppButton';
import { MobileBottomNav } from './components/MobileBottomNav';
import { Footer } from './components/Footer';
import { DomainModal } from './components/DomainModal';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Home } from './pages/Home';
import { Products } from './pages/Products';
import { Auth } from './pages/Auth';
import { Profile } from './pages/Profile';
import { MyOrders } from './pages/MyOrders';
import { Checkout } from './pages/Checkout';
import { OrderSuccess } from './pages/OrderSuccess';
import { Admin } from './pages/Admin';
import { Toaster } from 'sonner';

export default function App() {
  const [domainModalOpen, setDomainModalOpen] = useState(false);

  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <div className="min-h-screen bg-[#FAF6F0] flex flex-col justify-between selection:bg-[#D4AF37]/30 selection:text-[#2B090F] pb-16 md:pb-0">
            <div>
              <DiwaliBanner />
              <Header onOpenDomainGuide={() => setDomainModalOpen(true)} />
              <CartDrawer />
              <WhatsAppButton />

              <main>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/products" element={<Products />} />
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/my-orders" element={<MyOrders />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/order-success" element={<OrderSuccess />} />
                  <Route
                    path="/admin"
                    element={
                      <ProtectedRoute>
                        <Admin onOpenDomainGuide={() => setDomainModalOpen(true)} />
                      </ProtectedRoute>
                    }
                  />
                  <Route path="*" element={<Home />} />
                </Routes>
              </main>
            </div>

            <Footer onOpenDomainGuide={() => setDomainModalOpen(true)} />
            <MobileBottomNav />
            <DomainModal open={domainModalOpen} onOpenChange={setDomainModalOpen} />
            <Toaster position="top-right" richColors />
          </div>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
