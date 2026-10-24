import React, { useState } from 'react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { formatCurrency } from '../lib/shipping';
import { Heart, ShoppingBag, Sparkles, Star } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onSelect }) => {
  const { addToCart, toggleWishlist, isInWishlist } = useCart();
  const selectedVolume = product.volume || '100ml';
  const isWish = isInWishlist(product.id);

  const price = product.promotionalPrice || product.price;
  const hasDiscount = !!product.promotionalPrice && product.promotionalPrice < product.price;
  const discountPercent = hasDiscount ? Math.round(((product.price - price) / product.price) * 100) : 10;
  
  // Calculated PIX price (e.g. 5% extra discount on PIX)
  const pixPrice = price * 0.95;
  const installmentValue = price / 6;

  return (
    <div
      onClick={() => onSelect(product)}
      className="group relative flex flex-col bg-white rounded-xs overflow-hidden border border-[#B89753]/20 hover:border-[#B89753]/60 transition-all duration-300 shadow-sm hover:shadow-lg cursor-pointer"
    >
      {/* Badges / Discount */}
      <div className="absolute top-2 left-2 z-20 flex flex-col gap-1 pointer-events-none">
        {hasDiscount && (
          <span className="bg-[#B89753] text-white font-bold text-[9px] uppercase tracking-[0.1em] px-1.5 py-0.5 rounded-xs shadow-sm">
            -{discountPercent}% OFF
          </span>
        )}
        {product.isBestseller && !hasDiscount && (
          <span className="bg-[#B89753] text-white font-bold text-[9px] uppercase tracking-[0.1em] px-1.5 py-0.5 rounded-xs shadow-sm flex items-center gap-0.5">
            <Sparkles size={9} />
            Top
          </span>
        )}
      </div>

      {/* Wishlist Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          toggleWishlist(product);
        }}
        className={`absolute top-2 right-2 z-20 w-7 h-7 sm:w-8 sm:h-8 rounded-full border flex items-center justify-center transition-all ${
          isWish
            ? 'bg-[#B89753] text-white border-[#B89753]'
            : 'bg-white/80 backdrop-blur-sm border-[#B89753]/30 text-[#5A564E] hover:text-[#B89753] hover:border-[#B89753]'
        }`}
        aria-label="Favoritar"
      >
        <Heart size={13} className={isWish ? 'fill-white' : ''} />
      </button>

      {/* Image Container */}
      <div className="relative w-full aspect-square sm:aspect-[4/5] bg-[#FAF8F5] overflow-hidden flex items-center justify-center p-3">
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-contain object-center group-hover:scale-105 transition-transform duration-500 ease-out"
          loading="lazy"
          decoding="async"
        />
      </div>

      {/* Info Section */}
      <div className="p-3 sm:p-4 flex flex-col flex-grow justify-between bg-white border-t border-[#B89753]/15">
        <div>
          {/* Category / Brand */}
          <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.15em] text-[#8C6F3C] font-medium block mb-0.5">
            {product.category}
          </span>

          {/* Title */}
          <h3 className="font-cinzel text-xs sm:text-sm font-semibold text-[#1A1A1E] hover:text-[#B89753] transition-colors leading-snug line-clamp-2">
            {product.name}
          </h3>

          {/* Rating stars */}
          <div className="flex items-center gap-1 mt-1.5">
            <div className="flex items-center text-[#B89753]">
              <Star size={11} className="fill-[#B89753]" />
              <Star size={11} className="fill-[#B89753]" />
              <Star size={11} className="fill-[#B89753]" />
              <Star size={11} className="fill-[#B89753]" />
              <Star size={11} className="fill-[#B89753]" />
            </div>
            <span className="text-[9px] text-[#7A756B]">({product.ratingCount || 77})</span>
          </div>
        </div>

        {/* Price and Actions */}
        <div className="mt-3 pt-2.5 border-t border-[#B89753]/15 flex flex-col gap-1.5">
          <div>
            {hasDiscount && (
              <span className="text-[10px] text-[#8C8880] line-through block leading-none">
                {formatCurrency(product.price)}
              </span>
            )}
            <div className="flex items-baseline gap-1">
              <span className="font-cinzel text-sm sm:text-base font-bold text-[#1A1A1E]">
                {formatCurrency(price)}
              </span>
            </div>
            <span className="text-[9px] sm:text-[10px] text-[#B89753] font-medium block mt-0.5">
              {formatCurrency(pixPrice)} no PIX
            </span>
            <span className="text-[9px] text-[#6A665C] block">
              6x de {formatCurrency(installmentValue)} sem juros
            </span>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              addToCart(product, selectedVolume, 1);
            }}
            className="w-full mt-1 bg-[#1A1A1E] hover:bg-[#B89753] text-white font-medium text-[10px] sm:text-[11px] uppercase tracking-[0.15em] py-2 rounded-xs flex items-center justify-center gap-1.5 transition-all shadow-xs active:scale-95"
          >
            <ShoppingBag size={12} />
            <span>Comprar</span>
          </button>
        </div>
      </div>
    </div>
  );
};

