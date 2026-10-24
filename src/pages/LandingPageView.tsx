import React, { useState } from 'react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { formatCurrency } from '../lib/shipping';
import { MIRAGE_WHATSAPP_NUMBER } from '../lib/whatsapp';
import { 
  Sparkles, 
  ShoppingBag, 
  ShieldCheck, 
  Truck, 
  Clock, 
  Wind, 
  Check, 
  MessageCircle, 
  ArrowRight,
  Award,
  Flame,
  Star,
  Copy,
  ExternalLink
} from 'lucide-react';

interface LandingPageViewProps {
  product: Product;
  onNavigate: (view: string, data?: any) => void;
  onProceedToCheckout: () => void;
}

export const LandingPageView: React.FC<LandingPageViewProps> = ({
  product,
  onNavigate,
  onProceedToCheckout,
}) => {
  const { addToCart } = useCart();
  const [selectedVolume, setSelectedVolume] = useState(product.volume || '100ml');
  const [quantity, setQuantity] = useState(1);
  const [showNotification, setShowNotification] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const currentPrice = product.promotionalPrice || product.price;
  const hasDiscount = !!product.promotionalPrice && product.promotionalPrice < product.price;
  const installments = (currentPrice / 10).toFixed(2).replace('.', ',');

  const handleBuy = () => {
    addToCart(product, selectedVolume, quantity);
    onProceedToCheckout();
  };

  const handleAddToCartOnly = () => {
    addToCart(product, selectedVolume, quantity);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  const copyShareLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 3000);
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#1A1A1E] font-sans selection:bg-[#B89753]/30 selection:text-[#1A1A1E]">
      
      {/* Top Banner & Admin Quick Bar */}
      <div className="bg-[#1A1A1E] text-[#F8F6F0] py-2 px-4 text-center text-xs flex items-center justify-between">
        <div className="flex items-center gap-2 mx-auto">
          <Sparkles size={13} className="text-[#B89753] animate-pulse" />
          <span className="uppercase tracking-[0.2em] font-medium">Landing Page Oficial • Lote Limitado & Numerado</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={copyShareLink}
            className="bg-[#B89753] hover:bg-[#8C6F3C] text-white px-3 py-1 rounded-xs text-[10px] uppercase tracking-wider flex items-center gap-1 transition-all"
          >
            <Copy size={11} />
            <span>{copiedLink ? 'Link Copiado!' : 'Copiar Link'}</span>
          </button>
          <button
            onClick={() => onNavigate('home')}
            className="text-[#B89753] hover:underline text-[10px] uppercase tracking-wider"
          >
            Ver Loja
          </button>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative py-16 lg:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 flex flex-col items-center">
            <div className="relative w-full max-w-md aspect-[3/4] rounded-xs overflow-hidden border border-[#B89753]/40 shadow-2xl bg-white group">
              <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute top-4 left-4 bg-[#1A1A1E]/90 border border-[#B89753]/40 text-[#E8D5B7] text-[10px] uppercase tracking-[0.25em] px-3.5 py-1.5 backdrop-blur-md font-semibold">
                Édition Privée
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 space-y-6">
            <h1 className="font-cinzel text-3xl sm:text-5xl font-light text-[#1A1A1E] uppercase tracking-wide leading-tight">
              {product.name}
            </h1>
            <p className="text-sm font-light text-[#5A564E] leading-relaxed">
              {product.longDescription || product.description}
            </p>

            {/* Price Box */}
            <div className="p-6 bg-white border border-[#B89753]/30 rounded-xs shadow-sm space-y-4">
              <div className="flex items-baseline gap-4">
                <span className="font-cinzel text-4xl font-bold text-[#1A1A1E]">{formatCurrency(currentPrice)}</span>
              </div>
              <button
                onClick={handleBuy}
                className="w-full bg-[#B89753] hover:bg-[#8C6F3C] text-white py-4 rounded-xs text-xs uppercase tracking-[0.25em] font-semibold transition-all shadow-lg active:scale-95"
              >
                Adquirir Lote Numerado
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* NEW: Heritage Section */}
      <section className="bg-[#1A1A1E] text-[#E8D5B7] py-20 px-6">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h2 className="font-cinzel text-3xl uppercase tracking-widest">L'Héritage Mirage</h2>
          <p className="font-light text-sm leading-relaxed text-[#A39E93]">
            A Maison Mirage é um tributo à alquimia ancestral e à modernidade absoluta. Cada fragrância é o resultado de uma busca incansável pelas notas mais raras, destiladas para criar um rastro magnético que transcende o tempo.
          </p>
        </div>
      </section>

      {/* NEW: Ritual Section */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <h2 className="font-cinzel text-3xl text-center uppercase tracking-widest mb-16">Rituel de Beauté</h2>
        <div className="grid md:grid-cols-3 gap-12">
          {[
            { title: "Aplicação", desc: "Aplique nos pontos de pulsação: pulsos, pescoço e atrás das orelhas." },
            { title: "Preservação", desc: "Não esfregue os pulsos após a aplicação para manter a integridade das notas." },
            { title: "Fixação", desc: "Sinta a evolução das notas ao longo das 18 horas de duração na pele." }
          ].map((item, i) => (
            <div key={i} className="text-center space-y-4">
              <div className="w-12 h-12 rounded-full border border-[#B89753] flex items-center justify-center mx-auto text-[#B89753] font-cinzel text-xl">{i + 1}</div>
              <h3 className="font-cinzel uppercase tracking-wider">{item.title}</h3>
              <p className="text-xs text-[#5A564E]">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pyramid Section */}
      <section className="bg-white py-20 border-y border-[#B89753]/20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto space-y-12">
          <h2 className="font-cinzel text-3xl text-center uppercase tracking-widest">Arquitetura Sensorial</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 bg-[#FAF8F5] border border-[#B89753]/20 rounded-xs space-y-3">
              <h3 className="font-cinzel uppercase text-[#B89753]">Topo</h3>
              <p className="text-xs text-[#5A564E]">{product.notesTop}</p>
            </div>
            <div className="p-8 bg-[#FAF8F5] border border-[#B89753]/20 rounded-xs space-y-3">
              <h3 className="font-cinzel uppercase text-[#B89753]">Coração</h3>
              <p className="text-xs text-[#5A564E]">{product.notesHeart}</p>
            </div>
            <div className="p-8 bg-[#FAF8F5] border border-[#B89753]/20 rounded-xs space-y-3">
              <h3 className="font-cinzel uppercase text-[#B89753]">Fundo</h3>
              <p className="text-xs text-[#5A564E]">{product.notesBase}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#1A1A1E]/95 backdrop-blur-md p-4 z-40 sm:hidden">
        <button onClick={handleBuy} className="w-full bg-[#B89753] text-white py-4 rounded-xs text-xs uppercase tracking-wider font-semibold">
          Comprar {formatCurrency(currentPrice)}
        </button>
      </div>

    </div>
  );
};
