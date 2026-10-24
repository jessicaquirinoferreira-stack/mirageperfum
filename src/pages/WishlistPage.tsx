import React from 'react';
import { useCart } from '../context/CartContext';
import { Product } from '../types';
import { ProductCard } from '../components/ProductCard';
import { Heart, ShoppingBag, ArrowRight } from 'lucide-react';

interface WishlistPageProps {
  onSelectProduct: (product: Product) => void;
  onExploreCatalog: () => void;
}

export const WishlistPage: React.FC<WishlistPageProps> = ({
  onSelectProduct,
  onExploreCatalog,
}) => {
  const { wishlist } = useCart();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
      <div className="text-center max-w-2xl mx-auto mb-14">
        <div className="w-12 h-12 rounded-full border border-[#C9A86C]/40 flex items-center justify-center text-[#C9A86C] mx-auto mb-4 bg-[#0d0d12]">
          <Heart size={20} className="fill-[#C9A86C]" />
        </div>
        <span className="text-[11px] uppercase tracking-[0.3em] text-[#C9A86C] font-semibold block mb-2">
          Suas Preferências Privativas
        </span>
        <h1 className="font-cinzel text-3xl sm:text-4xl text-[#F8F6F0] font-light uppercase tracking-wider">
          Lista de Desejos ({wishlist.length})
        </h1>
        <p className="text-xs text-[#8C8880] mt-2">
          Fragrâncias salvas para sua próxima aquisição ou para compartilhar com seu Concierge.
        </p>
      </div>

      {wishlist.length === 0 ? (
        <div className="text-center py-20 bg-[#0b0b0f] border border-[#C9A86C]/15 rounded-xs p-8 max-w-md mx-auto space-y-4">
          <Heart size={32} className="text-[#6E6B65] mx-auto" />
          <h3 className="font-cinzel text-lg text-[#F8F6F0]">Sua lista está vazia</h3>
          <p className="text-xs text-[#8C8880] leading-relaxed">
            Clique no ícone de coração em qualquer criação do acervo para guardá-la em suas preferências.
          </p>
          <button
            onClick={onExploreCatalog}
            className="mt-4 bg-[#C9A86C] text-[#070708] font-semibold text-xs uppercase tracking-[0.2em] px-6 py-3 rounded-xs"
          >
            Explorar Acervo
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {wishlist.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onSelect={onSelectProduct}
            />
          ))}
        </div>
      )}
    </div>
  );
};
