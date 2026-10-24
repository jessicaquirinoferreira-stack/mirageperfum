import React, { useState, useEffect, useRef } from 'react';
import { Product } from '../types';
import { formatCurrency } from '../lib/shipping';
import { Search, X, Sparkles, ArrowRight } from 'lucide-react';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onSelectProduct: (product: Product) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  products,
  onSelectProduct,
}) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const cleanQuery = query.toLowerCase().trim();

  const filtered = cleanQuery
    ? products.filter((p) => {
        return (
          p.name.toLowerCase().includes(cleanQuery) ||
          p.subtitle.toLowerCase().includes(cleanQuery) ||
          p.category.toLowerCase().includes(cleanQuery) ||
          p.concentration.toLowerCase().includes(cleanQuery) ||
          p.notesTop.toLowerCase().includes(cleanQuery) ||
          p.notesHeart.toLowerCase().includes(cleanQuery) ||
          p.notesBase.toLowerCase().includes(cleanQuery) ||
          p.description.toLowerCase().includes(cleanQuery)
        );
      })
    : [];

  const popularSearches = ['Oud', 'Rosa', 'Baunilha', 'Extrait de Parfum', 'Couro', 'Amadeirado'];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/85 backdrop-blur-md transition-opacity animate-in fade-in duration-200"
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-2xl bg-[#0d0d12] border border-[#C9A86C]/30 rounded-xs shadow-2xl z-10 overflow-hidden flex flex-col max-h-[80vh] animate-in zoom-in-95 duration-200">
        
        {/* Search Bar Input */}
        <div className="p-4 sm:p-5 border-b border-[#C9A86C]/20 flex items-center gap-3 bg-[#09090d]">
          <Search size={20} className="text-[#C9A86C] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Pesquise por nome, notas olfativas (ex: Oud, Rosa, Âmbar) ou concentração..."
            className="w-full bg-transparent text-[#F8F6F0] text-sm sm:text-base placeholder:text-[#5E5B55] focus:outline-none font-light"
          />
          {query && (
            <button onClick={() => setQuery('')} className="text-[#9E9A92] hover:text-[#F8F6F0] p-1">
              <X size={16} />
            </button>
          )}
          <button
            onClick={onClose}
            className="text-[#9E9A92] hover:text-[#C9A86C] p-1.5 transition-colors border-l border-[#C9A86C]/20 pl-3 ml-1"
          >
            <span className="text-xs uppercase tracking-wider hidden sm:inline">Fechar</span>
            <X size={18} className="sm:hidden" />
          </button>
        </div>

        {/* Quick Suggestion Tags */}
        {!query && (
          <div className="p-5 border-b border-[#C9A86C]/10 bg-[#0b0b10]">
            <span className="text-[10px] uppercase tracking-[0.2em] text-[#C9A86C] block mb-2.5 font-medium">
              Buscas Populares no Acervo
            </span>
            <div className="flex flex-wrap gap-2">
              {popularSearches.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setQuery(tag)}
                  className="text-xs bg-[#14141c] hover:bg-[#1f1f2c] text-[#D1CEC7] hover:text-[#E8D5B7] border border-[#C9A86C]/20 px-3 py-1.5 rounded-xs transition-colors"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3">
          {query && filtered.length === 0 ? (
            <div className="text-center py-12 text-[#8C8880] text-xs">
              Nenhuma criação encontrada para "{query}". Tente buscar por famílias como "Amadeirado", "Oud" ou "Floral".
            </div>
          ) : (
            filtered.map((product) => {
              const price = product.promotionalPrice || product.price;
              return (
                <div
                  key={product.id}
                  onClick={() => {
                    onSelectProduct(product);
                    onClose();
                  }}
                  className="flex items-center justify-between p-3 rounded-xs bg-[#111118] hover:bg-[#181822] border border-[#C9A86C]/15 hover:border-[#C9A86C]/40 cursor-pointer transition-all group"
                >
                  <div className="flex items-center gap-3.5">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-14 h-16 object-cover rounded-xs border border-[#C9A86C]/20 bg-[#070708]"
                    />
                    <div>
                      <span className="text-[9px] uppercase tracking-[0.2em] text-[#C9A86C]">
                        {product.concentration} • {product.category}
                      </span>
                      <h4 className="font-cinzel text-sm text-[#F8F6F0] group-hover:text-[#E8D5B7] transition-colors">
                        {product.name}
                      </h4>
                      <p className="text-[11px] text-[#8C8880] line-clamp-1 font-mono">
                        Notas: {product.notesTop}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="font-cinzel text-sm font-semibold text-[#E8D5B7]">
                      {formatCurrency(price)}
                    </span>
                    <ArrowRight size={15} className="text-[#C9A86C] group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
