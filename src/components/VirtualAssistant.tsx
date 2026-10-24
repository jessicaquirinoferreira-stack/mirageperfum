import React, { useState, useRef, useEffect } from 'react';
import { Product } from '../types';
import { MIRAGE_WHATSAPP_NUMBER } from '../lib/whatsapp';
import avatarImg from '../assets/images/concierge_avatar.webp';
import { 
  MessageCircle, 
  X, 
  Send, 
  Sparkles, 
  Compass, 
  ChevronRight, 
  Bot,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

interface VirtualAssistantProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
}

interface Message {
  id: string;
  sender: 'assistant' | 'user';
  text: string;
  recommendedProduct?: Product;
  whatsappTopic?: string;
  timestamp: string;
}

export const VirtualAssistant: React.FC<VirtualAssistantProps> = ({
  products,
  onSelectProduct,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showCallout, setShowCallout] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: 'Bienvenue à la Maison Mirage Parfum. Eu sou a Éléonore, sua Concierge Olfativa particular. Como posso ajudá-lo a encontrar sua assinatura olfativa rara hoje?',
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setShowCallout(false);
    }
  }, [isOpen, messages, isTyping]);

  // Quick suggestions
  const quickQuestions = [
    'Qual fragrância você recomenda para noite?',
    'Quero um perfume com Oud e alta fixação',
    'Qual a opção mais elogiada para presente?',
    'Quanto tempo dura a fixação na pele?',
  ];

  const handleSendMessage = (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    // Formulate personalized haute parfumerie consultation response
    setTimeout(() => {
      const lower = text.toLowerCase();
      let responseText = '';
      let matchedProduct: Product | undefined = undefined;
      let waTopic = text;

      if (lower.includes('noite') || lower.includes('noturn') || lower.includes('escuro') || lower.includes('misteri')) {
        matchedProduct = products.find((p) => p.id === 'noir-imperial') || products[0];
        responseText = `Para a noite e ocasiões de destaque, a escolha indiscutível é o **Noir Impérial**. Com notas de incenso de Omã, couro toscano e baunilha negra de Madagascar, ele projeta uma aura magnética e imponente. Para uma experiência personalizada com nosso mestre perfumista, chame nosso Concierge no WhatsApp!`;
        waTopic = 'Consultoria sobre o perfume Noir Impérial para a noite';
      } else if (lower.includes('oud') || lower.includes('madeira') || lower.includes('forte') || lower.includes('ambar')) {
        matchedProduct = products.find((p) => p.id === 'oud-mystique') || products[1];
        responseText = `Se você busca a realeza oriental do Oud, recomendo o **Oud Mystique**. Ele traz Oud selvagem de Assam destilado e envelhecido por 12 anos, envolto em açafrão persa puro. Um néctar inebriante com mais de 24 horas de permanência na pele. Deseja encomendar com o atendimento exclusivo no WhatsApp?`;
        waTopic = 'Interesse na fragrância Oud Mystique';
      } else if (lower.includes('presente') || lower.includes('mulher') || lower.includes('femin') || lower.includes('rosa')) {
        matchedProduct = products.find((p) => p.id === 'rose-velours') || products[2];
        responseText = `Para presentear com sofisticação absoluta, a recomendação suprema é o **Rose Velours**. Uma rosa Centifolia de Grasse colhida na aurora, com caxemira aveludada e almíscar branco. Acompanha nossa caixa rígida presenteável de veludo. Fale agora com nosso Concierge no WhatsApp para embalagem personalizada!`;
        waTopic = 'Dúvida sobre presente com a fragrância Rose Velours';
      } else if (lower.includes('fixa') || lower.includes('dura') || lower.includes('concentra') || lower.includes('horas')) {
        responseText = `Todas as criações da Mirage Parfum possuem concentração genuína **Extrait de Parfum (25% a 35% de essências nobres puras)**. Isso garante uma fixação extraordinária de **18h a mais de 24 horas na pele**, evoluindo conforme a temperatura corporal. Para receber orientações olfativas detalhadas, chame nosso atendimento oficial no WhatsApp!`;
        waTopic = 'Informações sobre a alta fixação de 18h+ e concentração';
      } else if (lower.includes('frete') || lower.includes('entrega') || lower.includes('envio') || lower.includes('prazo')) {
        responseText = `Realizamos envios para todo o Brasil via **Sedex Exclusif** e **JadLog Package Privé**, com seguro total contra avarias e caixa lacrada inviolável. O valor e o prazo são calculados automaticamente no checkout pelo seu CEP. Posso ajudar a rastrear ou fechar seu pedido pelo WhatsApp da Maison!`;
        waTopic = 'Dúvidas sobre envio, prazos e modalidades de entrega';
      } else {
        matchedProduct = products.find((p) => p.isBestseller) || products[0];
        responseText = `Entendo perfeitamente o seu desejo por exclusividade. Nossa Maison trabalha com matérias-primas raras de Grasse e do Oriente. Para encontrar a criação que harmoniza exatamente com sua personalidade e ocasião, convido você a falar diretamente com nossos especialistas no WhatsApp oficial!`;
        waTopic = `Dúvida do cliente: ${text.slice(0, 50)}`;
      }

      const botMsg: Message = {
        id: `assistant-${Date.now()}`,
        sender: 'assistant',
        text: responseText,
        recommendedProduct: matchedProduct,
        whatsappTopic: waTopic,
        timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 800);
  };

  return (
    <div className="fixed bottom-5 left-5 z-40 select-none">
      
      {/* 1. Proactive Floating Callout Bubble */}
      {!isOpen && showCallout && (
        <div className="absolute bottom-18 left-0 w-64 bg-[#0e0e14] border border-[#C9A86C]/35 p-3 rounded-xl shadow-2xl text-xs text-[#F8F6F0] animate-in fade-in slide-in-from-bottom-2 duration-300">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowCallout(false);
            }}
            className="absolute top-1.5 right-1.5 text-[#8C8880] hover:text-[#C9A86C]"
          >
            <X size={12} />
          </button>
          <div className="flex items-center gap-2 mb-1 text-[#C9A86C] font-semibold text-[11px] uppercase tracking-wider">
            <Sparkles size={12} />
            <span>Concierge Privée</span>
          </div>
          <p className="text-[11px] text-[#D1CEC7] leading-relaxed">
            Deseja uma recomendação olfativa personalizada ou falar no WhatsApp?
          </p>
        </div>
      )}

      {/* 2. Floating Avatar Trigger Button on the Left */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center gap-3 bg-[#0a0a0f] hover:bg-[#12121a] border-2 border-[#C9A86C]/70 hover:border-[#C9A86C] p-1.5 pr-4 rounded-full shadow-[0_0_25px_rgba(201,168,108,0.3)] transition-all duration-300 hover:scale-105 active:scale-95"
          aria-label="Abrir Assistente Virtual"
        >
          {/* Avatar Picture with Golden Ring */}
          <div className="relative w-12 h-12 rounded-full overflow-hidden border border-[#C9A86C]/50 shrink-0">
            <img
              src={avatarImg}
              alt="Éléonore - Concierge Olfativa"
              className="w-full h-full object-cover object-top"
            />
            {/* Live Indicator */}
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-[#0a0a0f] shadow-sm animate-pulse" />
          </div>

          <div className="text-left hidden sm:block">
            <span className="font-cinzel text-xs font-semibold text-[#F8F6F0] block leading-tight group-hover:text-[#E8D5B7] transition-colors">
              Éléonore
            </span>
            <span className="text-[9px] uppercase tracking-widest text-[#C9A86C] block">
              Concierge Virtual
            </span>
          </div>
        </button>
      )}

      {/* 3. Expanded Chat Window */}
      {isOpen && (
        <div className="w-[330px] sm:w-[380px] h-[520px] max-h-[85vh] bg-[#0c0c12]/98 border border-[#C9A86C]/40 backdrop-blur-xl rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
          
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-[#12121a] to-[#0a0a0f] border-b border-[#C9A86C]/20 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 rounded-full overflow-hidden border border-[#C9A86C]/60 shrink-0">
                <img
                  src={avatarImg}
                  alt="Éléonore"
                  className="w-full h-full object-cover object-top"
                />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-[#0c0c12]" />
              </div>
              <div>
                <h4 className="font-cinzel text-xs font-bold text-[#F8F6F0] tracking-wider uppercase">
                  Éléonore • Concierge
                </h4>
                <span className="text-[10px] text-[#82D99E] flex items-center gap-1 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#82D99E] animate-ping" />
                  Maison Mirage • Online
                </span>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="text-[#9E9A92] hover:text-[#C9A86C] p-1.5 transition-colors"
              aria-label="Fechar chat"
            >
              <X size={18} />
            </button>
          </div>

          {/* Messages Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] p-3 rounded-xl leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-[#C9A86C] text-[#070708] font-medium rounded-br-xs'
                      : 'bg-[#15151e] border border-[#C9A86C]/20 text-[#E8D5B7] rounded-bl-xs'
                  }`}
                >
                  <p className="text-[11px] whitespace-pre-line">{msg.text}</p>

                  {/* Recommendation Card attached to bot response */}
                  {msg.recommendedProduct && (
                    <div 
                      onClick={() => {
                        onSelectProduct(msg.recommendedProduct!);
                        setIsOpen(false);
                      }}
                      className="mt-3 p-2.5 bg-[#09090d] border border-[#C9A86C]/30 rounded-lg flex items-center gap-3 cursor-pointer hover:border-[#C9A86C] transition-all group"
                    >
                      <img
                        src={msg.recommendedProduct.images[0]}
                        alt={msg.recommendedProduct.name}
                        className="w-12 h-14 object-cover rounded-xs border border-[#C9A86C]/20 bg-[#070708]"
                      />
                      <div className="flex-1 min-w-0">
                        <span className="text-[9px] uppercase tracking-wider text-[#C9A86C] block">
                          {msg.recommendedProduct.concentration}
                        </span>
                        <h5 className="font-cinzel text-xs font-semibold text-[#F8F6F0] group-hover:text-[#E8D5B7] truncate">
                          {msg.recommendedProduct.name}
                        </h5>
                        <span className="text-[10px] text-[#9E9A92] flex items-center gap-1 mt-0.5">
                          <span>Ver Detalhes do Frasco</span>
                          <ArrowRight size={10} className="text-[#C9A86C]" />
                        </span>
                      </div>
                    </div>
                  )}

                  {/* WhatsApp Action Button in Assistant message */}
                  {msg.sender === 'assistant' && (
                    <div className="mt-3 pt-2.5 border-t border-[#C9A86C]/15">
                      <a
                        href={`https://api.whatsapp.com/send?phone=${MIRAGE_WHATSAPP_NUMBER}&text=${encodeURIComponent(`Olá! Estava conversando com a Éléonore no site da Mirage Parfum sobre: "${msg.whatsappTopic || msg.text.slice(0, 60)}" e gostaria de atendimento exclusivo.`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 bg-[#1b3d26] hover:bg-[#235233] text-[#82D99E] border border-[#3E8B59]/40 text-[10px] uppercase tracking-wider px-3 py-1.5 rounded-full font-semibold transition-all hover:scale-105"
                      >
                        <MessageCircle size={13} />
                        <span>Chamar no WhatsApp (+55 21 98077-9429)</span>
                      </a>
                    </div>
                  )}
                </div>
                <span className="text-[9px] text-[#6E6B65] mt-1 px-1">
                  {msg.timestamp}
                </span>
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex items-center gap-2 text-[#C9A86C] text-[11px] p-2 bg-[#15151e] rounded-xl border border-[#C9A86C]/15 w-fit">
                <Sparkles size={12} className="animate-spin" />
                <span>Éléonore está formulando uma recomendação...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Questions Pills */}
          <div className="p-2.5 bg-[#0a0a0f] border-t border-[#C9A86C]/15 overflow-x-auto whitespace-nowrap space-x-2 flex">
            {quickQuestions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(q)}
                className="text-[10px] bg-[#121218] hover:bg-[#1a1a24] text-[#D1CEC7] hover:text-[#E8D5B7] border border-[#C9A86C]/20 px-2.5 py-1 rounded-full transition-colors shrink-0"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Bottom Fixed WhatsApp Banner */}
          <div className="px-3 py-2 bg-[#08080b] border-t border-[#C9A86C]/10 flex items-center justify-between text-[10px]">
            <span className="text-[#8C8880]">Atendimento oficial direto:</span>
            <a
              href={`https://api.whatsapp.com/send?phone=${MIRAGE_WHATSAPP_NUMBER}&text=${encodeURIComponent('Olá, gostaria de falar com a equipe de Concierge da Mirage Parfum.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#82D99E] hover:underline flex items-center gap-1 font-semibold"
            >
              <MessageCircle size={11} />
              <span>+55 21 98077-9429</span>
            </a>
          </div>

          {/* Input Area */}
          <div className="p-3 bg-[#0a0a0f] border-t border-[#C9A86C]/15 flex items-center gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSendMessage();
              }}
              placeholder="Pergunte sobre notas, fixação ou recomendações..."
              className="flex-1 bg-[#121217] border border-[#C9A86C]/25 text-[#F8F6F0] text-xs px-3 py-2 rounded-lg focus:outline-none focus:border-[#C9A86C] placeholder:text-[#5E5B55]"
            />
            <button
              onClick={() => handleSendMessage()}
              className="bg-[#C9A86C] hover:bg-[#DFC48F] text-[#070708] p-2 rounded-lg transition-colors shrink-0"
              aria-label="Enviar mensagem"
            >
              <Send size={14} />
            </button>
          </div>

        </div>
      )}

    </div>
  );
};
