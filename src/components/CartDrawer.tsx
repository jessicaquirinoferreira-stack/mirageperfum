import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { formatCurrency } from '../lib/shipping';
import { X, Trash2, Plus, Minus, ShoppingBag, Sparkles, ArrowRight, Tag } from 'lucide-react';

interface CartDrawerProps {
  onProceedToCheckout: () => void;
  onExploreMore: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  onProceedToCheckout,
  onExploreMore,
}) => {
  const {
    cart,
    isCartDrawerOpen,
    setIsCartDrawerOpen,
    removeFromCart,
    updateQuantity,
    cartSubtotal,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    discountAmount,
  } = useCart();

  const [couponInput, setCouponInput] = useState('');
  const [couponMessage, setCouponMessage] = useState<{ text: string; isError: boolean } | null>(null);
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

  if (!isCartDrawerOpen) return null;

  const total = Math.max(0, cartSubtotal - discountAmount);

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;

    setIsApplyingCoupon(true);
    setCouponMessage(null);
    const result = await applyCoupon(couponInput);
    setIsApplyingCoupon(false);
    setCouponMessage({ text: result.message, isError: !result.success });
    if (result.success) {
      setCouponInput('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        onClick={() => setIsCartDrawerOpen(false)}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity animate-in fade-in duration-300"
      />

      {/* Drawer */}
      <div className="relative w-full max-w-md bg-[#0a0a0e] border-l border-[#C9A86C]/25 text-[#F8F6F0] flex flex-col h-full z-10 shadow-2xl animate-in slide-in-from-right duration-300">
        
        {/* Header */}
        <div className="p-5 border-b border-[#C9A86C]/15 flex items-center justify-between bg-[#08080b]">
          <div className="flex items-center gap-2">
            <ShoppingBag size={18} className="text-[#C9A86C]" />
            <span className="font-cinzel text-base tracking-[0.15em] uppercase text-[#F8F6F0]">
              Sacola Exclusiva ({cart.reduce((a, b) => a + b.quantity, 0)})
            </span>
          </div>
          <button
            onClick={() => setIsCartDrawerOpen(false)}
            className="text-[#9E9A92] hover:text-[#C9A86C] p-1.5 transition-colors"
            aria-label="Fechar sacola"
          >
            <X size={20} />
          </button>
        </div>

        {/* Shipping notice bar */}
        <div className="bg-[#121217] px-5 py-2.5 border-b border-[#C9A86C]/10 text-xs">
          <p className="text-[#9E9A92] text-[11px] flex items-center gap-2">
            <Sparkles size={12} className="text-[#C9A86C]" />
            <span>Frete calculado no checkout conforme o CEP de entrega.</span>
          </p>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-12 px-4 space-y-4">
              <div className="w-16 h-16 rounded-full border border-[#C9A86C]/20 flex items-center justify-center text-[#C9A86C]/60">
                <ShoppingBag size={28} />
              </div>
              <h4 className="font-cinzel text-lg text-[#E8D5B7]">Sua sacola está vazia</h4>
              <p className="text-xs text-[#8C8880] max-w-xs leading-relaxed">
                Permita-se descobrir as criações raras da nossa alta perfumaria e encontre sua assinatura olfativa.
              </p>
              <button
                onClick={() => {
                  setIsCartDrawerOpen(false);
                  onExploreMore();
                }}
                className="mt-4 bg-[#C9A86C] hover:bg-[#DFC48F] text-[#070708] text-xs uppercase tracking-[0.2em] font-semibold px-6 py-3 rounded-xs transition-all shadow-md"
              >
                Explorar Coleções
              </button>
            </div>
          ) : (
            cart.map((item) => {
              const unitPrice = item.product.promotionalPrice || item.product.price;
              return (
                <div
                  key={`${item.product.id}-${item.selectedVolume}`}
                  className="flex gap-4 p-3 bg-[#0e0e13] border border-[#C9A86C]/10 rounded-xs"
                >
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-20 h-24 object-cover rounded-xs border border-[#C9A86C]/15 shrink-0 bg-[#070708]"
                  />
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between">
                        <h4 className="font-cinzel text-sm font-medium text-[#F8F6F0] line-clamp-1">
                          {item.product.name}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.product.id, item.selectedVolume)}
                          className="text-[#6E6B65] hover:text-[#E06D6D] p-1 transition-colors"
                          title="Remover"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                      <span className="text-[10px] uppercase tracking-wider text-[#C9A86C] block mt-0.5">
                        {item.selectedVolume} • {item.product.concentration}
                      </span>
                    </div>

                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#C9A86C]/10">
                      {/* Quantity Controls */}
                      <div className="flex items-center border border-[#C9A86C]/25 rounded-xs bg-[#070708]">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.selectedVolume, -1)}
                          className="px-2 py-1 text-[#9E9A92] hover:text-[#C9A86C] transition-colors"
                          aria-label="Diminuir quantidade"
                        >
                          <Minus size={11} />
                        </button>
                        <span className="px-2 text-xs font-mono font-medium text-[#F8F6F0]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.selectedVolume, 1)}
                          className="px-2 py-1 text-[#9E9A92] hover:text-[#C9A86C] transition-colors"
                          aria-label="Aumentar quantidade"
                        >
                          <Plus size={11} />
                        </button>
                      </div>

                      <span className="font-cinzel text-xs font-semibold text-[#E8D5B7]">
                        {formatCurrency(unitPrice * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Summary & Checkout */}
        {cart.length > 0 && (
          <div className="p-5 border-t border-[#C9A86C]/20 bg-[#08080b] space-y-4">
            {/* Coupon Code Section */}
            <div>
              {appliedCoupon ? (
                <div className="flex items-center justify-between bg-[#151c17] border border-[#3E8B59]/40 px-3 py-2 rounded-xs text-xs">
                  <div className="flex items-center gap-2 text-[#82D99E]">
                    <Tag size={13} />
                    <span>
                      Cupom <strong>{appliedCoupon.code}</strong> (-
                      {appliedCoupon.type === 'percentage'
                        ? `${appliedCoupon.value}%`
                        : formatCurrency(appliedCoupon.value)}
                      )
                    </span>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="text-[#9E9A92] hover:text-[#E06D6D] text-[11px] underline ml-2"
                  >
                    Remover
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    placeholder="Código de cupom (ex: MIRAGE10)"
                    className="bg-[#121217] border border-[#C9A86C]/25 text-xs text-[#F8F6F0] px-3 py-2 rounded-xs focus:outline-none focus:border-[#C9A86C] uppercase flex-1 placeholder:text-[#5E5B55]"
                  />
                  <button
                    type="submit"
                    disabled={isApplyingCoupon}
                    className="bg-[#1c1c24] hover:bg-[#252530] text-[#E8D5B7] border border-[#C9A86C]/30 text-xs px-3 py-2 rounded-xs transition-colors shrink-0"
                  >
                    Aplicar
                  </button>
                </form>
              )}
              {couponMessage && (
                <p
                  className={`text-[11px] mt-1.5 ${
                    couponMessage.isError ? 'text-[#E57373]' : 'text-[#81C784]'
                  }`}
                >
                  {couponMessage.text}
                </p>
              )}
            </div>

            {/* Calculations */}
            <div className="space-y-1.5 text-xs text-[#9E9A92] pt-2 border-t border-[#C9A86C]/10">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="text-[#F8F6F0] font-mono">{formatCurrency(cartSubtotal)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-[#81C784]">
                  <span>Desconto</span>
                  <span className="font-mono">-{formatCurrency(discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Frete</span>
                <span className="text-[#C9A86C] text-[11px]">Calculado no checkout</span>
              </div>
              <div className="flex justify-between text-base font-cinzel font-medium text-[#F8F6F0] pt-2 border-t border-[#C9A86C]/15">
                <span>Total Estimado</span>
                <span className="text-[#E8D5B7] font-semibold">{formatCurrency(total)}</span>
              </div>
            </div>

            {/* Checkout Action */}
            <button
              onClick={() => {
                setIsCartDrawerOpen(false);
                onProceedToCheckout();
              }}
              className="w-full bg-[#C9A86C] hover:bg-[#DFC48F] text-[#070708] font-semibold py-3.5 px-4 rounded-xs text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-2 transition-all shadow-lg active:scale-[0.99]"
            >
              <span>Finalizar Compra</span>
              <ArrowRight size={15} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
