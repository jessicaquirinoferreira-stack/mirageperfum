import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Order } from '../types';
import { formatCurrency } from '../lib/shipping';
import { getWhatsAppOrderUrl, MIRAGE_WHATSAPP_NUMBER } from '../lib/whatsapp';
import { 
  CheckCircle2, 
  MessageCircle, 
  Package, 
  Truck, 
  Sparkles, 
  Clock, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

interface OrderSuccessPageProps {
  order: Order;
  onContinueShopping: () => void;
}

export const OrderSuccessPage: React.FC<OrderSuccessPageProps> = ({
  order,
  onContinueShopping,
}) => {
  useEffect(() => {
    // Elegant gold and champagne confetti shower
    const count = 200;
    const defaults = { origin: { y: 0.7 } };

    function fire(particleRatio: number, opts: confetti.Options) {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio),
        colors: ['#C9A86C', '#DFC48F', '#F8F6F0', '#947238', '#E8D5B7'],
      });
    }

    fire(0.25, { spread: 26, startVelocity: 55 });
    fire(0.2, { spread: 60 });
    fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
    fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
    fire(0.1, { spread: 120, startVelocity: 45 });
  }, []);

  const whatsappUrl = getWhatsAppOrderUrl(order);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 text-center">
      
      {/* Golden Seal Icon */}
      <div className="w-20 h-20 rounded-full border border-[#C9A86C]/40 bg-[#0d0d12] flex items-center justify-center text-[#C9A86C] mx-auto mb-6 shadow-2xl relative">
        <CheckCircle2 size={36} />
        <div className="absolute inset-0 rounded-full border border-[#C9A86C]/20 animate-ping opacity-30" />
      </div>

      <div className="inline-flex items-center gap-2 bg-[#121c15] border border-[#3E8B59]/40 text-[#82D99E] px-4 py-1.5 rounded-full text-xs uppercase tracking-[0.2em] mb-4">
        <Sparkles size={13} />
        <span>Pedido Registrado com Sucesso</span>
      </div>

      <h1 className="font-cinzel text-3xl sm:text-4xl lg:text-5xl text-[#F8F6F0] font-light uppercase tracking-wider mb-3">
        Felicitações, {order.customerName.split(' ')[0]}
      </h1>

      <p className="text-xs sm:text-sm text-[#9E9A92] max-w-lg mx-auto leading-relaxed mb-8">
        Sua solicitação de alta perfumaria foi gerada com a referência oficial:
        <span className="block font-mono text-base font-bold text-[#E8D5B7] mt-1">
          #{order.id}
        </span>
      </p>

      {/* PRIMARY WHATSAPP ACTION CALLOUT */}
      <div className="bg-[#101912] border border-[#2d6a3f]/60 p-6 sm:p-8 rounded-xs max-w-xl mx-auto mb-12 text-left space-y-4 shadow-2xl relative overflow-hidden">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-[#1e4a2c] text-[#82D99E] flex items-center justify-center shrink-0">
            <MessageCircle size={24} />
          </div>
          <div>
            <h3 className="font-cinzel text-base text-[#F8F6F0] uppercase tracking-wider">
              Confirmação via WhatsApp
            </h3>
            <p className="text-xs text-[#9E9A92] leading-relaxed mt-1">
              Envie agora o resumo pré-formatado para nosso atendimento oficial (<strong>+55 21 98077-9429</strong>) 
              para que o Concierge libere a preparação do seu frasco.
            </p>
          </div>
        </div>

        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full bg-[#25D366] hover:bg-[#20ba5a] text-[#070708] font-bold text-xs uppercase tracking-[0.2em] py-4 px-6 rounded-xs flex items-center justify-center gap-2.5 transition-all shadow-lg active:scale-95"
        >
          <MessageCircle size={18} />
          <span>Enviar Pedido no WhatsApp (+55 21 98077-9429)</span>
        </a>
      </div>

      {/* Order Summary Card */}
      <div className="bg-[#0b0b0f] border border-[#C9A86C]/20 p-6 sm:p-8 rounded-xs text-left max-w-2xl mx-auto space-y-6">
        <div className="border-b border-[#C9A86C]/15 pb-4 flex items-center justify-between">
          <div>
            <h4 className="font-cinzel text-base text-[#F8F6F0] uppercase tracking-wider">
              Detalhes da Entrega
            </h4>
            <span className="text-[11px] text-[#8C8880] block">
              Destinatário: {order.customerName} • {order.customerPhone}
            </span>
          </div>
          <span className="font-mono text-xs text-[#C9A86C]">
            {order.status.toUpperCase()}
          </span>
        </div>

        {/* Address */}
        <div className="text-xs text-[#D1CEC7] space-y-1 bg-[#121217] p-4 rounded-xs border border-[#C9A86C]/10">
          <p>
            <strong>Endereço:</strong> {order.street}, nº {order.number}
            {order.complement ? ` - ${order.complement}` : ''}
          </p>
          <p>
            <strong>Bairro:</strong> {order.neighborhood} • <strong>Cidade/UF:</strong> {order.city} - {order.state}
          </p>
          <p>
            <strong>CEP:</strong> {order.cep} • <strong>Frete:</strong> {order.shippingType} ({order.shippingDeadline})
          </p>
        </div>

        {/* Items */}
        <div className="space-y-3 pt-2">
          <span className="text-[10px] uppercase tracking-[0.2em] text-[#C9A86C] block">
            Itens Adquiridos:
          </span>
          {order.items.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between text-xs py-2 border-b border-[#C9A86C]/10">
              <div className="flex items-center gap-3">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-10 h-12 object-cover rounded-xs border border-[#C9A86C]/20"
                />
                <div>
                  <h5 className="font-cinzel text-[#F8F6F0] font-medium">{item.name}</h5>
                  <span className="text-[10px] text-[#8C8880]">
                    {item.volume} • Qtd: {item.quantity}x
                  </span>
                </div>
              </div>
              <span className="font-cinzel font-semibold text-[#E8D5B7]">
                {formatCurrency(item.price * item.quantity)}
              </span>
            </div>
          ))}
        </div>

        {/* Financial Recap */}
        <div className="space-y-1.5 text-xs text-[#9E9A92] pt-3 border-t border-[#C9A86C]/15">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span className="font-mono text-[#F8F6F0]">{formatCurrency(order.subtotal)}</span>
          </div>
          {order.discount > 0 && (
            <div className="flex justify-between text-[#81C784]">
              <span>Desconto ({order.couponCode || 'Cupom'})</span>
              <span className="font-mono">-{formatCurrency(order.discount)}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span>Frete ({order.shippingType})</span>
            <span className="font-mono text-[#F8F6F0]">
              {formatCurrency(order.shippingPrice)}
            </span>
          </div>
          <div className="flex justify-between text-base font-cinzel font-medium text-[#F8F6F0] pt-2 border-t border-[#C9A86C]/20">
            <span>Total</span>
            <span className="text-[#E8D5B7] text-lg font-bold">{formatCurrency(order.total)}</span>
          </div>
        </div>
      </div>

      {/* Continue Exploring CTA */}
      <div className="mt-10">
        <button
          onClick={onContinueShopping}
          className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#C9A86C] hover:text-[#DFC48F] transition-colors border-b border-[#C9A86C]/40 pb-1"
        >
          <span>Retornar à Maison Mirage</span>
          <ArrowRight size={14} />
        </button>
      </div>

    </div>
  );
};
