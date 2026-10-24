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
      <div className="bg-[#050506] border-b border-[#C9A86C]/15 py-1.5 px-4 text-center text-[11px] uppercase tracking-[0.25em] text-[#C9A86C] flex items-center justify-center gap-2">
        <Sparkles size={12} className="text-[#DFC48F] animate-pulse" />
        <span>Maison Mirage • Envio Seguro com Lacre Inviolável • Amostras de Alta Perfumaria Inclusas</span>
      </div>

      {/* Main Navbar */}
      <div
        className={`w-full transition-all duration-300 ${
          isScrolled
            ? 'bg-[#070708]/95 backdrop-blur-md border-b border-[#C9A86C]/15 shadow-2xl py-3.5'
            : 'bg-gradient-to-b from-[#070708]/90 to-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          
          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-[#F8F6F0] hover:text-[#C9A86C] p-2 transition-colors"
              aria-label="Abrir menu"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>

          {/* Brand Logo */}
          <div 
            onClick={() => onNavigate('home')}
            className="cursor-pointer flex flex-col items-start text-left group select-none mr-auto ml-2 md:ml-0 md:mr-8 lg:mr-12 shrink-0"
          >
            <div className="flex items-center gap-2">
              <span className="font-cinzel text-xl sm:text-2xl lg:text-3xl font-medium tracking-[0.28em] text-[#F8F6F0] group-hover:text-[#E8D5B7] transition-colors uppercase">
                Mirage
              </span>
              <span className="font-cinzel text-xs text-[#C9A86C] tracking-[0.35em] font-normal uppercase mt-0.5">
                Parfum
              </span>
            </div>
            <span className="text-[9px] uppercase tracking-[0.35em] text-[#8C7650] mt-0.5 group-hover:text-[#C9A86C] transition-colors">
              Haute Parfumerie
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <button
                key={link.view}
                onClick={() => onNavigate(link.view)}
                className={`text-xs uppercase tracking-[0.2em] font-medium transition-all duration-200 relative py-1 hover:text-[#C9A86C] ${
                  currentView === link.view
                    ? 'text-[#C9A86C]'
                    : 'text-[#D1CEC7]'
                }`}
              >
                {link.label}
                {currentView === link.view && (
                  <span className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-[#C9A86C]" />
                )}
              </button>
            ))}
          </nav>

          {/* Action Icons */}
          <div className="flex items-center space-x-4 sm:space-x-5">
            {/* Search */}
            <button
              onClick={onOpenSearch}
              className="text-[#D1CEC7] hover:text-[#C9A86C] p-2 transition-colors relative"
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
              className="hidden lg:flex items-center gap-1.5 text-[11px] uppercase tracking-[0.15em] text-[#C9A86C] hover:text-[#E8D5B7] border border-[#C9A86C]/30 px-3 py-1.5 rounded-sm hover:border-[#C9A86C] transition-all"
            >
              <MessageCircle size={14} />
              <span>Concierge</span>
            </a>

            {/* Wishlist */}
            <button
              onClick={() => onNavigate('wishlist')}
              className="text-[#D1CEC7] hover:text-[#C9A86C] p-2 transition-colors relative"
              title="Fragrâncias favoritas"
              aria-label="Favoritos"
            >
              <Heart size={19} className={wishlist.length > 0 ? 'text-[#C9A86C] fill-[#C9A86C]/20' : ''} />
              {wishlist.length > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-[#C9A86C] text-[#070708] font-bold text-[9px] rounded-full flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Cart Trigger */}
            <button
              onClick={() => setIsCartDrawerOpen(true)}
              className="flex items-center gap-2 bg-[#121217] hover:bg-[#1a1a22] border border-[#C9A86C]/40 hover:border-[#C9A86C] text-[#F8F6F0] px-3.5 py-1.5 rounded-sm transition-all relative group"
              aria-label="Sacola de compras"
            >
              <ShoppingBag size={18} className="text-[#C9A86C] group-hover:scale-105 transition-transform" />
              <span className="text-xs font-medium tracking-wider hidden sm:inline text-[#E8D5B7]">
                Sacola
              </span>
              <span className="w-5 h-5 bg-[#C9A86C] text-[#070708] font-bold text-[10px] rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#0a0a0d] border-b border-[#C9A86C]/20 px-6 py-6 space-y-4 animate-in slide-in-from-top-4 duration-300">
            {navLinks.map((link) => (
              <button
                key={link.view}
                onClick={() => {
                  onNavigate(link.view);
                  setMobileMenuOpen(false);
                }}
                className={`block w-full text-left py-2 text-xs uppercase tracking-[0.25em] font-medium transition-colors ${
                  currentView === link.view ? 'text-[#C9A86C]' : 'text-[#D1CEC7] hover:text-[#C9A86C]'
                }`}
              >
                {link.label}
              </button>
            ))}

            <div className="pt-4 border-t border-[#C9A86C]/15 flex flex-col gap-3">
              <a
                href={`https://api.whatsapp.com/send?phone=${MIRAGE_WHATSAPP_NUMBER}&text=${encodeURIComponent('Olá, gostaria de um atendimento com o Concierge Mirage Parfum.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 text-xs uppercase tracking-[0.15em] text-[#070708] bg-[#C9A86C] font-semibold py-2.5 rounded-sm"
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
