import React from 'react';
import { Award, Droplets, Sparkles, ShieldCheck } from 'lucide-react';
import { MIRAGE_WHATSAPP_NUMBER } from '../lib/whatsapp';

interface AboutPageProps {
  onNavigateCatalog: () => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigateCatalog }) => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 space-y-16">
      
      {/* Title */}
      <div className="text-center max-w-3xl mx-auto">
        <span className="text-[11px] uppercase tracking-[0.3em] text-[#C9A86C] font-semibold block mb-2">
          Maison Mirage Parfum
        </span>
        <h1 className="font-cinzel text-3xl sm:text-4xl lg:text-5xl text-[#F8F6F0] font-light uppercase tracking-wider">
          A Arte da Obsessão Olfativa
        </h1>
        <div className="w-16 h-[1px] bg-[#C9A86C] mx-auto mt-6" />
      </div>

      {/* Narrative Section 1 */}
      <div className="glass-card p-8 sm:p-12 rounded-xs border border-[#C9A86C]/20 bg-[#0a0a0f] space-y-6 text-sm text-[#B0ACA4] leading-relaxed font-light">
        <p className="first-letter:text-4xl first-letter:font-cinzel first-letter:text-[#C9A86C] first-letter:mr-2 first-letter:float-left">
          Fundada no cruzamento entre a tradição secular de Grasse e a audácia sensual contemporânea, 
          a <strong className="text-[#F8F6F0] font-normal">Mirage Parfum</strong> nasceu com uma única premissa: 
          resgatar a perfumaria como uma forma pura de arte, imune a modismos passageiros ou formulações diluídas.
        </p>
        <p>
          Enquanto a indústria convencional prioriza rendimentos em massa e ingredientes sintéticos previsíveis, 
          nós escolhemos o caminho do tempo. Cada criação Mirage descansa por no mínimo seis meses em maturação antes do envase manual, 
          permitindo que as resinas, madeiras raras e óleos florais atinjam uma harmonia polifônica perfeita.
        </p>
        <div className="p-6 border-l-2 border-[#C9A86C] bg-[#121218] my-6">
          <p className="font-cinzel text-base text-[#E8D5B7] italic">
            "Um grande perfume não é uma fragrância que se usa; é uma atmosfera invisível que você impõe ao mundo."
          </p>
          <span className="text-[10px] uppercase tracking-[0.2em] text-[#8C8880] mt-2 block">
            — Mestre Perfumista Mirage Parfum
          </span>
        </div>
      </div>

      {/* Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
        <div className="p-6 bg-[#0c0c11] border border-[#C9A86C]/15 rounded-xs space-y-3">
          <Droplets size={24} className="text-[#C9A86C] mx-auto" />
          <h4 className="font-cinzel text-base text-[#F8F6F0]">30% Concentração</h4>
          <p className="text-xs text-[#8C8880] leading-relaxed">
            Nível Extrait de Parfum autêntico, garantindo sillage majestoso e longevidade inquestionável de até 24 horas.
          </p>
        </div>

        <div className="p-6 bg-[#0c0c11] border border-[#C9A86C]/15 rounded-xs space-y-3">
          <Sparkles size={24} className="text-[#C9A86C] mx-auto" />
          <h4 className="font-cinzel text-base text-[#F8F6F0]">Lotes Numerados</h4>
          <p className="text-xs text-[#8C8880] leading-relaxed">
            Produções artesanais limitadas. Cada frasco é inspecionado, numerado e selado individualmente.
          </p>
        </div>

        <div className="p-6 bg-[#0c0c11] border border-[#C9A86C]/15 rounded-xs space-y-3">
          <Award size={24} className="text-[#C9A86C] mx-auto" />
          <h4 className="font-cinzel text-base text-[#F8F6F0]">Ateliê Rio & Paris</h4>
          <p className="text-xs text-[#8C8880] leading-relaxed">
            Concepção e destilação de essências em Grasse e finalização em nosso ateliê privativo no Rio de Janeiro.
          </p>
        </div>
      </div>

      {/* Concierge invite */}
      <div className="text-center pt-8 border-t border-[#C9A86C]/15 space-y-4">
        <h3 className="font-cinzel text-xl text-[#F8F6F0]">Visite Nosso Espaço Privativo</h3>
        <p className="text-xs text-[#8C8880] max-w-md mx-auto">
          Atendimentos presenciais com hora marcada para sessões olfativas guiadas.
        </p>
        <div className="flex justify-center gap-4 pt-2">
          <button
            onClick={onNavigateCatalog}
            className="bg-[#C9A86C] text-[#070708] font-semibold text-xs uppercase tracking-[0.2em] px-6 py-3 rounded-xs"
          >
            Ver Coleções
          </button>
          <a
            href={`https://api.whatsapp.com/send?phone=${MIRAGE_WHATSAPP_NUMBER}&text=${encodeURIComponent('Olá, gostaria de agendar uma consultoria olfativa particular com a Maison Mirage Parfum.')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="border border-[#C9A86C]/40 text-[#E8D5B7] text-xs uppercase tracking-[0.2em] px-6 py-3 rounded-xs"
          >
            Agendar no WhatsApp
          </a>
        </div>
      </div>

    </div>
  );
};
