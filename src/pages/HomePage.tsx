import React from 'react';
import { Product } from '../types';
import { ProductCard } from '../components/ProductCard';
import { Sparkles, ArrowRight, ShieldCheck, Flame, Compass, Award, Droplets, ChevronRight } from 'lucide-react';
import { MIRAGE_WHATSAPP_NUMBER } from '../lib/whatsapp';
const logoUrl = 'https://i.postimg.cc/7ZKWrN26/Whats-App-Image-2026-10-24-at-14-13-41.jpg';

interface HomePageProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
  onNavigate: (view: string, data?: any) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  products,
  onSelectProduct,
  onNavigate,
}) => {
  const featuredProducts = products.filter((p) => p.featured || p.isBestseller).slice(0, 4);
  const bestsellers = products.filter((p) => p.isBestseller).slice(0, 3);
  const heroProduct = products.find((p) => p.id === 'noir-imperial') || products[0];

  return (
    <div className="w-full flex flex-col space-y-20 md:space-y-28 pb-20 bg-[#FAF8F5] text-[#1A1A1E]">
      
      {/* 1. CINEMATIC HERO SECTION (LIGHT LUXURY) */}
      <section className="relative min-h-[85vh] lg:min-h-[90vh] flex items-center justify-center overflow-hidden bg-[#FAF8F5] px-4 sm:px-6 border-b border-[#B89753]/15">
        
        {/* Background Official Logo with Royal Effects */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0 overflow-hidden">
          {/* Pulsing golden aura glow behind logo */}
          <div className="absolute w-[450px] sm:w-[650px] lg:w-[850px] h-[450px] sm:h-[650px] lg:h-[850px] rounded-full bg-gradient-to-tr from-[#B89753]/10 via-[#C9A86C]/15 to-[#D4BE92]/10 blur-[130px] animate-pulse" />
          
          {/* Subtle rotating gold dashed ring */}
          <div className="absolute w-[360px] sm:w-[540px] lg:w-[700px] h-[360px] sm:h-[540px] lg:h-[700px] rounded-full border border-[#B89753]/20 border-dashed animate-[spin_60s_linear_infinite]" />

          {/* Logo with feather-masked edges and float effect */}
          <div className="relative animate-float">
            <img
              src={logoUrl}
              alt="Mirage Parfum Background Emblem"
              className="w-[340px] sm:w-[500px] md:w-[640px] lg:w-[760px] h-auto object-contain opacity-15 sm:opacity-20 lg:opacity-25 drop-shadow-[0_0_50px_rgba(184,151,83,0.25)] transition-all"
              style={{
                maskImage: 'radial-gradient(ellipse at center, black 40%, transparent 80%)',
                WebkitMaskImage: 'radial-gradient(ellipse at center, black 40%, transparent 80%)'
              }}
            />
          </div>
        </div>

        {/* Ambient gold dust grid */}
        <div className="absolute inset-0 bg-[radial-gradient(#B89753_1px,transparent_1px)] [background-size:32px_32px] opacity-[0.04] pointer-events-none z-0" />

        <div className="relative z-10 max-w-5xl mx-auto text-center flex flex-col items-center">
          
          <div className="inline-flex items-center gap-2 bg-white/90 border border-[#B89753]/30 px-4 py-1.5 rounded-full mb-6 text-xs uppercase tracking-[0.25em] text-[#8C6F3C] backdrop-blur-sm shadow-sm">
            <Sparkles size={12} className="text-[#B89753]" />
            <span>Haute Parfumerie • Édition Limitée 2026</span>
          </div>

          <h1 className="font-cinzel text-4xl sm:text-6xl lg:text-7xl font-light text-[#1A1A1E] tracking-[0.08em] uppercase leading-[1.1] max-w-4xl">
            O Ápice da Sedução e <span className="gold-gradient-text font-normal">Raridade Olfativa</span>
          </h1>

          <p className="mt-6 text-sm sm:text-base text-[#5A564E] max-w-2xl font-light leading-relaxed">
            Fragrâncias de alta concentração forjadas com as matérias-primas mais raras do mundo. 
            Uma experiência sensorial transcendental de permanência eterna e rastro magnético.
          </p>

          {/* CTA Buttons */}
          <div className="mt-10 flex flex-col sm:flex-row items-center gap-4 sm:gap-6 w-full sm:w-auto">
            <button
              onClick={() => onNavigate('catalog')}
              className="w-full sm:w-auto bg-[#B89753] hover:bg-[#8C6F3C] text-white font-semibold px-8 py-4 rounded-xs text-xs uppercase tracking-[0.25em] flex items-center justify-center gap-3 transition-all shadow-lg hover:shadow-[#B89753]/20 active:scale-95"
            >
              <span>Explorar Coleção Privée</span>
              <ArrowRight size={15} />
            </button>

            <button
              onClick={() => onNavigate('notes-guide')}
              className="w-full sm:w-auto bg-white hover:bg-[#F2ECE1] text-[#1A1A1E] border border-[#B89753]/40 hover:border-[#B89753] px-8 py-4 rounded-xs text-xs uppercase tracking-[0.25em] flex items-center justify-center gap-2 transition-all shadow-sm"
            >
              <Compass size={14} className="text-[#B89753]" />
              <span>Pirâmide Olfativa</span>
            </button>
          </div>

          {/* Prestige Indicators */}
          <div className="mt-16 pt-8 border-t border-[#B89753]/20 grid grid-cols-3 gap-6 sm:gap-16 text-center">
            <div>
              <span className="font-cinzel text-xl sm:text-2xl text-[#1A1A1E] block font-semibold">30%</span>
              <span className="text-[10px] sm:text-xs uppercase tracking-[0.18em] text-[#6A665C]">Óleos Essenciais Puros</span>
            </div>
            <div>
              <span className="font-cinzel text-xl sm:text-2xl text-[#1A1A1E] block font-semibold">18h+</span>
              <span className="text-[10px] sm:text-xs uppercase tracking-[0.18em] text-[#6A665C]">Fixação na Pele</span>
            </div>
            <div>
              <span className="font-cinzel text-xl sm:text-2xl text-[#1A1A1E] block font-semibold">Grasse</span>
              <span className="text-[10px] sm:text-xs uppercase tracking-[0.18em] text-[#6A665C]">Origem das Essências</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. IMMEDIATE CATALOG SHOWCASE BELOW HERO (USER REQUIREMENT) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 border-b border-[#B89753]/20 pb-6">
          <div>
            <span className="text-[11px] uppercase tracking-[0.3em] text-[#B89753] font-semibold block mb-2">
              Lotes Raros & Numerados
            </span>
            <h2 className="font-cinzel text-2xl sm:text-3xl lg:text-4xl text-[#1A1A1E] font-medium uppercase tracking-wider">
              Coleção Privée & Vitrine
            </h2>
          </div>
          <button
            onClick={() => onNavigate('catalog')}
            className="mt-4 md:mt-0 text-xs uppercase tracking-[0.2em] text-[#8C6F3C] hover:text-[#B89753] flex items-center gap-2 group transition-colors font-semibold"
          >
            <span>Ver Todo o Acervo ({products.length} itens)</span>
            <ChevronRight size={15} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 lg:gap-8">
          {products.slice(0, 8).map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onSelect={onSelectProduct}
            />
          ))}
        </div>

        <div className="mt-12 text-center">
          <button
            onClick={() => onNavigate('catalog')}
            className="bg-[#1A1A1E] hover:bg-[#B89753] text-white px-10 py-4 rounded-xs text-xs uppercase tracking-[0.25em] font-medium transition-all shadow-lg"
          >
            Acessar Catálogo Completo de Fragrâncias
          </button>
        </div>
      </section>

      {/* 3. IMMERSIVE PRODUCT SPOTLIGHT (NOIR IMPÉRIAL HERO BANNER) */}
      {heroProduct && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="relative rounded-xs border border-[#B89753]/30 bg-gradient-to-r from-white via-[#FDFBF7] to-[#F7F2E8] overflow-hidden p-8 sm:p-12 lg:p-16 flex flex-col lg:flex-row items-center gap-10 lg:gap-16 shadow-xl">
            
            {/* Ambient Background Gold Light */}
            <div className="absolute -top-24 -left-24 w-80 h-80 bg-[#B89753]/10 rounded-full blur-3xl pointer-events-none" />

            {/* Image Box */}
            <div className="w-full lg:w-1/2 flex items-center justify-center relative">
              <div className="relative w-full max-w-md aspect-[3/4] rounded-xs overflow-hidden border border-[#B89753]/30 shadow-2xl bg-white">
                <img
                  src={heroProduct.images[0]}
                  alt={heroProduct.name}
                  className="w-full h-full object-cover object-center"
                />
                <div className="absolute top-4 left-4 bg-white/90 border border-[#B89753]/40 text-[#8C6F3C] text-[10px] uppercase tracking-[0.2em] px-3 py-1 rounded-xs backdrop-blur-md font-semibold">
                  Ícone da Maison
                </div>
              </div>
            </div>

            {/* Narrative Info */}
            <div className="w-full lg:w-1/2 space-y-6">
              <span className="text-xs uppercase tracking-[0.3em] text-[#B89753] font-semibold">
                Obra-Prima Olfativa
              </span>

              <h2 className="font-cinzel text-3xl sm:text-4xl lg:text-5xl text-[#1A1A1E] font-medium tracking-wide leading-tight">
                {heroProduct.name}
              </h2>

              <p className="text-xs sm:text-sm text-[#8C6F3C] uppercase tracking-[0.2em] font-medium">
                {heroProduct.subtitle}
              </p>

              <p className="text-xs sm:text-sm text-[#5A564E] leading-relaxed font-light">
                {heroProduct.longDescription || heroProduct.description}
              </p>

              {/* Fragrance pyramid breakdown */}
              <div className="space-y-3 pt-4 border-t border-[#B89753]/20">
                <div className="flex items-start gap-3">
                  <span className="text-[10px] uppercase tracking-[0.2em] font-semibold text-[#B89753] w-24 shrink-0 pt-0.5">Notas de Topo:</span>
                  <span className="text-xs text-[#1A1A1E]">{heroProduct.notesTop || 'Bergamota da Calábria, Pimenta Rosa, Açafrão Raro'}</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-[10px] uppercase tracking-[0.2em] font-semibold text-[#B89753] w-24 shrink-0 pt-0.5">Coração:</span>
                  <span className="text-xs text-[#1A1A1E]">{heroProduct.notesHeart || 'Rosa de Grasse, Âmbar Dourado, Oud Imperial'}</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-[10px] uppercase tracking-[0.2em] font-semibold text-[#B89753] w-24 shrink-0 pt-0.5">Fundo:</span>
                  <span className="text-xs text-[#1A1A1E]">{heroProduct.notesBase || 'Baunilha de Madagascar, Patchouli Indonésio, Couro Sutil'}</span>
                </div>
              </div>

              <div className="pt-4 flex flex-col sm:flex-row items-center gap-4">
                <span className="font-cinzel text-2xl text-[#1A1A1E] font-semibold">
                  R$ {heroProduct.price.toFixed(2)}
                </span>
                <button
                  onClick={() => onSelectProduct(heroProduct)}
                  className="w-full sm:w-auto bg-[#B89753] hover:bg-[#8C6F3C] text-white px-8 py-3.5 rounded-xs text-xs uppercase tracking-[0.25em] font-semibold transition-all shadow-lg"
                >
                  Adquirir Lote Numerado
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 4. BRAND VALUES & CONCIERGE PROMISE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-xs border border-[#B89753]/20 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-full bg-[#FAF8F5] border border-[#B89753]/30 flex items-center justify-center text-[#B89753]">
              <Award size={20} />
            </div>
            <h3 className="font-cinzel text-lg text-[#1A1A1E] font-medium uppercase">Matérias-Primas Raras</h3>
            <p className="text-xs text-[#5A564E] leading-relaxed">
              Colheitas selecionadas em Grasse, na França, e nas regiões mais exóticas do oriente para criar elixires incomparáveis.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xs border border-[#B89753]/20 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-full bg-[#FAF8F5] border border-[#B89753]/30 flex items-center justify-center text-[#B89753]">
              <Droplets size={20} />
            </div>
            <h3 className="font-cinzel text-lg text-[#1A1A1E] font-medium uppercase">Extrait de Parfum (30%)</h3>
            <p className="text-xs text-[#5A564E] leading-relaxed">
              Concentração máxima de óleos essenciais que garante projeção marcante e fixação superior a 18 horas na pele.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xs border border-[#B89753]/20 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-full bg-[#FAF8F5] border border-[#B89753]/30 flex items-center justify-center text-[#B89753]">
              <ShieldCheck size={20} />
            </div>
            <h3 className="font-cinzel text-lg text-[#1A1A1E] font-medium uppercase">Garantia de Satisfação</h3>
            <p className="text-xs text-[#5A564E] leading-relaxed">
              Cada frasco é enviado em embalagem blindada de veludo com decant de amostra para você experimentar antes de abrir o frasco principal.
            </p>
          </div>
        </div>
      </section>

    </div>
  );
};
