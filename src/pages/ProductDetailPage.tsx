import React, { useState } from 'react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { formatCurrency } from '../lib/shipping';
import { MIRAGE_WHATSAPP_NUMBER } from '../lib/whatsapp';
import { ProductCard } from '../components/ProductCard';
import { 
  Heart, 
  ShoppingBag, 
  Sparkles, 
  ShieldCheck, 
  Truck, 
  ArrowLeft, 
  Clock, 
  Wind, 
  Compass, 
  Check, 
  MessageCircle,
  ChevronDown
} from 'lucide-react';

interface ProductDetailPageProps {
  product: Product;
  allProducts: Product[];
  onBack: () => void;
  onSelectProduct: (product: Product) => void;
  onProceedToCheckout: () => void;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({
  product,
  allProducts,
  onBack,
  onSelectProduct,
  onProceedToCheckout,
}) => {
  const { addToCart, toggleWishlist, isInWishlist } = useCart();
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVolume, setSelectedVolume] = useState(product.volume || '100ml');
  const [quantity, setQuantity] = useState(1);
  const [showAddedNotice, setShowAddedNotice] = useState(false);
  const [openAccordion, setOpenAccordion] = useState<string | null>('ritual');

  const isWish = isInWishlist(product.id);
  const currentPrice = product.promotionalPrice || product.price;
  const hasDiscount = !!product.promotionalPrice && product.promotionalPrice < product.price;
  const installments = (currentPrice / 10).toFixed(2).replace('.', ',');

  const related = allProducts
    .filter((p) => p.id !== product.id && p.category === product.category)
    .slice(0, 4);

  const fallbackRelated = related.length > 0 
    ? related 
    : allProducts.filter((p) => p.id !== product.id).slice(0, 4);

  const handleAdd = () => {
    addToCart(product, selectedVolume, quantity);
    setShowAddedNotice(true);
    setTimeout(() => setShowAddedNotice(false), 3000);
  };

  const handleBuyNow = () => {
    addToCart(product, selectedVolume, quantity);
    onProceedToCheckout();
  };

