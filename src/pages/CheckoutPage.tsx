import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { 
  formatCurrency, 
  maskPhone, 
  maskCep, 
  fetchAddressByCep, 
  calculateShippingOptions 
} from '../lib/shipping';
import { ShippingOption, Order } from '../types';
import { createOrderService, createLeadService } from '../lib/firebase';
import { getWhatsAppOrderUrl, MIRAGE_WHATSAPP_NUMBER } from '../lib/whatsapp';
import { 
  Lock, 
  ShieldCheck, 
  Truck, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  Tag, 
  AlertCircle, 
  Loader2, 
  MessageCircle,
  ShoppingBag
} from 'lucide-react';

interface CheckoutPageProps {
  onOrderCompleted: (order: Order) => void;
  onBackToCart: () => void;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({
  onOrderCompleted,
  onBackToCart,
}) => {
  const { 
    cart, 
    cartSubtotal, 
    appliedCoupon, 
    applyCoupon, 
    removeCoupon, 
    discountAmount, 
    clearCart 
  } = useCart();

  // Form Fields
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [cep, setCep] = useState('');
  const [street, setStreet] = useState('');
  const [number, setNumber] = useState('');
  const [complement, setComplement] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [notes, setNotes] = useState('');

  // Shipping & Loading States
  const [isLoadingCep, setIsLoadingCep] = useState(false);
  const [cepError, setCepError] = useState<string | null>(null);
  const [shippingOptions, setShippingOptions] = useState<ShippingOption[]>([]);
  const [selectedShipping, setSelectedShipping] = useState<ShippingOption | null>(null);

  // Coupon state inside checkout
  const [couponInput, setCouponInput] = useState('');
  const [couponMsg, setCouponMsg] = useState<{ text: string; isError: boolean } | null>(null);
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

  // Order submission
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Auto-lookup CEP when 8 digits are entered
  const handleCepChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    const masked = maskCep(raw);
    setCep(masked);
    setCepError(null);

    const clean = raw.replace(/\D/g, '');
    if (clean.length === 8) {
      setIsLoadingCep(true);
      const res = await fetchAddressByCep(clean);
      setIsLoadingCep(false);

      if (res.isValid) {
        setStreet(res.street);
        setNeighborhood(res.neighborhood);
        setCity(res.city);
        setState(res.state);

        // Calculate shipping rates
        const options = calculateShippingOptions(res.state, cartSubtotal);
        setShippingOptions(options);
        setSelectedShipping(options[0]);
      } else {
        setCepError(res.error || 'CEP não encontrado');
        setShippingOptions([]);
        setSelectedShipping(null);
      }
    } else {
      setShippingOptions([]);
      setSelectedShipping(null);
    }
  };

