import React, { useState } from 'react';
import { MIRAGE_WHATSAPP_NUMBER } from '../lib/whatsapp';
import { createLeadService } from '../lib/firebase';
import { MessageCircle, Mail, MapPin, Clock, Send, Check } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;

    setIsSubmitting(true);
    try {
      await createLeadService({
        name,
        email,
        phone,
        source: 'vip_club',
        createdAt: new Date().toISOString(),
      });
      setSent(true);
      setName('');
      setEmail('');
      setPhone('');
      setMessage('');
    } catch {
      setSent(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
      
      <div className="text-center max-w-3xl mx-auto mb-16">
        <span className="text-[11px] uppercase tracking-[0.3em] text-[#C9A86C] font-semibold block mb-2">
          Concierge & Atendimento Privativo
        </span>
        <h1 className="font-cinzel text-3xl sm:text-4xl lg:text-5xl text-[#F8F6F0] font-light uppercase tracking-wider">
          Fale com a Maison
        </h1>
        <p className="text-xs sm:text-sm text-[#9E9A92] mt-3 font-light leading-relaxed">
          Nossa equipe de especialistas olfativos está à sua inteira disposição para consultorias particulares, 
          orientações de pedidos e informações sobre coleções de edição limitada.
        </p>
        <div className="w-16 h-[1px] bg-[#C9A86C] mx-auto mt-6" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Contact Info Channels */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* WhatsApp Card */}
          <div className="bg-[#101912] border border-[#2d6a3f]/50 p-6 rounded-xs space-y-3">
            <div className="flex items-center gap-3 text-[#82D99E]">
              <MessageCircle size={22} />
              <h3 className="font-cinzel text-base uppercase tracking-wider">
                WhatsApp Concierge
              </h3>
            </div>
            <p className="text-xs text-[#9E9A92] leading-relaxed">
              Atendimento ágil em tempo real para dúvidas olfativas, status de pedidos e personalizações.
            </p>
            <div className="text-sm font-mono text-[#E8D5B7] font-semibold">
              +55 (21) 98077-9429
            </div>
            <a
              href={`https://api.whatsapp.com/send?phone=${MIRAGE_WHATSAPP_NUMBER}&text=${encodeURIComponent('Olá, gostaria de falar com o Concierge Mirage Parfum.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-[#25D366] hover:bg-[#20ba5a] text-[#070708] font-bold text-xs uppercase tracking-wider px-5 py-2.5 rounded-xs transition-colors"
            >
              Iniciar Conversa
            </a>
          </div>

          {/* Email & Physical Salons */}
          <div className="bg-[#0b0b0f] border border-[#C9A86C]/20 p-6 rounded-xs space-y-5 text-xs text-[#D1CEC7]">
            <div className="flex items-start gap-3">
              <Mail size={18} className="text-[#C9A86C] shrink-0 mt-0.5" />
              <div>
                <strong className="block text-[#F8F6F0] uppercase tracking-wider text-[11px]">E-mail Corporativo:</strong>
                <span className="text-[#9E9A92]">concierge@mirageparfum.com.br</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin size={18} className="text-[#C9A86C] shrink-0 mt-0.5" />
              <div>
                <strong className="block text-[#F8F6F0] uppercase tracking-wider text-[11px]">Salon Privé Rio:</strong>
                <span className="text-[#9E9A92]">Av. Vieira Souto, Ipanema — Rio de Janeiro, RJ</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin size={18} className="text-[#C9A86C] shrink-0 mt-0.5" />
              <div>
                <strong className="block text-[#F8F6F0] uppercase tracking-wider text-[11px]">Atelier de Création Paris:</strong>
                <span className="text-[#9E9A92]">Place Vendôme, 75001 Paris, França</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Clock size={18} className="text-[#C9A86C] shrink-0 mt-0.5" />
              <div>
                <strong className="block text-[#F8F6F0] uppercase tracking-wider text-[11px]">Horários de Atendimento:</strong>
                <span className="text-[#9E9A92]">Segunda a Sexta, das 09h às 20h • Sábados das 10h às 16h</span>
              </div>
            </div>
          </div>
        </div>

        {/* Message Form */}
        <div className="lg:col-span-7 bg-[#0b0b0f] border border-[#C9A86C]/25 p-8 rounded-xs">
          <h3 className="font-cinzel text-xl text-[#F8F6F0] mb-2 uppercase tracking-wider">
            Envie uma Mensagem
          </h3>
          <p className="text-xs text-[#8C8880] mb-6">
            Responderemos sua solicitação dentro de poucas horas.
          </p>

          {sent ? (
            <div className="bg-[#121c15] border border-[#3E8B59]/40 p-6 rounded-xs text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-[#1b3d26] text-[#82D99E] flex items-center justify-center mx-auto">
                <Check size={22} />
              </div>
              <h4 className="font-cinzel text-base text-[#F8F6F0]">Mensagem Recebida</h4>
              <p className="text-xs text-[#8C8880] max-w-sm mx-auto leading-relaxed">
                Agradecemos o contato. Nosso Concierge responderá em breve através do e-mail ou WhatsApp informado.
              </p>
              <button
                onClick={() => setSent(false)}
                className="text-xs text-[#C9A86C] underline pt-2"
              >
                Enviar nova mensagem
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#D1CEC7] mb-1 font-medium">
                  Seu Nome *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nome completo"
                  className="w-full bg-[#121217] border border-[#C9A86C]/25 text-xs text-[#F8F6F0] p-3 rounded-xs focus:outline-none focus:border-[#C9A86C]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#D1CEC7] mb-1 font-medium">
                    E-mail *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="seu.email@exemplo.com"
                    className="w-full bg-[#121217] border border-[#C9A86C]/25 text-xs text-[#F8F6F0] p-3 rounded-xs focus:outline-none focus:border-[#C9A86C]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#D1CEC7] mb-1 font-medium">
                    Telefone / WhatsApp
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="(21) 98077-9429"
                    className="w-full bg-[#121217] border border-[#C9A86C]/25 text-xs text-[#F8F6F0] p-3 rounded-xs focus:outline-none focus:border-[#C9A86C]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#D1CEC7] mb-1 font-medium">
                  Mensagem ou Consulta Olfativa *
                </label>
                <textarea
                  rows={4}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Compartilhe suas preferências olfativas, notas preferidas ou dúvidas sobre um pedido..."
                  className="w-full bg-[#121217] border border-[#C9A86C]/25 text-xs text-[#F8F6F0] p-3 rounded-xs focus:outline-none focus:border-[#C9A86C]"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#C9A86C] hover:bg-[#DFC48F] text-[#070708] font-semibold text-xs uppercase tracking-[0.2em] py-3.5 rounded-xs transition-colors flex items-center justify-center gap-2"
              >
                <Send size={15} />
                <span>Enviar para a Maison</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
