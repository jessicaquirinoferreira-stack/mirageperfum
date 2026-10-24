import React, { useState, useEffect } from 'react';
import { Product, Order } from './types';
import { INITIAL_PRODUCTS } from './data/initialProducts';
import { getProductsService } from './lib/firebase';
import { CartProvider } from './context/CartContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { SearchModal } from './components/SearchModal';
import { LoadingScreen } from './components/LoadingScreen';
import { VirtualAssistant } from './components/VirtualAssistant';

import { preloadAllSiteImages } from './lib/preloadImages';

// Pages
import { HomePage } from './pages/HomePage';
import { CatalogPage } from './pages/CatalogPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderSuccessPage } from './pages/OrderSuccessPage';
import { NotesGuidePage } from './pages/NotesGuidePage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { WishlistPage } from './pages/WishlistPage';
import { TermsPage } from './pages/TermsPage';
import { AdminDashboard } from './pages/AdminDashboard';

export default function App() {
  const [currentView, setCurrentView] = useState<string>('home');
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isLoadingInitial, setIsLoadingInitial] = useState(true);

  // Fetch live products from Firebase
  const loadProducts = async () => {
    try {
      const data = await getProductsService();
      if (data && data.length > 0) {
        setProducts(data);
      }
    } catch (err) {
      console.warn('Using local catalog initial seed:', err);
    }
  };

  useEffect(() => {
    preloadAllSiteImages();
    loadProducts();
  }, []);

  const handleNavigate = (view: string, data?: any) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (view === 'product-detail' && data) {
      setSelectedProduct(data);
    }
    setCurrentView(view);
  };

  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setCurrentView('product-detail');
  };

  const handleOrderCompleted = (order: Order) => {
    setCompletedOrder(order);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setCurrentView('order-success');
  };

  return (
    <CartProvider>
      {/* Intro Cinematographic Loading */}
      {isLoadingInitial && (
        <LoadingScreen onComplete={() => setIsLoadingInitial(false)} />
      )}

      <div className="min-h-screen flex flex-col bg-[#070708] text-[#F8F6F0] selection:bg-[#C9A86C]/30 selection:text-[#F8F6F0]">
        
        {/* Global Navigation Header (hidden on admin page for full-screen console experience) */}
        {currentView !== 'admin' && (
          <Header
            currentView={currentView}
            onNavigate={handleNavigate}
            onOpenSearch={() => setIsSearchOpen(true)}
          />
        )}

        {/* Main Content Area */}
        <main className="flex-grow">
          {currentView === 'home' && (
            <HomePage
              products={products}
              onSelectProduct={handleSelectProduct}
              onNavigate={handleNavigate}
            />
          )}

          {currentView === 'catalog' && (
            <CatalogPage
              products={products}
              onSelectProduct={handleSelectProduct}
            />
          )}

          {currentView === 'product-detail' && selectedProduct && (
            <ProductDetailPage
              product={selectedProduct}
              allProducts={products}
              onBack={() => handleNavigate('catalog')}
              onSelectProduct={handleSelectProduct}
              onProceedToCheckout={() => handleNavigate('checkout')}
            />
          )}

          {currentView === 'checkout' && (
            <CheckoutPage
              onOrderCompleted={handleOrderCompleted}
              onBackToCart={() => handleNavigate('catalog')}
            />
          )}

          {currentView === 'order-success' && completedOrder && (
            <OrderSuccessPage
              order={completedOrder}
              onContinueShopping={() => handleNavigate('home')}
            />
          )}

          {currentView === 'notes-guide' && (
            <NotesGuidePage
              products={products}
              onSelectProduct={handleSelectProduct}
              onNavigateCatalog={() => handleNavigate('catalog')}
            />
          )}

          {currentView === 'about' && (
            <AboutPage onNavigateCatalog={() => handleNavigate('catalog')} />
          )}

          {currentView === 'contact' && <ContactPage />}

          {currentView === 'wishlist' && (
            <WishlistPage
              onSelectProduct={handleSelectProduct}
              onExploreCatalog={() => handleNavigate('catalog')}
            />
          )}

          {currentView === 'terms' && <TermsPage />}

          {currentView === 'admin' && (
            <AdminDashboard
              onNavigateHome={() => handleNavigate('home')}
              onRefreshProducts={loadProducts}
            />
          )}
        </main>

        {/* Global Slide-Over Cart Drawer */}
        <CartDrawer
          onProceedToCheckout={() => handleNavigate('checkout')}
          onExploreMore={() => handleNavigate('catalog')}
        />

        {/* Global Full-Screen Search Modal */}
        <SearchModal
          isOpen={isSearchOpen}
          onClose={() => setIsSearchOpen(false)}
          products={products}
          onSelectProduct={handleSelectProduct}
        />

        {/* Virtual Fragrance Assistant Éléonore on the left */}
        {currentView !== 'admin' && (
          <VirtualAssistant
            products={products}
            onSelectProduct={handleSelectProduct}
          />
        )}

        {/* Global Footer (shows center Admin link on all non-admin views) */}
        {currentView !== 'admin' && <Footer onNavigate={handleNavigate} />}
      </div>
    </CartProvider>
  );
}
