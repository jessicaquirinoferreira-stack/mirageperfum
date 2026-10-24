import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { Search, ShoppingBag, Heart, Menu, X, Sparkles, MessageCircle } from 'lucide-react';
import { MIRAGE_WHATSAPP_NUMBER } from '../lib/whatsapp';

interface HeaderProps {
  currentView: string;
  onNavigate: (view: string, data?: any) => void;
  onOpenSearch: () => void;
}

export const Header: React.FC<HeaderProps> = ({ currentView, onNavigate, onOpenSearch }) => {
  const { cartCount, setIsCartDrawerOpen, wishlist } = useCart();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Início', view: 'home' },
    { label: 'Coleções', view: 'catalog' },
    { label: 'Pirâmide Olfativa', view: 'notes-guide' },
    { label: 'A Maison', view: 'about' },
    { label: 'Contato', view: 'contact' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full transition-all duration-300">
      {/* Top Luxury Announcement Bar */}
      <div className="bg-[#F2ECE1] border-b border-[#B89753]/20 py-1.5 px-4 text-center text-[11px] uppercase tracking-[0.25em] text-[#8C6F3C] flex items-center justify-center gap-2 font-medium">
        <Sparkles size={12} className="text-[#B89753] animate-pulse" />
        <span>Maison Mirage • Envio Seguro com Lacre Inviolável • Amostras de Alta Perfumaria Inclusas</span>
      </div>

      {/* Main Navbar */}
      <div
        className={`w-full transition-all duration-300 ${
          isScrolled
            ? 'bg-[#FFFFFF]/95 backdrop-blur-md border-b border-[#B89753]/20 shadow-md py-3.5'
            : 'bg-[#FAF8F5]/95 backdrop-blur-sm border-b border-[#B89753]/10 py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          
          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-[#1A1A1E] hover:text-[#B89753] p-2 transition-colors"
              aria-label="Abrir menu"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>

          <div 
            onClick={() => onNavigate('home')}
            className="cursor-pointer flex items-center group select-none mr-auto ml-2 md:ml-0 md:mr-8 lg:mr-12 shrink-0"
          >
            <img 
              src="https://i.postimg.cc/7ZKWrN26/Whats-App-Image-2026-10-24-at-14-13-41.jpg" 
              alt="Mirage Parfum" 
              className="h-10 sm:h-12 w-auto object-contain rounded shadow-sm"
            />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-3 lg:space-x-7">
            {navLinks.map((link) => (
              <button
                key={link.view}
                onClick={() => onNavigate(link.view)}
                className={`text-[11px] lg:text-xs uppercase tracking-[0.18em] font-medium transition-all duration-200 relative py-1 hover:text-[#B89753] ${
                  currentView === link.view
                    ? 'text-[#B89753] font-semibold'
                    : 'text-[#4A463E]'
                }`}
              >
                {link.label}
                {currentView === link.view && (
                  <span className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-[#B89753]" />
                )}
              </button>
            ))}
          </nav>

          {/* Action Icons */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            {/* Search */}
            <button
              onClick={onOpenSearch}
              className="text-[#6A665C] hover:text-[#B89753] p-2 transition-colors relative"
              title="Buscar fragrância"
              aria-label="Buscar fragrância"
            >
              <Search size={19} />
            </button>

            {/* Concierge direct WhatsApp */}
            <a
              href={`https://api.whatsapp.com/send?phone=${MIRAGE_WHATSAPP_NUMBER}&text=${encodeURIComponent('Olá, gostaria de falar com o Concierge da Mirage Parfum.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden lg:flex items-center gap-1.5 text-[11px] uppercase tracking-[0.15em] text-[#8C6F3C] hover:text-[#1A1A1E] border border-[#B89753]/40 px-3 py-1.5 rounded-sm hover:border-[#B89753] transition-all bg-white/60"
            >
              <MessageCircle size={14} className="text-[#B89753]" />
              <span>Concierge</span>
            </a>

            {/* Wishlist */}
            <button
              onClick={() => onNavigate('wishlist')}
              className="text-[#6A665C] hover:text-[#B89753] p-2 transition-colors relative"
              title="Fragrâncias favoritas"
              aria-label="Favoritos"
            >
              <Heart size={19} className={wishlist.length > 0 ? 'text-[#B89753] fill-[#B89753]/20' : ''} />
              {wishlist.length > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-[#B89753] text-white font-bold text-[9px] rounded-full flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Cart Trigger */}
            <button
              onClick={() => setIsCartDrawerOpen(true)}
              className="flex items-center gap-2 bg-[#1A1A1E] hover:bg-[#B89753] border border-[#B89753]/50 text-[#F8F6F0] px-3.5 py-1.5 rounded-sm transition-all relative group shadow-sm"
              aria-label="Sacola de compras"
            >
              <ShoppingBag size={18} className="text-[#C9A86C] group-hover:text-white transition-colors" />
              <span className="text-xs font-medium tracking-wider hidden sm:inline text-[#E8D5B7] group-hover:text-white">
                Sacola
              </span>
              <span className="w-5 h-5 bg-[#B89753] text-white font-bold text-[10px] rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#FAF8F5] border-b border-[#B89753]/25 px-6 py-6 space-y-4 animate-in slide-in-from-top-4 duration-300 shadow-xl">
            {navLinks.map((link) => (
              <button
                key={link.view}
                onClick={() => {
                  onNavigate(link.view);
                  setMobileMenuOpen(false);
                }}
                className={`block w-full text-left py-2.5 text-xs uppercase tracking-[0.25em] font-medium border-b border-[#B89753]/10 transition-colors ${
                  currentView === link.view ? 'text-[#B89753] font-bold' : 'text-[#1A1A1E] hover:text-[#B89753]'
                }`}
              >
                {link.label}
              </button>
            ))}

            <div className="pt-3 flex flex-col gap-3">
              <a
                href={`https://api.whatsapp.com/send?phone=${MIRAGE_WHATSAPP_NUMBER}&text=${encodeURIComponent('Olá, gostaria de um atendimento com o Concierge Mirage Parfum.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 text-xs uppercase tracking-[0.15em] text-white bg-[#B89753] hover:bg-[#8C6F3C] font-semibold py-3 rounded-sm shadow-sm"
              >
                <MessageCircle size={15} />
                <span>Atendimento WhatsApp</span>
              </a>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
