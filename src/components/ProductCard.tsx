import React, { useState } from 'react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { formatCurrency } from '../lib/shipping';
import { Heart, ShoppingBag, Sparkles, Eye } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onSelect }) => {
  const { addToCart, toggleWishlist, isInWishlist } = useCart();
  const [selectedVolume, setSelectedVolume] = useState(product.volume || '100ml');
  const [isHovered, setIsHovered] = useState(false);
  const isWish = isInWishlist(product.id);

  const price = product.promotionalPrice || product.price;
  const hasDiscount = !!product.promotionalPrice && product.promotionalPrice < product.price;

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative flex flex-col glass-card rounded-sm overflow-hidden border border-[#C9A86C]/15 hover:border-[#C9A86C]/50 transition-all duration-500 bg-[#0c0c10]"
    >
      {/* Badges */}
      <div className="absolute top-3 left-3 z-20 flex flex-col gap-1.5 pointer-events-none">
        {product.isBestseller && (
          <span className="bg-[#C9A86C] text-[#070708] font-bold text-[9px] uppercase tracking-[0.2em] px-2 py-0.5 rounded-xs flex items-center gap-1 shadow-md">
            <Sparkles size={10} />
            Best-Seller
          </span>
        )}
        <span className="bg-[#070708]/80 backdrop-blur-md border border-[#C9A86C]/30 text-[#E8D5B7] text-[9px] uppercase tracking-[0.15em] px-2 py-0.5 rounded-xs">
          {product.concentration}
        </span>
      </div>

      {/* Wishlist Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          toggleWishlist(product);
        }}
        className={`absolute top-3 right-3 z-20 w-8 h-8 rounded-full border flex items-center justify-center transition-all ${
          isWish
            ? 'bg-[#C9A86C] text-[#070708] border-[#C9A86C]'
            : 'bg-[#070708]/70 border-[#C9A86C]/30 text-[#D1CEC7] hover:text-[#C9A86C] hover:border-[#C9A86C]'
        }`}
        aria-label="Favoritar"
      >
        <Heart size={14} className={isWish ? 'fill-[#070708]' : ''} />
      </button>

      {/* Image Container with click to view */}
      <div
        onClick={() => onSelect(product)}
        className="relative w-full aspect-[3/4] bg-[#08080a] overflow-hidden cursor-pointer flex items-center justify-center"
      >
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
          loading="lazy"
          decoding="async"
        />

        {/* Ambient Overlay gradient on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c10] via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

        {/* Quick View Button on Hover */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span className="bg-[#070708]/90 text-[#E8D5B7] border border-[#C9A86C]/60 text-[11px] uppercase tracking-[0.2em] px-4 py-2 rounded-xs flex items-center gap-1.5 shadow-2xl backdrop-blur-sm">
            <Eye size={13} />
            Detalhes do Frasco
          </span>
        </div>
      </div>

      {/* Info Section */}
      <div className="p-5 flex flex-col flex-grow justify-between border-t border-[#C9A86C]/10 bg-[#0a0a0d]">
        <div>
          <span className="text-[10px] uppercase tracking-[0.2em] text-[#C9A86C] font-medium block mb-1">
            {product.category}
          </span>

          <h3
            onClick={() => onSelect(product)}
            className="font-cinzel text-lg font-medium text-[#F8F6F0] hover:text-[#E8D5B7] cursor-pointer transition-colors leading-tight line-clamp-1"
          >
            {product.name}
          </h3>

          <p className="text-[11px] text-[#9E9A92] line-clamp-2 mt-1.5 leading-relaxed font-light">
            {product.description}
          </p>

          {/* Key Olfactory Notes */}
          <div className="mt-3 pt-2.5 border-t border-[#C9A86C]/10 flex items-center text-[10px] text-[#C9A86C]/90 font-mono tracking-tight line-clamp-1">
            <span className="text-[#6E6B65] mr-1 uppercase">Notas:</span> {product.notesTop.split(',').slice(0, 2).join(' • ')}
          </div>
        </div>

        {/* Price and Actions */}
        <div className="mt-4 pt-3 border-t border-[#C9A86C]/15 flex items-center justify-between">
          <div>
            {hasDiscount && (
              <span className="text-[11px] text-[#6E6B65] line-through block leading-none">
                {formatCurrency(product.price)}
              </span>
            )}
            <span className="font-cinzel text-base font-semibold text-[#E8D5B7]">
              {formatCurrency(price)}
            </span>
          </div>

          <button
            onClick={() => addToCart(product, selectedVolume, 1)}
            className="bg-[#C9A86C] hover:bg-[#DFC48F] text-[#070708] font-semibold text-[11px] uppercase tracking-[0.15em] px-3.5 py-2 rounded-xs flex items-center gap-1.5 transition-all shadow-sm active:scale-95"
          >
            <ShoppingBag size={13} />
            <span>Adicionar</span>
          </button>
        </div>
      </div>
    </div>
  );
};
