import React, { useState } from 'react';
import { Sparkles, ShieldCheck, Truck, RefreshCw, Send, Lock } from 'lucide-react';
import { createLeadService } from '../lib/firebase';
import { MIRAGE_WHATSAPP_NUMBER } from '../lib/whatsapp';

interface FooterProps {
  onNavigate: (view: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterStatus, setNewsletterStatus] = useState<'idle' | 'loading' | 'success'>('idle');

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail || !newsletterEmail.includes('@')) return;

    setNewsletterStatus('loading');
    try {
      await createLeadService({
        email: newsletterEmail.trim(),
        source: 'newsletter',
        createdAt: new Date().toISOString(),
      });
      setNewsletterStatus('success');
      setNewsletterEmail('');
    } catch {
      setNewsletterStatus('success');
    }
  };

  return (
    <footer className="bg-[#F2ECE1] border-t border-[#B89753]/25 text-[#1A1A1E] pt-16 pb-12 relative overflow-hidden">
      {/* Background ambient gradient */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-24 bg-[#B89753]/10 blur-3xl pointer-events-none" />

      {/* Trust Badges */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 py-8 border-y border-[#B89753]/20">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full border border-[#B89753]/40 flex items-center justify-center text-[#B89753] shrink-0 bg-white/60 shadow-sm">
              <ShieldCheck size={22} />
            </div>
            <div>
              <h4 className="text-xs uppercase tracking-[0.15em] font-semibold text-[#1A1A1E]">100% Autenticidade</h4>
              <p className="text-[11px] text-[#6A665C] mt-0.5">Fragrâncias raras com matérias-primas nobres de Grasse.</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full border border-[#B89753]/40 flex items-center justify-center text-[#B89753] shrink-0 bg-white/60 shadow-sm">
              <Truck size={22} />
            </div>
            <div>
              <h4 className="text-xs uppercase tracking-[0.15em] font-semibold text-[#1A1A1E]">Envio Blindado</h4>
              <p className="text-[11px] text-[#6A665C] mt-0.5">Sedex e JadLog com seguro integral e caixa de veludo.</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full border border-[#B89753]/40 flex items-center justify-center text-[#B89753] shrink-0 bg-white/60 shadow-sm">
              <Sparkles size={22} />
            </div>
            <div>
              <h4 className="text-xs uppercase tracking-[0.15em] font-semibold text-[#1A1A1E]">Amostras Cortesia</h4>
              <p className="text-[11px] text-[#6A665C] mt-0.5">Todo pedido acompanha decants da Coleção Privée.</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full border border-[#B89753]/40 flex items-center justify-center text-[#B89753] shrink-0 bg-white/60 shadow-sm">
              <RefreshCw size={22} />
            </div>
            <div>
              <h4 className="text-xs uppercase tracking-[0.15em] font-semibold text-[#1A1A1E]">Concierge Dedicado</h4>
              <p className="text-[11px] text-[#6A665C] mt-0.5">Consultoria olfativa exclusiva via WhatsApp.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-12 pb-14 border-b border-[#B89753]/15">
          
          {/* Brand Manifesto */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-2">
              <span className="font-cinzel text-2xl font-semibold tracking-[0.25em] text-[#1A1A1E] uppercase">
                Mirage
              </span>
              <span className="font-cinzel text-xs text-[#B89753] tracking-[0.35em] uppercase font-semibold">
                Parfum
              </span>
            </div>
            <p className="text-xs text-[#5A564E] leading-relaxed max-w-md font-light">
              A Mirage Parfum nasceu para transcender os limites da perfumaria tradicional. 
              Criamos elixires olfativos de alta concentração que despertam memórias profundas, 
              sedução e imponência com as matérias-primas mais raras e preciosas do planeta.
            </p>
            <div className="pt-2 text-xs text-[#B89753] tracking-widest font-mono">
              WhatsApp: +55 (11) 99999-9999
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="text-xs uppercase tracking-[0.25em] font-semibold text-[#1A1A1E]">
              Navegação Exclusiva
            </h4>
            <ul className="space-y-2.5 text-xs text-[#5A564E]">
              <li>
                <button onClick={() => onNavigate('home')} className="hover:text-[#B89753] transition-colors">
                  Início
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('catalog')} className="hover:text-[#B89753] transition-colors">
                  Coleção Privée
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('notes-guide')} className="hover:text-[#B89753] transition-colors">
                  Pirâmide Olfativa
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('about')} className="hover:text-[#B89753] transition-colors">
                  A Maison
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('contact')} className="hover:text-[#B89753] transition-colors">
                  Atendimento & Concierge
                </button>
              </li>
            </ul>
          </div>

          {/* Newsletter / VIP Club */}
          <div className="md:col-span-4 space-y-4">
            <h4 className="text-xs uppercase tracking-[0.25em] font-semibold text-[#1A1A1E]">
              Clube Privée Mirage
            </h4>
            <p className="text-xs text-[#5A564E] leading-relaxed">
              Inscreva-se para receber convites antecipados de lotes limitados e decants de cortesia.
            </p>

            {newsletterStatus === 'success' ? (
              <div className="p-3 bg-white border border-[#B89753]/30 text-xs text-[#B89753] font-medium rounded-sm">
                Bem-vindo ao Clube Privée. Sua inscrição foi confirmada com sucesso.
              </div>
            ) : (
              <form onSubmit={handleNewsletterSubmit} className="flex gap-2">
                <input
                  type="email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Seu melhor e-mail"
                  required
                  className="bg-white border border-[#B89753]/30 text-[#1A1A1E] text-xs px-3 py-2 rounded-sm focus:outline-none focus:border-[#B89753] w-full placeholder:text-[#8C867B] shadow-sm"
                />
                <button
                  type="submit"
                  disabled={newsletterStatus === 'loading'}
                  className="bg-[#B89753] hover:bg-[#8C6F3C] text-white px-3 py-2 rounded-sm text-xs font-semibold transition-colors shrink-0 shadow-sm"
                  aria-label="Inscrever-se"
                >
                  <Send size={14} />
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Bottom Bar with Absolute Center Admin link */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-[11px] text-[#6E6B65] gap-4 relative">
          <div>
            © {new Date().getFullYear()} Mirage Parfum Haute Parfumerie. Todos os direitos reservados.
          </div>

          {/* ABSOLUTE CENTER DISCREET ADMIN LINK PER BRIEF SPECIFICATION */}
          <div className="md:absolute md:left-1/2 md:-translate-x-1/2">
            <button
              onClick={() => onNavigate('admin')}
              className="text-[#6E6B65] hover:text-[#B89753] transition-colors text-[10px] uppercase tracking-[0.3em] flex items-center gap-1.5 opacity-70 hover:opacity-100 py-1 px-3 rounded hover:bg-[#B89753]/10 border border-transparent hover:border-[#B89753]/20"
              title="Acesso Administrativo Mirage Parfum"
            >
              <Lock size={10} />
              <span>Admin</span>
            </button>
          </div>

          <div className="flex items-center space-x-4 text-[10px] tracking-wider uppercase">
            <span>Pix • Cartão em até 10x • Sedex • JadLog</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