  // Re-calculate shipping if cartSubtotal or state changes
  useEffect(() => {
    if (state && cartSubtotal > 0) {
      const options = calculateShippingOptions(state, cartSubtotal);
      setShippingOptions(options);
      if (selectedShipping) {
        const match = options.find((o) => o.id === selectedShipping.id);
        setSelectedShipping(match || options[0]);
      } else {
        setSelectedShipping(options[0]);
      }
    }
  }, [cartSubtotal, state]);

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    setIsApplyingCoupon(true);
    setCouponMsg(null);
    const res = await applyCoupon(couponInput);
    setIsApplyingCoupon(false);
    setCouponMsg({ text: res.message, isError: !res.success });
    if (res.success) setCouponInput('');
  };

  const shippingPrice = selectedShipping ? selectedShipping.price : 0;
  const grandTotal = Math.max(0, cartSubtotal - discountAmount + shippingPrice);

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    // Validation
    if (!fullName.trim() || fullName.trim().split(' ').length < 2) {
      setFormError('Por favor, informe seu nome completo.');
      return;
    }
    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      setFormError('Por favor, informe um telefone válido com DDD (ex: 21 98765-4321).');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setFormError('Por favor, informe um e-mail válido.');
      return;
    }
    const cleanCep = cep.replace(/\D/g, '');
    if (cleanCep.length !== 8) {
      setFormError('Por favor, informe um CEP válido com 8 dígitos.');
      return;
    }
    if (!street.trim() || !number.trim() || !neighborhood.trim() || !city.trim() || !state.trim()) {
      setFormError('Por favor, preencha todos os campos obrigatórios do endereço.');
      return;
    }
    if (!selectedShipping) {
      setFormError('Por favor, selecione uma modalidade de frete para a entrega.');
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Capture lead for CRM/abandonment recovery
      await createLeadService({
        email: email.trim(),
        name: fullName.trim(),
        phone: phone.trim(),
        source: 'checkout_abandonment',
        createdAt: new Date().toISOString(),
      });

      // 2. Prepare Order Object
      const orderData: Omit<Order, 'id'> = {
        customerName: fullName.trim(),
        customerEmail: email.trim(),
        customerPhone: phone.trim(),
        cep: cep.trim(),
        street: street.trim(),
        number: number.trim(),
        complement: complement.trim(),
        neighborhood: neighborhood.trim(),
        city: city.trim(),
        state: state.trim(),
        items: cart.map((item) => ({
          productId: item.product.id,
          name: item.product.name,
          price: item.product.promotionalPrice || item.product.price,
          quantity: item.quantity,
          volume: item.selectedVolume,
          image: item.product.images[0],
        })),
        subtotal: cartSubtotal,
        shippingPrice,
        shippingType: selectedShipping.name,
        shippingDeadline: selectedShipping.deadline,
        discount: discountAmount,
        couponCode: appliedCoupon?.code,
        total: grandTotal,
        notes: notes.trim(),
        status: 'novo',
        createdAt: new Date().toISOString(),
      };

      // 3. Save Order to Firestore
      const orderId = await createOrderService(orderData);
      const completedOrder: Order = { ...orderData, id: orderId };

      // 4. Send automatically to WhatsApp: +55 21 98077-9429
      const waUrl = getWhatsAppOrderUrl(completedOrder);
      try {
        window.open(waUrl, '_blank');
      } catch (err) {
        console.warn('Popup blocked, WhatsApp direct link ready on confirmation page');
      }

      // 5. Clear cart and trigger success page
      clearCart();
      onOrderCompleted(completedOrder);
    } catch (err) {
      console.error('Error submitting order:', err);
      setFormError('Ocorreu um erro ao registrar seu pedido. Por favor, tente novamente ou entre em contato pelo WhatsApp.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center space-y-4">
        <div className="w-16 h-16 rounded-full border border-[#C9A86C]/30 flex items-center justify-center text-[#C9A86C] mx-auto">
          <ShoppingBag size={28} />
        </div>
        <h2 className="font-cinzel text-2xl text-[#F8F6F0]">Sua sacola está vazia</h2>
        <p className="text-xs text-[#8C8880] leading-relaxed">
          Adicione uma fragrância da nossa Coleção Privée para prosseguir para o checkout seguro.
        </p>
        <button
          onClick={onBackToCart}
          className="mt-4 bg-[#C9A86C] text-[#070708] text-xs uppercase tracking-[0.2em] font-semibold px-6 py-3 rounded-xs"
        >
          Explorar Acervo
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      
      {/* Title */}
      <div className="text-center max-w-2xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 bg-[#121217] border border-[#C9A86C]/30 px-3 py-1 rounded-full mb-3 text-[11px] text-[#C9A86C] uppercase tracking-[0.2em]">
          <Lock size={12} />
          <span>Checkout de Alta Segurança 256-bit</span>
        </div>
        <h1 className="font-cinzel text-3xl sm:text-4xl text-[#F8F6F0] font-light uppercase tracking-wider">
          Finalização Exclusiva
        </h1>
        <p className="text-xs text-[#8C8880] mt-1.5">
          Seu pedido será preparado artesanalmente e enviado para confirmação direta com nosso Concierge no WhatsApp.
        </p>
      </div>

      <form onSubmit={handleSubmitOrder}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
          
          {/* Left Column: Customer and Delivery Details */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* Step 1: Personal Data */}
            <div className="bg-[#0b0b0f] border border-[#C9A86C]/20 p-6 sm:p-8 rounded-xs space-y-5">
              <div className="flex items-center gap-3 border-b border-[#C9A86C]/15 pb-4">
                <div className="w-7 h-7 rounded-full bg-[#C9A86C] text-[#070708] font-cinzel font-bold text-xs flex items-center justify-center">
                  1
                </div>
                <div>
                  <h3 className="font-cinzel text-base text-[#F8F6F0] uppercase tracking-wider">
                    Dados do Titular
                  </h3>
                  <span className="text-[10px] text-[#8C8880] block">Para emissão do certificado e rastreio</span>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#D1CEC7] mb-1.5 font-medium">
                    Nome Completo *
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Ex: Alexandre de Médici"
                    className="w-full bg-[#121217] border border-[#C9A86C]/25 text-xs text-[#F8F6F0] px-3.5 py-3 rounded-xs focus:outline-none focus:border-[#C9A86C] placeholder:text-[#5E5B55]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-[#D1CEC7] mb-1.5 font-medium">
                      Telefone / WhatsApp *
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(maskPhone(e.target.value))}
                      placeholder="(21) 98077-9429"
                      className="w-full bg-[#121217] border border-[#C9A86C]/25 text-xs text-[#F8F6F0] px-3.5 py-3 rounded-xs focus:outline-none focus:border-[#C9A86C] placeholder:text-[#5E5B55]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-[#D1CEC7] mb-1.5 font-medium">
                      E-mail *
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="seu.email@exemplo.com"
                      className="w-full bg-[#121217] border border-[#C9A86C]/25 text-xs text-[#F8F6F0] px-3.5 py-3 rounded-xs focus:outline-none focus:border-[#C9A86C] placeholder:text-[#5E5B55]"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Step 2: Delivery Address & Real-Time CEP */}
            <div className="bg-[#0b0b0f] border border-[#C9A86C]/20 p-6 sm:p-8 rounded-xs space-y-5">
              <div className="flex items-center gap-3 border-b border-[#C9A86C]/15 pb-4">
                <div className="w-7 h-7 rounded-full bg-[#C9A86C] text-[#070708] font-cinzel font-bold text-xs flex items-center justify-center">
                  2
                </div>
                <div>
                  <h3 className="font-cinzel text-base text-[#F8F6F0] uppercase tracking-wider">
                    Endereço de Entrega
                  </h3>
                  <span className="text-[10px] text-[#8C8880] block">Envio blindado em caixa rígida</span>
                </div>
              </div>

              <div className="space-y-4">
                {/* CEP with Loading & Auto Lookup */}
                <div className="max-w-xs">
                  <label className="block text-[11px] uppercase tracking-wider text-[#D1CEC7] mb-1.5 font-medium flex items-center justify-between">
                    <span>CEP *</span>
                    {isLoadingCep && (
                      <span className="text-[#C9A86C] flex items-center gap-1 text-[10px]">
                        <Loader2 size={12} className="animate-spin" /> Buscando endereço...
                      </span>
                    )}
                  </label>
                  <input
                    type="text"
                    required
                    value={cep}
                    onChange={handleCepChange}
                    placeholder="00000-000"
                    maxLength={9}
                    className="w-full bg-[#121217] border border-[#C9A86C]/25 text-xs text-[#F8F6F0] px-3.5 py-3 rounded-xs focus:outline-none focus:border-[#C9A86C] placeholder:text-[#5E5B55] font-mono"
                  />
                  {cepError && (
                    <span className="text-[11px] text-[#E57373] mt-1 block flex items-center gap-1">
                      <AlertCircle size={12} /> {cepError}
                    </span>
                  )}
                </div>

                {/* Street & Number */}
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
                  <div className="sm:col-span-9">
                    <label className="block text-[11px] uppercase tracking-wider text-[#D1CEC7] mb-1.5 font-medium">
                      Logradouro / Rua / Avenida *
                    </label>
                    <input
                      type="text"
                      required
                      value={street}
                      onChange={(e) => setStreet(e.target.value)}
                      placeholder="Ex: Av. Vieira Souto"
                      className="w-full bg-[#121217] border border-[#C9A86C]/25 text-xs text-[#F8F6F0] px-3.5 py-3 rounded-xs focus:outline-none focus:border-[#C9A86C] placeholder:text-[#5E5B55]"
                    />
                  </div>

                  <div className="sm:col-span-3">
                    <label className="block text-[11px] uppercase tracking-wider text-[#D1CEC7] mb-1.5 font-medium">
                      Número *
                    </label>
                    <input
                      type="text"
                      required
                      value={number}
                      onChange={(e) => setNumber(e.target.value)}
                      placeholder="100"
                      className="w-full bg-[#121217] border border-[#C9A86C]/25 text-xs text-[#F8F6F0] px-3.5 py-3 rounded-xs focus:outline-none focus:border-[#C9A86C] placeholder:text-[#5E5B55]"
                    />
                  </div>
                </div>

                {/* Complement & Neighborhood */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-[#D1CEC7] mb-1.5 font-medium">
                      Complemento (Opcional)
                    </label>
                    <input
                      type="text"
                      value={complement}
                      onChange={(e) => setComplement(e.target.value)}
                      placeholder="Apto 402, Bloco B"
                      className="w-full bg-[#121217] border border-[#C9A86C]/25 text-xs text-[#F8F6F0] px-3.5 py-3 rounded-xs focus:outline-none focus:border-[#C9A86C] placeholder:text-[#5E5B55]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-[#D1CEC7] mb-1.5 font-medium">
                      Bairro *
                    </label>
                    <input
                      type="text"
                      required
                      value={neighborhood}
                      onChange={(e) => setNeighborhood(e.target.value)}
                      placeholder="Ipanema"
                      className="w-full bg-[#121217] border border-[#C9A86C]/25 text-xs text-[#F8F6F0] px-3.5 py-3 rounded-xs focus:outline-none focus:border-[#C9A86C] placeholder:text-[#5E5B55]"
                    />
                  </div>
                </div>

                {/* City & State */}
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
                  <div className="sm:col-span-8">
                    <label className="block text-[11px] uppercase tracking-wider text-[#D1CEC7] mb-1.5 font-medium">
                      Cidade *
                    </label>
                    <input
                      type="text"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="Rio de Janeiro"
                      className="w-full bg-[#121217] border border-[#C9A86C]/25 text-xs text-[#F8F6F0] px-3.5 py-3 rounded-xs focus:outline-none focus:border-[#C9A86C] placeholder:text-[#5E5B55]"
                    />
                  </div>

                  <div className="sm:col-span-4">
                    <label className="block text-[11px] uppercase tracking-wider text-[#D1CEC7] mb-1.5 font-medium">
                      Estado (UF) *
                    </label>
                    <input
                      type="text"
                      required
                      value={state}
                      maxLength={2}
                      onChange={(e) => setState(e.target.value.toUpperCase())}
                      placeholder="RJ"
                      className="w-full bg-[#121217] border border-[#C9A86C]/25 text-xs text-[#F8F6F0] px-3.5 py-3 rounded-xs focus:outline-none focus:border-[#C9A86C] uppercase placeholder:text-[#5E5B55]"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Step 3: Shipping Carriers (Real-time Correios & JadLog) */}
            <div className="bg-[#0b0b0f] border border-[#C9A86C]/20 p-6 sm:p-8 rounded-xs space-y-5">
              <div className="flex items-center gap-3 border-b border-[#C9A86C]/15 pb-4">
                <div className="w-7 h-7 rounded-full bg-[#C9A86C] text-[#070708] font-cinzel font-bold text-xs flex items-center justify-center">
                  3
                </div>
                <div>
                  <h3 className="font-cinzel text-base text-[#F8F6F0] uppercase tracking-wider">
                    Modalidade de Envio
                  </h3>
                  <span className="text-[10px] text-[#8C8880] block">
                    {shippingOptions.length > 0 
                      ? 'Selecione a transportadora de sua preferência' 
                      : 'Digite seu CEP acima para carregar as opções de frete'}
                  </span>
                </div>
              </div>

              {shippingOptions.length === 0 ? (
                <div className="p-4 border border-dashed border-[#C9A86C]/20 rounded-xs text-center text-xs text-[#8C8880]">
                  Preencha o CEP no formulário de endereço para calcular o frete com Correios e JadLog em tempo real.
                </div>
              ) : (
                <div className="space-y-3">
                  {shippingOptions.map((opt) => {
                    const isSelected = selectedShipping?.id === opt.id;
                    return (
                      <div
                        key={opt.id}
                        onClick={() => setSelectedShipping(opt)}
                        className={`p-4 rounded-xs border transition-all cursor-pointer flex items-center justify-between ${
                          isSelected
                            ? 'bg-[#14141c] border-[#C9A86C] ring-1 ring-[#C9A86C]/50'
                            : 'bg-[#0e0e13] border-[#C9A86C]/15 hover:border-[#C9A86C]/40'
                        }`}
                      >
                        <div className="flex items-center gap-3.5">
                          <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                            isSelected ? 'border-[#C9A86C] bg-[#C9A86C]' : 'border-[#6E6B65]'
                          }`}>
                            {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-[#070708]" />}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-cinzel text-xs font-semibold text-[#F8F6F0]">
                                {opt.name} ({opt.carrier})
                              </span>
                            </div>
                            <span className="text-[11px] text-[#9E9A92] block mt-0.5">
                              Prazo: <strong>{opt.deadline}</strong> • {opt.description}
                            </span>
                          </div>
                        </div>

                        <div className="text-right font-cinzel text-sm font-semibold text-[#E8D5B7]">
                          {formatCurrency(opt.price)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Optional Notes */}
            <div className="bg-[#0b0b0f] border border-[#C9A86C]/20 p-6 rounded-xs space-y-2">
              <label className="block text-[11px] uppercase tracking-wider text-[#D1CEC7] font-medium">
                Instruções Especiais ou Mensagem para Presente
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                placeholder="Ex: Por favor incluir cartão com a mensagem: 'Com amor, para sempre sua'..."
                className="w-full bg-[#121217] border border-[#C9A86C]/25 text-xs text-[#F8F6F0] p-3 rounded-xs focus:outline-none focus:border-[#C9A86C] placeholder:text-[#5E5B55]"
              />
            </div>
          </div>

          {/* Right Column: Order Summary & WhatsApp Confirmation CTA */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[#0b0b0f] border border-[#C9A86C]/25 p-6 sm:p-8 rounded-xs sticky top-28 space-y-6 shadow-2xl">
              <div className="border-b border-[#C9A86C]/15 pb-4">
                <h3 className="font-cinzel text-lg text-[#F8F6F0] uppercase tracking-wider">
                  Resumo do Pedido
                </h3>
                <span className="text-[10px] text-[#C9A86C] tracking-widest uppercase">
                  Haute Parfumerie Privée
                </span>
              </div>

              {/* Items List */}
              <div className="space-y-4 max-h-72 overflow-y-auto pr-1">
                {cart.map((item) => {
                  const unitPrice = item.product.promotionalPrice || item.product.price;
                  return (
                    <div key={`${item.product.id}-${item.selectedVolume}`} className="flex gap-3 text-xs">
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="w-14 h-16 object-cover rounded-xs border border-[#C9A86C]/20 shrink-0 bg-[#070708]"
                      />
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <h4 className="font-cinzel font-medium text-[#F8F6F0] line-clamp-1">
                            {item.product.name}
                          </h4>
                          <span className="text-[10px] text-[#C9A86C] block">
                            {item.selectedVolume} • Qtd: {item.quantity}x
                          </span>
                        </div>
                        <span className="font-cinzel text-xs text-[#E8D5B7] font-semibold">
                          {formatCurrency(unitPrice * item.quantity)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Coupon Applicator */}
              <div className="pt-4 border-t border-[#C9A86C]/15">
                {appliedCoupon ? (
                  <div className="flex items-center justify-between bg-[#141b16] border border-[#3E8B59]/40 p-2.5 rounded-xs text-xs">
                    <span className="text-[#82D99E] flex items-center gap-1.5">
                      <Tag size={13} />
                      Cupom <strong>{appliedCoupon.code}</strong> ativo
                    </span>
                    <button
                      type="button"
                      onClick={removeCoupon}
                      className="text-[#9E9A92] hover:text-[#E06D6D] text-[11px] underline"
                    >
                      Remover
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      placeholder="Cupom de desconto"
                      className="bg-[#121217] border border-[#C9A86C]/25 text-xs text-[#F8F6F0] px-3 py-2 rounded-xs uppercase flex-1 focus:outline-none focus:border-[#C9A86C]"
                    />
                    <button
                      type="button"
                      onClick={handleApplyCoupon}
                      disabled={isApplyingCoupon}
                      className="bg-[#1c1c24] hover:bg-[#252530] text-[#E8D5B7] border border-[#C9A86C]/30 text-xs px-3.5 py-2 rounded-xs"
                    >
                      Aplicar
                    </button>
                  </div>
                )}
                {couponMsg && (
                  <p className={`text-[11px] mt-1.5 ${couponMsg.isError ? 'text-[#E57373]' : 'text-[#81C784]'}`}>
                    {couponMsg.text}
                  </p>
                )}
              </div>

              {/* Calculations breakdown */}
              <div className="space-y-2 text-xs text-[#9E9A92] pt-4 border-t border-[#C9A86C]/15">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-[#F8F6F0] font-mono">{formatCurrency(cartSubtotal)}</span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between text-[#81C784]">
                    <span>Desconto ({appliedCoupon?.code})</span>
                    <span className="font-mono">-{formatCurrency(discountAmount)}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Frete ({selectedShipping ? selectedShipping.carrier : 'A calcular'})</span>
                  <span className="text-[#F8F6F0] font-mono">
                    {!selectedShipping 
                      ? 'Informe o CEP' 
                      : formatCurrency(selectedShipping.price)}
                  </span>
                </div>

                <div className="flex justify-between text-base font-cinzel font-medium text-[#F8F6F0] pt-3 border-t border-[#C9A86C]/20">
                  <span>Total Final</span>
                  <span className="text-[#E8D5B7] text-lg font-bold">{formatCurrency(grandTotal)}</span>
                </div>
              </div>

              {/* Form Error Notice */}
              {formError && (
                <div className="bg-[#241215] border border-[#B71C1C]/60 text-[#EF9A9A] text-xs p-3 rounded-xs flex items-center gap-2">
                  <AlertCircle size={16} className="shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              {/* SUBMIT BUTTON WITH AUTOMATIC WHATSAPP INTEGRATION */}
              <div className="space-y-3">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#C9A86C] hover:bg-[#DFC48F] text-[#070708] font-bold text-xs uppercase tracking-[0.2em] py-4 px-4 rounded-xs flex items-center justify-center gap-2 transition-all shadow-xl active:scale-[0.99] disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      <span>Processando Pedido...</span>
                    </>
                  ) : (
                    <>
                      <MessageCircle size={16} />
                      <span>Confirmar & Abrir no WhatsApp</span>
                    </>
                  )}
                </button>

                <p className="text-[10px] text-[#6E6B65] text-center leading-relaxed">
                  Ao confirmar, seu pedido será registrado e você será redirecionado para o WhatsApp oficial 
                  da Mirage Parfum (<strong>+55 21 98077-9429</strong>) com o resumo completo pronto para envio.
                </p>
              </div>

              {/* Security Badges */}
              <div className="pt-4 border-t border-[#C9A86C]/10 flex items-center justify-around text-[10px] text-[#8C8880]">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck size={13} className="text-[#C9A86C]" />
                  <span>Compra 100% Protegida</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Sparkles size={13} className="text-[#C9A86C]" />
                  <span>Amostras de Brinde</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
