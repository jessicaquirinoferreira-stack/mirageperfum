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
    <footer className="bg-[#050506] border-t border-[#C9A86C]/20 text-[#D1CEC7] pt-16 pb-12 relative overflow-hidden">
      {/* Background ambient gradient */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-24 bg-[#C9A86C]/5 blur-3xl pointer-events-none" />

      {/* Trust Badges */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 py-8 border-y border-[#C9A86C]/15">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full border border-[#C9A86C]/30 flex items-center justify-center text-[#C9A86C] shrink-0">
              <ShieldCheck size={22} />
            </div>
            <div>
              <h4 className="text-xs uppercase tracking-[0.15em] font-medium text-[#F8F6F0]">100% Autenticidade</h4>
              <p className="text-[11px] text-[#8C8880] mt-0.5">Fragrâncias raras com matérias-primas nobres de Grasse.</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full border border-[#C9A86C]/30 flex items-center justify-center text-[#C9A86C] shrink-0">
              <Truck size={22} />
            </div>
            <div>
              <h4 className="text-xs uppercase tracking-[0.15em] font-medium text-[#F8F6F0]">Envio Blindado</h4>
              <p className="text-[11px] text-[#8C8880] mt-0.5">Sedex e JadLog com seguro integral e caixa de veludo.</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full border border-[#C9A86C]/30 flex items-center justify-center text-[#C9A86C] shrink-0">
              <Sparkles size={22} />
            </div>
            <div>
              <h4 className="text-xs uppercase tracking-[0.15em] font-medium text-[#F8F6F0]">Amostras Cortesia</h4>
              <p className="text-[11px] text-[#8C8880] mt-0.5">Todo pedido acompanha decants da Coleção Privée.</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full border border-[#C9A86C]/30 flex items-center justify-center text-[#C9A86C] shrink-0">
              <RefreshCw size={22} />
            </div>
            <div>
              <h4 className="text-xs uppercase tracking-[0.15em] font-medium text-[#F8F6F0]">Concierge Dedicado</h4>
              <p className="text-[11px] text-[#8C8880] mt-0.5">Consultoria olfativa exclusiva via WhatsApp.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-12 pb-14 border-b border-[#C9A86C]/10">
          
          {/* Brand Manifesto */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-2">
              <span className="font-cinzel text-2xl font-light tracking-[0.25em] text-[#F8F6F0] uppercase">
                Mirage
              </span>
              <span className="font-cinzel text-xs text-[#C9A86C] tracking-[0.35em] uppercase">
                Parfum
              </span>
            </div>
            <p className="text-xs text-[#9E9A92] leading-relaxed max-w-md font-light">
              A Mirage Parfum nasceu para transcender os limites da perfumaria tradicional. 
              Criamos elixires olfativos de alta concentração que despertam memórias profundas, 
              sedução e imponência com as matérias-primas mais raras e preciosas do planeta.
            </p>
            <div className="pt-2 text-xs text-[#C9A86C] tracking-widest font-mono">
              CONCIERGE: +55 (21) 98077-9429
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-2 space-y-3">
            <h5 className="font-cinzel text-xs uppercase tracking-[0.2em] text-[#E8D5B7] font-semibold">
              Maison
            </h5>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onNavigate('catalog')} className="hover:text-[#C9A86C] transition-colors">
                  Coleção Privée
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('notes-guide')} className="hover:text-[#C9A86C] transition-colors">
                  Pirâmide Olfativa
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('about')} className="hover:text-[#C9A86C] transition-colors">
                  Nossa História
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('wishlist')} className="hover:text-[#C9A86C] transition-colors">
                  Lista de Desejos
                </button>
              </li>
            </ul>
          </div>

          {/* Client Service & Legal */}
          <div className="md:col-span-2 space-y-3">
            <h5 className="font-cinzel text-xs uppercase tracking-[0.2em] text-[#E8D5B7] font-semibold">
              Atendimento
            </h5>
            <ul className="space-y-2 text-xs">
              <li>
                <a
                  href={`https://api.whatsapp.com/send?phone=${MIRAGE_WHATSAPP_NUMBER}&text=${encodeURIComponent('Olá, preciso de suporte sobre um pedido Mirage Parfum.')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#C9A86C] transition-colors"
                >
                  WhatsApp VIP
                </a>
              </li>
              <li>
                <button onClick={() => onNavigate('contact')} className="hover:text-[#C9A86C] transition-colors">
                  Fale com a Maison
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('terms')} className="hover:text-[#C9A86C] transition-colors">
                  Política & Termos
                </button>
              </li>
              <li>
                <span className="text-[#6E6B65]">Rio de Janeiro • Paris</span>
              </li>
            </ul>
          </div>

          {/* Newsletter Club Privé */}
          <div className="md:col-span-3 space-y-3">
            <h5 className="font-cinzel text-xs uppercase tracking-[0.2em] text-[#E8D5B7] font-semibold">
              Club Privé Mirage
            </h5>
            <p className="text-xs text-[#8C8880] leading-relaxed">
              Receba convites para lançamentos de lotes numerados e ofertas exclusivas para iniciados.
            </p>
            {newsletterStatus === 'success' ? (
              <div className="bg-[#121814] border border-[#3E8B59]/40 p-3 text-xs text-[#82D99E] rounded-sm flex items-center gap-2">
                <Sparkles size={14} />
                <span>Bem-vindo ao Club Privé Mirage.</span>
              </div>
            ) : (
              <form onSubmit={handleNewsletterSubmit} className="flex gap-2">
                <input
                  type="email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Seu melhor e-mail"
                  required
                  className="bg-[#0f0f14] border border-[#C9A86C]/25 text-[#F8F6F0] text-xs px-3 py-2 rounded-sm focus:outline-none focus:border-[#C9A86C] w-full placeholder:text-[#5E5B55]"
                />
                <button
                  type="submit"
                  disabled={newsletterStatus === 'loading'}
                  className="bg-[#C9A86C] hover:bg-[#DFC48F] text-[#070708] px-3 py-2 rounded-sm text-xs font-semibold transition-colors shrink-0"
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
              className="text-[#6E6B65] hover:text-[#C9A86C] transition-colors text-[10px] uppercase tracking-[0.3em] flex items-center gap-1.5 opacity-60 hover:opacity-100 py-1 px-3 rounded hover:bg-[#C9A86C]/10 border border-transparent hover:border-[#C9A86C]/20"
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
