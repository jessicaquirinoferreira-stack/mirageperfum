import React from 'react';
import { Product } from '../types';
import { ProductCard } from '../components/ProductCard';
import { Sparkles, ArrowRight, ShieldCheck, Flame, Compass, Award, Droplets, ChevronRight } from 'lucide-react';
import { MIRAGE_WHATSAPP_NUMBER } from '../lib/whatsapp';
import officialLogo from '../assets/images/mirage_official_logo.webp';

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
    <div className="w-full flex flex-col space-y-24 md:space-y-32 pb-20">
      
      {/* 1. CINEMATIC HERO SECTION */}
      <section className="relative min-h-[85vh] lg:min-h-[92vh] flex items-center justify-center overflow-hidden bg-[#070708] px-4 sm:px-6">
        
        {/* Background Official Logo with Royal Effects */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0 overflow-hidden">
          {/* Pulsing golden aura glow behind logo */}
          <div className="absolute w-[450px] sm:w-[650px] lg:w-[850px] h-[450px] sm:h-[650px] lg:h-[850px] rounded-full bg-gradient-to-tr from-[#947238]/20 via-[#C9A86C]/25 to-[#152336]/30 blur-[130px] animate-pulse" />
          
          {/* Subtle rotating gold dashed ring */}
          <div className="absolute w-[360px] sm:w-[540px] lg:w-[700px] h-[360px] sm:h-[540px] lg:h-[700px] rounded-full border border-[#C9A86C]/15 border-dashed animate-[spin_60s_linear_infinite]" />

          {/* Logo with feather-masked edges and float effect */}
          <div className="relative animate-float">
            <img
              src={officialLogo}
              alt="Mirage Parfum Background Emblem"
              className="w-[340px] sm:w-[500px] md:w-[640px] lg:w-[760px] h-auto object-contain opacity-25 sm:opacity-30 lg:opacity-35 drop-shadow-[0_0_60px_rgba(201,168,108,0.35)] transition-all"
              style={{
                maskImage: 'radial-gradient(ellipse at center, black 40%, transparent 80%)',
                WebkitMaskImage: 'radial-gradient(ellipse at center, black 40%, transparent 80%)'
              }}
            />
          </div>
        </div>

        {/* Ambient gold dust grid */}
        <div className="absolute inset-0 bg-[radial-gradient(#C9A86C_1px,transparent_1px)] [background-size:32px_32px] opacity-[0.03] pointer-events-none z-0" />

        <div className="relative z-10 max-w-5xl mx-auto text-center flex flex-col items-center">
          
          <div className="inline-flex items-center gap-2 bg-[#14141c]/90 border border-[#C9A86C]/30 px-4 py-1.5 rounded-full mb-6 text-xs uppercase tracking-[0.25em] text-[#E8D5B7] backdrop-blur-sm shadow-lg">
            <Sparkles size={12} className="text-[#C9A86C]" />
            <span>Haute Parfumerie • Édition Limitée 2026</span>
          </div>

          <h1 className="font-cinzel text-4xl sm:text-6xl lg:text-7xl font-light text-[#F8F6F0] tracking-[0.08em] uppercase leading-[1.1] max-w-4xl">
            O Ápice da Sedução e <span className="gold-gradient-text font-normal">Raridade Olfativa</span>
          </h1>

          <p className="mt-6 text-sm sm:text-base text-[#B0ACA4] max-w-2xl font-light leading-relaxed">
            Fragrâncias de alta concentração forjadas com as matérias-primas mais raras do mundo. 
            Uma experiência sensorial transcendental de permanência eterna e rastro magnético.
          </p>

          {/* CTA Buttons */}
          <div className="mt-10 flex flex-col sm:flex-row items-center gap-4 sm:gap-6 w-full sm:w-auto">
            <button
              onClick={() => onNavigate('catalog')}
              className="w-full sm:w-auto bg-[#C9A86C] hover:bg-[#DFC48F] text-[#070708] font-semibold px-8 py-4 rounded-xs text-xs uppercase tracking-[0.25em] flex items-center justify-center gap-3 transition-all shadow-xl hover:shadow-[#C9A86C]/20 active:scale-95"
            >
              <span>Explorar Coleção Privée</span>
              <ArrowRight size={15} />
            </button>

            <button
              onClick={() => onNavigate('notes-guide')}
              className="w-full sm:w-auto bg-[#101015]/80 hover:bg-[#181822] text-[#F8F6F0] border border-[#C9A86C]/35 hover:border-[#C9A86C] px-8 py-4 rounded-xs text-xs uppercase tracking-[0.25em] flex items-center justify-center gap-2 transition-all backdrop-blur-sm"
            >
              <Compass size={14} className="text-[#C9A86C]" />
              <span>Pirâmide Olfativa</span>
            </button>
          </div>

          {/* Prestige Indicators */}
          <div className="mt-16 pt-8 border-t border-[#C9A86C]/15 grid grid-cols-3 gap-6 sm:gap-16 text-center">
            <div>
              <span className="font-cinzel text-xl sm:text-2xl text-[#E8D5B7] block font-light">30%</span>
              <span className="text-[10px] sm:text-xs uppercase tracking-[0.18em] text-[#8C8880]">Óleos Essenciais Puros</span>
            </div>
            <div>
              <span className="font-cinzel text-xl sm:text-2xl text-[#E8D5B7] block font-light">18h+</span>
              <span className="text-[10px] sm:text-xs uppercase tracking-[0.18em] text-[#8C8880]">Fixação na Pele</span>
            </div>
            <div>
              <span className="font-cinzel text-xl sm:text-2xl text-[#E8D5B7] block font-light">Grasse</span>
              <span className="text-[10px] sm:text-xs uppercase tracking-[0.18em] text-[#8C8880]">Origem das Essências</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. FLAGSHIP FEATURED COLLECTION (COLEÇÃO PRIVÉE) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 border-b border-[#C9A86C]/15 pb-6">
          <div>
            <span className="text-[11px] uppercase tracking-[0.3em] text-[#C9A86C] font-medium block mb-2">
              Lotes Raros & Numerados
            </span>
            <h2 className="font-cinzel text-2xl sm:text-3xl lg:text-4xl text-[#F8F6F0] font-light uppercase tracking-wider">
              Coleção Privée
            </h2>
          </div>
          <button
            onClick={() => onNavigate('catalog')}
            className="mt-4 md:mt-0 text-xs uppercase tracking-[0.2em] text-[#E8D5B7] hover:text-[#C9A86C] flex items-center gap-2 group transition-colors"
          >
            <span>Ver Todo o Acervo</span>
            <ChevronRight size={15} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {featuredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onSelect={onSelectProduct}
            />
          ))}
        </div>
      </section>

      {/* 3. IMMERSIVE PRODUCT SPOTLIGHT (NOIR IMPÉRIAL HERO BANNER) */}
      {heroProduct && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="relative rounded-xs border border-[#C9A86C]/25 bg-gradient-to-r from-[#0c0c10] via-[#121218] to-[#0a0a0d] overflow-hidden p-8 sm:p-12 lg:p-16 flex flex-col lg:flex-row items-center gap-10 lg:gap-16 shadow-2xl">
            
            {/* Ambient Background Gold Light */}
            <div className="absolute -top-24 -left-24 w-80 h-80 bg-[#C9A86C]/15 rounded-full blur-3xl pointer-events-none" />

            {/* Image Box */}
            <div className="w-full lg:w-1/2 flex items-center justify-center relative">
              <div className="relative w-full max-w-md aspect-[3/4] rounded-xs overflow-hidden border border-[#C9A86C]/30 shadow-2xl">
                <img
                  src={heroProduct.images[0]}
                  alt={heroProduct.name}
                  className="w-full h-full object-cover object-center"
                />
                <div className="absolute top-4 left-4 bg-[#070708]/85 border border-[#C9A86C]/40 text-[#E8D5B7] text-[10px] uppercase tracking-[0.2em] px-3 py-1 rounded-xs backdrop-blur-md">
                  Ícone da Maison
                </div>
              </div>
            </div>

            {/* Narrative Info */}
            <div className="w-full lg:w-1/2 space-y-6">
              <span className="text-xs uppercase tracking-[0.3em] text-[#C9A86C] font-semibold">
                Obra-Prima Olfativa
              </span>

              <h2 className="font-cinzel text-3xl sm:text-4xl lg:text-5xl text-[#F8F6F0] font-light tracking-wide leading-tight">
                {heroProduct.name}
              </h2>

              <p className="text-xs sm:text-sm text-[#C9A86C] uppercase tracking-[0.2em]">
                {heroProduct.subtitle}
              </p>

              <p className="text-xs sm:text-sm text-[#B0ACA4] leading-relaxed font-light">
                {heroProduct.longDescription || heroProduct.description}
              </p>

              {/* Fragrance pyramid breakdown */}
              <div className="space-y-3 pt-4 border-t border-[#C9A86C]/15">
                <div className="flex items-start gap-3">
                  <span className="text-[10px] uppercase tracking-[0.2em] text-[#C9A86C] w-24 shrink-0 mt-0.5">
                    Topo:
                  </span>
                  <span className="text-xs text-[#E8D5B7]">{heroProduct.notesTop}</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-[10px] uppercase tracking-[0.2em] text-[#C9A86C] w-24 shrink-0 mt-0.5">
                    Coração:
                  </span>
                  <span className="text-xs text-[#E8D5B7]">{heroProduct.notesHeart}</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-[10px] uppercase tracking-[0.2em] text-[#C9A86C] w-24 shrink-0 mt-0.5">
                    Fundo:
                  </span>
                  <span className="text-xs text-[#E8D5B7]">{heroProduct.notesBase}</span>
                </div>
              </div>

              <div className="pt-6 flex flex-wrap items-center gap-4">
                <button
                  onClick={() => onSelectProduct(heroProduct)}
                  className="bg-[#C9A86C] hover:bg-[#DFC48F] text-[#070708] font-semibold px-8 py-3.5 rounded-xs text-xs uppercase tracking-[0.2em] transition-all shadow-lg active:scale-95"
                >
                  Conhecer em Detalhes
                </button>
                <a
                  href={`https://api.whatsapp.com/send?phone=${MIRAGE_WHATSAPP_NUMBER}&text=${encodeURIComponent(`Olá, gostaria de saber mais sobre a fragrância ${heroProduct.name}.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border border-[#C9A86C]/40 hover:border-[#C9A86C] text-[#E8D5B7] px-6 py-3.5 rounded-xs text-xs uppercase tracking-[0.2em] transition-colors"
                >
                  Consultar Concierge
                </a>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 4. THE ART OF HAUTE PARFUMERIE (SAVOIR-FAIRE) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-[11px] uppercase tracking-[0.3em] text-[#C9A86C] font-medium block mb-2">
            Savoir-Faire & Excelência
          </span>
          <h2 className="font-cinzel text-3xl sm:text-4xl text-[#F8F6F0] font-light uppercase tracking-wider">
            A Anatomia da Raridade
          </h2>
          <div className="w-16 h-[1px] bg-[#C9A86C] mx-auto mt-4" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="glass-card p-8 rounded-xs border border-[#C9A86C]/15 space-y-4 text-center flex flex-col items-center">
            <div className="w-14 h-14 rounded-full border border-[#C9A86C]/40 flex items-center justify-center text-[#C9A86C] mb-2 bg-[#0d0d12]">
              <Droplets size={24} />
            </div>
            <h3 className="font-cinzel text-lg text-[#F8F6F0] font-medium uppercase tracking-wider">
              Extração Puríssima
            </h3>
            <p className="text-xs text-[#9E9A92] leading-relaxed font-light">
              Utilizamos maceração lenta a frio e destilação molecular das mais nobres flores de Grasse, 
              resinas de Omã e madeiras milenares de Assam sem qualquer adição sintética agressiva.
            </p>
          </div>

          <div className="glass-card p-8 rounded-xs border border-[#C9A86C]/15 space-y-4 text-center flex flex-col items-center">
            <div className="w-14 h-14 rounded-full border border-[#C9A86C]/40 flex items-center justify-center text-[#C9A86C] mb-2 bg-[#0d0d12]">
              <Flame size={24} />
            </div>
            <h3 className="font-cinzel text-lg text-[#F8F6F0] font-medium uppercase tracking-wider">
              Concentração Extrait
            </h3>
            <p className="text-xs text-[#9E9A92] leading-relaxed font-light">
              Nossas fórmulas alcançam de 25% a 35% de essência pura. Esta dosagem nobre proporciona 
              uma evolução olfativa rica que reage com o calor corporal e dura de 18 a 24 horas.
            </p>
          </div>

          <div className="glass-card p-8 rounded-xs border border-[#C9A86C]/15 space-y-4 text-center flex flex-col items-center">
            <div className="w-14 h-14 rounded-full border border-[#C9A86C]/40 flex items-center justify-center text-[#C9A86C] mb-2 bg-[#0d0d12]">
              <Award size={24} />
            </div>
            <h3 className="font-cinzel text-lg text-[#F8F6F0] font-medium uppercase tracking-wider">
              Embalagem de Alta Joalheria
            </h3>
            <p className="text-xs text-[#9E9A92] leading-relaxed font-light">
              Frascos de cristal facetado e tampas metálicas maciças com acabamento champagne banhado. 
              Acondicionados em caixas rígidas aveludadas com selo holográfico de autenticidade.
            </p>
          </div>
        </div>
      </section>

      {/* 5. INTERACTIVE OLFACTORY FAMILIES PREVIEW */}
      <section className="bg-[#050507] border-y border-[#C9A86C]/15 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <span className="text-[11px] uppercase tracking-[0.3em] text-[#C9A86C] font-medium block mb-2">
                Guia Sensorial
              </span>
              <h2 className="font-cinzel text-2xl sm:text-3xl lg:text-4xl text-[#F8F6F0] font-light uppercase tracking-wider">
                Famílias Olfativas
              </h2>
            </div>
            <p className="text-xs text-[#8C8880] max-w-md mt-2 md:mt-0">
              Cada perfil revela uma atmosfera única. Encontre o acorde que traduz a sua essência.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {[
              { name: 'Oud & Madeiras Nobres', desc: 'Sombrio, opulento, esfumaçado e aristocrático.', note: 'Oud de Assam, Cedro, Sândalo' },
              { name: 'Oriental & Especiarias', desc: 'Caloroso, envolvente, sensual e exótico.', note: 'Açafrão, Cardamomo, Mirra' },
              { name: 'Floral Noturno', desc: 'Aveludado, magnético e hipnótico.', note: 'Rosa Centifolia, Jasmim, Íris' },
              { name: 'Âmbar & Gourmand Escuro', desc: 'Balsâmico, resinoso e inebriante.', note: 'Âmbar Dourado, Baunilha Bourbon' },
            ].map((family, idx) => (
              <div
                key={idx}
                onClick={() => onNavigate('catalog')}
                className="p-6 bg-[#0a0a0f] border border-[#C9A86C]/20 hover:border-[#C9A86C]/60 rounded-xs transition-all cursor-pointer group hover:-translate-y-1"
              >
                <span className="text-[9px] uppercase tracking-[0.25em] text-[#C9A86C] block mb-2">
                  Acorde 0{idx + 1}
                </span>
                <h4 className="font-cinzel text-base text-[#F8F6F0] group-hover:text-[#E8D5B7] transition-colors mb-2">
                  {family.name}
                </h4>
                <p className="text-[11px] text-[#8C8880] leading-relaxed mb-4">
                  {family.desc}
                </p>
                <div className="text-[10px] text-[#C9A86C] font-mono border-t border-[#C9A86C]/10 pt-2">
                  {family.note}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. CONCIERGE VIP WHATSAPP BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="relative rounded-xs border border-[#C9A86C]/30 bg-gradient-to-br from-[#111117] via-[#09090c] to-[#070709] p-8 sm:p-12 text-center flex flex-col items-center overflow-hidden">
          <div className="w-12 h-12 rounded-full border border-[#C9A86C]/40 flex items-center justify-center text-[#C9A86C] mb-4">
            <Compass size={22} />
          </div>
          <span className="text-xs uppercase tracking-[0.25em] text-[#C9A86C] font-medium mb-2">
            Consultoria Olfativa Particular
          </span>
          <h3 className="font-cinzel text-2xl sm:text-3xl text-[#F8F6F0] font-light max-w-xl leading-snug">
            Em Dúvida Sobre Qual Fragrância Escolher?
          </h3>
          <p className="text-xs sm:text-sm text-[#9E9A92] max-w-lg mt-3 leading-relaxed">
            Fale diretamente com os nossos especialistas olfativos no WhatsApp. Analisamos suas preferências 
            e recomendamos a composição ideal para você ou para presentear.
          </p>
          <a
            href={`https://api.whatsapp.com/send?phone=${MIRAGE_WHATSAPP_NUMBER}&text=${encodeURIComponent('Olá, gostaria de uma consultoria olfativa exclusiva com o Concierge Mirage Parfum.')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 bg-[#C9A86C] hover:bg-[#DFC48F] text-[#070708] font-semibold px-8 py-3.5 rounded-xs text-xs uppercase tracking-[0.2em] transition-all shadow-lg hover:shadow-[#C9A86C]/25"
          >
            Falar com Concierge (+55 21 98077-9429)
          </a>
        </div>
      </section>

    </div>
  );
};