  const toggleAcc = (id: string) => {
    setOpenAccordion(openAccordion === id ? null : id);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      
      {/* Back button and breadcrumb */}
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#C9A86C]/15">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#9E9A92] hover:text-[#C9A86C] transition-colors"
        >
          <ArrowLeft size={14} />
          <span>Voltar ao Acervo</span>
        </button>

        <div className="text-[11px] text-[#6E6B65] uppercase tracking-wider hidden sm:block">
          <span>Início</span> / <span className="text-[#9E9A92]">Coleções</span> / <span className="text-[#C9A86C]">{product.name}</span>
        </div>
      </div>

      {/* Main Showcase Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
        
        {/* Left Column: Image Gallery */}
        <div className="lg:col-span-7 flex flex-col-reverse md:flex-row gap-4">
          
          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex md:flex-col gap-3 shrink-0 overflow-x-auto md:overflow-y-auto">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`w-16 h-20 md:w-20 md:h-24 rounded-xs overflow-hidden border transition-all shrink-0 bg-[#070708] ${
                    selectedImage === idx
                      ? 'border-[#C9A86C] ring-1 ring-[#C9A86C]'
                      : 'border-[#C9A86C]/20 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`${product.name} view ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Main Large Image */}
          <div className="flex-1 relative aspect-[3/4] rounded-xs overflow-hidden border border-[#C9A86C]/30 bg-[#08080a] shadow-2xl flex items-center justify-center">
            <img
              src={product.images[selectedImage] || product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover object-center transition-all duration-700 hover:scale-105"
              loading="eager"
              decoding="async"
            />
            
            {/* Top Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-2 pointer-events-none">
              <span className="bg-[#070708]/85 border border-[#C9A86C]/40 text-[#E8D5B7] text-[10px] uppercase tracking-[0.2em] px-3 py-1 rounded-xs backdrop-blur-md">
                {product.concentration}
              </span>
              {product.isBestseller && (
                <span className="bg-[#C9A86C] text-[#070708] font-bold text-[9px] uppercase tracking-[0.2em] px-2.5 py-0.5 rounded-xs flex items-center gap-1">
                  <Sparkles size={11} />
                  Best-Seller
                </span>
              )}
            </div>

            {/* Wishlist Button */}
            <button
              onClick={() => toggleWishlist(product)}
              className={`absolute top-4 right-4 w-10 h-10 rounded-full border flex items-center justify-center transition-all shadow-lg ${
                isWish
                  ? 'bg-[#C9A86C] text-[#070708] border-[#C9A86C]'
                  : 'bg-[#070708]/80 border-[#C9A86C]/30 text-[#D1CEC7] hover:text-[#C9A86C] hover:border-[#C9A86C]'
              }`}
              title="Adicionar à lista de desejos"
            >
              <Heart size={18} className={isWish ? 'fill-[#070708]' : ''} />
            </button>
          </div>
        </div>

        {/* Right Column: Narrative, Notes, Buy Options */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
          
          <div className="space-y-4">
            <span className="text-[11px] uppercase tracking-[0.3em] text-[#C9A86C] font-semibold block">
              {product.category} • {product.gender}
            </span>

            <h1 className="font-cinzel text-3xl sm:text-4xl text-[#F8F6F0] font-light tracking-wide leading-tight">
              {product.name}
            </h1>

            <p className="text-xs uppercase tracking-[0.2em] text-[#E8D5B7] font-medium">
              {product.subtitle}
            </p>

            {/* Price section */}
            <div className="pt-2 pb-4 border-y border-[#C9A86C]/15 flex items-baseline justify-between">
              <div>
                {hasDiscount && (
                  <span className="text-xs text-[#6E6B65] line-through block font-mono">
                    {formatCurrency(product.price)}
                  </span>
                )}
                <span className="font-cinzel text-2xl sm:text-3xl font-semibold text-[#E8D5B7]">
                  {formatCurrency(currentPrice)}
                </span>
                <span className="text-[11px] text-[#9E9A92] block mt-0.5">
                  ou em até 10x de R$ {installments} sem juros
                </span>
              </div>

              <div className="text-right">
                <span className="inline-flex items-center gap-1.5 text-[11px] text-[#81C784] font-medium">
                  <span className="w-2 h-2 rounded-full bg-[#81C784] animate-pulse" />
                  Pronta Entrega no Brasil
                </span>
                <span className="text-[10px] text-[#6E6B65] block">
                  Envio seguro em até 24h
                </span>
              </div>
            </div>

            {/* Volume Selector */}
            <div className="space-y-2 pt-2">
              <span className="text-[11px] uppercase tracking-[0.2em] text-[#D1CEC7] block font-medium">
                Volume & Apresentação:
              </span>
              <div className="flex flex-wrap gap-2.5">
                {(product.availableVolumes || ['50ml', '100ml']).map((vol) => (
                  <button
                    key={vol}
                    onClick={() => setSelectedVolume(vol)}
                    className={`text-xs px-4 py-2.5 rounded-xs uppercase tracking-wider transition-all border ${
                      selectedVolume === vol
                        ? 'border-[#C9A86C] bg-[#C9A86C]/15 text-[#E8D5B7] font-semibold shadow-sm'
                        : 'border-[#C9A86C]/20 bg-[#0d0d12] text-[#9E9A92] hover:border-[#C9A86C]/50 hover:text-[#F8F6F0]'
                    }`}
                  >
                    {vol}
                  </button>
                ))}
              </div>
            </div>

            {/* Performance Gauges: Longevity & Sillage */}
            <div className="bg-[#0b0b10] border border-[#C9A86C]/15 p-4 rounded-xs space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2 text-[#C9A86C]">
                  <Clock size={14} />
                  <span>Fixação na Pele:</span>
                </span>
                <span className="text-[#F8F6F0] font-medium">{product.longevity}</span>
              </div>
              <div className="w-full bg-[#161620] h-1 rounded-full overflow-hidden">
                <div className="bg-[#C9A86C] h-full w-[95%]" />
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <span className="flex items-center gap-2 text-[#C9A86C]">
                  <Wind size={14} />
                  <span>Projeção & Rastro:</span>
                </span>
                <span className="text-[#F8F6F0] font-medium">{product.sillage}</span>
              </div>
              <div className="w-full bg-[#161620] h-1 rounded-full overflow-hidden">
                <div className="bg-[#C9A86C] h-full w-[90%]" />
              </div>
            </div>

            {/* Quantity and Actions */}
            <div className="pt-4 space-y-3">
              <div className="flex gap-3">
                {/* Counter */}
                <div className="flex items-center border border-[#C9A86C]/30 rounded-xs bg-[#0b0b10] px-2 shrink-0">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-2.5 py-3 text-[#9E9A92] hover:text-[#C9A86C] transition-colors"
                  >
                    -
                  </button>
                  <span className="px-3 text-xs font-mono font-bold text-[#F8F6F0]">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-2.5 py-3 text-[#9E9A92] hover:text-[#C9A86C] transition-colors"
                  >
                    +
                  </button>
                </div>

                {/* Add to Bag */}
                <button
                  onClick={handleAdd}
                  className="flex-1 bg-[#C9A86C] hover:bg-[#DFC48F] text-[#070708] font-semibold text-xs uppercase tracking-[0.2em] py-3.5 px-4 rounded-xs flex items-center justify-center gap-2 transition-all shadow-lg active:scale-95"
                >
                  <ShoppingBag size={16} />
                  <span>Adicionar à Sacola</span>
                </button>
              </div>

              {/* Direct Buy Now / Concierge */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <button
                  onClick={handleBuyNow}
                  className="w-full bg-[#14141c] hover:bg-[#1b1b26] border border-[#C9A86C]/40 hover:border-[#C9A86C] text-[#E8D5B7] text-xs uppercase tracking-[0.18em] py-3 rounded-xs transition-colors"
                >
                  Comprar Agora
                </button>

                <a
                  href={`https://api.whatsapp.com/send?phone=${MIRAGE_WHATSAPP_NUMBER}&text=${encodeURIComponent(`Olá! Gostaria de encomendar ${quantity}x ${product.name} (${selectedVolume}) pelo atendimento exclusivo da Mirage Parfum.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-[#101e14] hover:bg-[#162a1c] border border-[#2d6a3f]/50 text-[#82D99E] text-xs uppercase tracking-[0.15em] py-3 rounded-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <MessageCircle size={14} />
                  <span>Pedir no WhatsApp</span>
                </a>
              </div>

              {/* Feedback Notice */}
              {showAddedNotice && (
                <div className="bg-[#121c15] border border-[#3E8B59]/40 text-[#82D99E] text-xs p-3 rounded-xs flex items-center gap-2 animate-in fade-in">
                  <Check size={15} />
                  <span>{quantity}x {product.name} adicionado à sua sacola com sucesso!</span>
                </div>
              )}
            </div>

            {/* Delivery Highlights */}
            <div className="pt-4 border-t border-[#C9A86C]/10 grid grid-cols-2 gap-3 text-[11px] text-[#8C8880]">
              <div className="flex items-center gap-2">
                <Truck size={14} className="text-[#C9A86C]" />
                <span>Envio Sedex & JadLog</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck size={14} className="text-[#C9A86C]" />
                <span>Garantia de Autenticidade</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* OLFACTORY PYRAMID DETAILED BREAKDOWN */}
      <section className="mt-20 pt-16 border-t border-[#C9A86C]/20">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-[11px] uppercase tracking-[0.3em] text-[#C9A86C] font-semibold block mb-2">
            Arquitetura Sensorial
          </span>
          <h2 className="font-cinzel text-2xl sm:text-3xl text-[#F8F6F0] font-light uppercase tracking-wider">
            Pirâmide Olfativa
          </h2>
          <p className="text-xs text-[#8C8880] mt-2 leading-relaxed">
            A sinfonia de notas raras que compõe o mistério e a evolução de {product.name}.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Top Notes */}
          <div className="glass-card p-6 rounded-xs border border-[#C9A86C]/20 bg-[#0c0c11] space-y-3">
            <div className="flex items-center justify-between border-b border-[#C9A86C]/15 pb-2">
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#C9A86C] font-semibold">
                Notas de Topo
              </span>
              <span className="text-[10px] text-[#6E6B65] font-mono">0 - 30 min</span>
            </div>
            <p className="text-sm font-cinzel text-[#F8F6F0] leading-snug">
              {product.notesTop}
            </p>
            <p className="text-xs text-[#8C8880] leading-relaxed">
              O impacto inicial. Uma explosão luminosa e inebriante que desperta o olfato e introduz a presença da fragrância.
            </p>
          </div>

          {/* Heart Notes */}
          <div className="glass-card p-6 rounded-xs border border-[#C9A86C]/30 bg-[#0f0f15] space-y-3 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-[#C9A86C]/5 rounded-full blur-xl pointer-events-none" />
            <div className="flex items-center justify-between border-b border-[#C9A86C]/15 pb-2">
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#E8D5B7] font-semibold">
                Notas de Coração
              </span>
              <span className="text-[10px] text-[#C9A86C] font-mono">2h - 6h</span>
            </div>
            <p className="text-sm font-cinzel text-[#F8F6F0] leading-snug">
              {product.notesHeart}
            </p>
            <p className="text-xs text-[#8C8880] leading-relaxed">
              A verdadeira alma e assinatura do perfume. Flores raras colhidas à mão e resinas sagradas que se fundem à pele.
            </p>
          </div>

          {/* Base Notes */}
          <div className="glass-card p-6 rounded-xs border border-[#C9A86C]/20 bg-[#0c0c11] space-y-3">
            <div className="flex items-center justify-between border-b border-[#C9A86C]/15 pb-2">
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#C9A86C] font-semibold">
                Notas de Fundo
              </span>
              <span className="text-[10px] text-[#6E6B65] font-mono">18h - 24h+</span>
            </div>
            <p className="text-sm font-cinzel text-[#F8F6F0] leading-snug">
              {product.notesBase}
            </p>
            <p className="text-xs text-[#8C8880] leading-relaxed">
              O rastro majestoso. Madeiras nobres envelhecidas e âmbar profundo que garantem uma silagem inesquecível e sensual.
            </p>
          </div>
        </div>
      </section>

      {/* ACCORDION INFORMATION */}
      <section className="mt-16 border-t border-[#C9A86C]/15 pt-10 max-w-4xl mx-auto space-y-4">
        
        {/* Accordion 1 */}
        <div className="border border-[#C9A86C]/20 rounded-xs overflow-hidden bg-[#0a0a0f]">
          <button
            onClick={() => toggleAcc('ritual')}
            className="w-full p-4 text-left flex items-center justify-between text-xs uppercase tracking-[0.2em] text-[#E8D5B7] hover:text-[#C9A86C] transition-colors"
          >
            <span>O Ritual de Aplicação Nobre</span>
            <ChevronDown size={16} className={`transition-transform ${openAccordion === 'ritual' ? 'rotate-180 text-[#C9A86C]' : ''}`} />
          </button>
          {openAccordion === 'ritual' && (
            <div className="px-4 pb-5 text-xs text-[#9E9A92] leading-relaxed border-t border-[#C9A86C]/10 pt-3">
              Para liberar a riqueza plena deste Extrait de Parfum, borrife a 15 cm dos pontos de pulsação: 
              a base do pescoço, pulsos, atrás dos lóbulos das orelhas e na dobra dos cotovelos. 
              Evite esfregar os pulsos para preservar a estrutura molecular delicada dos óleos de topo.
            </div>
          )}
        </div>

        {/* Accordion 2 */}
        <div className="border border-[#C9A86C]/20 rounded-xs overflow-hidden bg-[#0a0a0f]">
          <button
            onClick={() => toggleAcc('embalagem')}
            className="w-full p-4 text-left flex items-center justify-between text-xs uppercase tracking-[0.2em] text-[#E8D5B7] hover:text-[#C9A86C] transition-colors"
          >
            <span>Embalagem & Caixa Presenteavel Mirage</span>
            <ChevronDown size={16} className={`transition-transform ${openAccordion === 'embalagem' ? 'rotate-180 text-[#C9A86C]' : ''}`} />
          </button>
          {openAccordion === 'embalagem' && (
            <div className="px-4 pb-5 text-xs text-[#9E9A92] leading-relaxed border-t border-[#C9A86C]/10 pt-3">
              Todo pedido é embalado artesanalmente em nossa caixa rígida preta forrada em veludo bordô, 
              com fita de cetim dourada champagne e borrifada com essência exclusiva Mirage. Acompanha envelope com 
              o Certificado de Autenticidade assinado pelo Mestre Perfumista.
            </div>
          )}
        </div>

        {/* Accordion 3 */}
        <div className="border border-[#C9A86C]/20 rounded-xs overflow-hidden bg-[#0a0a0f]">
          <button
            onClick={() => toggleAcc('envio')}
            className="w-full p-4 text-left flex items-center justify-between text-xs uppercase tracking-[0.2em] text-[#E8D5B7] hover:text-[#C9A86C] transition-colors"
          >
            <span>Envio Blindado, Prazos & Rastreamento</span>
            <ChevronDown size={16} className={`transition-transform ${openAccordion === 'envio' ? 'rotate-180 text-[#C9A86C]' : ''}`} />
          </button>
          {openAccordion === 'envio' && (
            <div className="px-4 pb-5 text-xs text-[#9E9A92] leading-relaxed border-t border-[#C9A86C]/10 pt-3">
              Despachamos em até 24h úteis através de transporte blindado via Sedex ou JadLog Exclusif. 
              Você receberá o código de rastreamento no WhatsApp e no e-mail com atualização em tempo real até a entrega.
            </div>
          )}
        </div>
      </section>

      {/* RELATED CREATIONS */}
      {fallbackRelated.length > 0 && (
        <section className="mt-24 pt-16 border-t border-[#C9A86C]/20">
          <div className="flex items-center justify-between mb-10">
            <div>
              <span className="text-[11px] uppercase tracking-[0.3em] text-[#C9A86C] block mb-1">
                Harmonizações Olfativas
              </span>
              <h3 className="font-cinzel text-xl sm:text-2xl text-[#F8F6F0] uppercase tracking-wider">
                Outras Criações da Maison
              </h3>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {fallbackRelated.map((p) => (
              <ProductCard key={p.id} product={p} onSelect={onSelectProduct} />
            ))}
          </div>
        </section>
      )}

    </div>
  );
};
