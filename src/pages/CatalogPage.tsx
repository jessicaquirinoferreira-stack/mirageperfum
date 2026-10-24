import React, { useState, useMemo } from 'react';
import { Product } from '../types';
import { ProductCard } from '../components/ProductCard';
import { Filter, SlidersHorizontal, Search, X, Sparkles } from 'lucide-react';

interface CatalogPageProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
}

export const CatalogPage: React.FC<CatalogPageProps> = ({ products, onSelectProduct }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedConcentration, setSelectedConcentration] = useState<string>('all');
  const [selectedGender, setSelectedGender] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('featured');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = [
    { id: 'all', label: 'Todas as Criações' },
    { id: 'Amadeirado', label: 'Amadeirados & Couro' },
    { id: 'Oriental', label: 'Oriental & Oud' },
    { id: 'Floral', label: 'Floral Noturno' },
    { id: 'Âmbar', label: 'Âmbar & Resinas' },
  ];

  const concentrations = [
    { id: 'all', label: 'Todas as Concentrações' },
    { id: 'Extrait de Parfum', label: 'Extrait de Parfum (25-35%)' },
    { id: 'Eau de Parfum', label: 'Eau de Parfum (18-22%)' },
    { id: 'Elixir', label: 'Elixir Privé' },
  ];

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      if (p.status === 'archived') return false;

      // Category filter
      if (selectedCategory !== 'all') {
        const matchesCategory = p.category.toLowerCase().includes(selectedCategory.toLowerCase());
        if (!matchesCategory) return false;
      }

      // Concentration filter
      if (selectedConcentration !== 'all' && p.concentration !== selectedConcentration) {
        return false;
      }

      // Gender filter
      if (selectedGender !== 'all' && p.gender !== selectedGender) {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = p.name.toLowerCase().includes(q);
        const matchesSub = p.subtitle.toLowerCase().includes(q);
        const matchesNotes =
          p.notesTop.toLowerCase().includes(q) ||
          p.notesHeart.toLowerCase().includes(q) ||
          p.notesBase.toLowerCase().includes(q);
        if (!matchesName && !matchesSub && !matchesNotes) return false;
      }

      return true;
    }).sort((a, b) => {
      const priceA = a.promotionalPrice || a.price;
      const priceB = b.promotionalPrice || b.price;

      if (sortBy === 'price-asc') return priceA - priceB;
      if (sortBy === 'price-desc') return priceB - priceA;
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      // default: featured and bestsellers first
      if (a.isBestseller && !b.isBestseller) return -1;
      if (!a.isBestseller && b.isBestseller) return 1;
      return 0;
    });
  }, [products, selectedCategory, selectedConcentration, selectedGender, sortBy, searchQuery]);

  const resetFilters = () => {
    setSelectedCategory('all');
    setSelectedConcentration('all');
    setSelectedGender('all');
    setSortBy('featured');
    setSearchQuery('');
  };

  const hasActiveFilters =
    selectedCategory !== 'all' ||
    selectedConcentration !== 'all' ||
    selectedGender !== 'all' ||
    searchQuery.trim() !== '';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
        <span className="text-[11px] uppercase tracking-[0.3em] text-[#C9A86C] font-medium block mb-2">
          Alta Perfumaria de Nicho
        </span>
        <h1 className="font-cinzel text-3xl sm:text-4xl lg:text-5xl text-[#F8F6F0] font-light uppercase tracking-wider">
          O Acervo Mirage
        </h1>
        <p className="text-xs sm:text-sm text-[#9E9A92] mt-3 font-light leading-relaxed">
          Explore nossas composições autorais. Cada frasco é uma ode à raridade, 
          com alta concentração de óleos essenciais nobres e evolução inesquecível.
        </p>
        <div className="w-16 h-[1px] bg-[#C9A86C] mx-auto mt-6" />
      </div>

      {/* Filter and Control Bar */}
      <div className="bg-[#0b0b0f] border border-[#C9A86C]/15 p-5 sm:p-6 rounded-xs mb-10 space-y-5">
        
        {/* Top Controls: Search and Sort */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Search */}
          <div className="relative w-full md:w-80">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#C9A86C]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por notas (oud, rosa, baunilha)..."
              className="w-full bg-[#121217] border border-[#C9A86C]/20 text-[#F8F6F0] text-xs pl-10 pr-8 py-2.5 rounded-xs focus:outline-none focus:border-[#C9A86C] placeholder:text-[#5E5B55]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9E9A92] hover:text-[#F8F6F0]"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-3 w-full md:w-auto justify-end">
            <span className="text-[11px] uppercase tracking-wider text-[#8C8880] hidden sm:inline">
              Ordenar:
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-[#121217] border border-[#C9A86C]/25 text-[#E8D5B7] text-xs px-3 py-2.5 rounded-xs focus:outline-none focus:border-[#C9A86C] uppercase tracking-wider"
            >
              <option value="featured">Em Destaque (Best-Sellers)</option>
              <option value="price-asc">Menor Preço</option>
              <option value="price-desc">Maior Preço</option>
              <option value="name">Ordem Alfabética</option>
            </select>
          </div>
        </div>

        {/* Filter Chips: Categories */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#C9A86C]/10">
          <span className="text-[10px] uppercase tracking-[0.2em] text-[#C9A86C] mr-2">Família:</span>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`text-xs px-3.5 py-1.5 rounded-xs uppercase tracking-wider transition-all ${
                selectedCategory === cat.id
                  ? 'bg-[#C9A86C] text-[#070708] font-semibold shadow-sm'
                  : 'bg-[#121217] text-[#9E9A92] hover:text-[#E8D5B7] border border-[#C9A86C]/15 hover:border-[#C9A86C]/40'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Concentrations & Genders */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] uppercase tracking-[0.2em] text-[#C9A86C] mr-2">Concentração:</span>
            {concentrations.map((conc) => (
              <button
                key={conc.id}
                onClick={() => setSelectedConcentration(conc.id)}
                className={`text-[11px] px-3 py-1 rounded-xs transition-colors ${
                  selectedConcentration === conc.id
                    ? 'border border-[#C9A86C] text-[#C9A86C] bg-[#C9A86C]/10'
                    : 'text-[#8C8880] hover:text-[#D1CEC7]'
                }`}
              >
                {conc.label}
              </button>
            ))}
          </div>

          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="text-xs text-[#C9A86C] hover:underline flex items-center gap-1.5 ml-auto"
            >
              <X size={13} />
              <span>Limpar filtros</span>
            </button>
          )}
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between mb-8 text-xs text-[#8C8880]">
        <span>Mostrando <strong>{filteredProducts.length}</strong> criações da maison</span>
        {hasActiveFilters && (
          <span className="text-[#C9A86C] text-[11px] uppercase tracking-wider">
            Filtros ativos
          </span>
        )}
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-24 glass-card rounded-xs border border-[#C9A86C]/20 p-8">
          <Sparkles size={32} className="text-[#C9A86C] mx-auto mb-4" />
          <h3 className="font-cinzel text-xl text-[#F8F6F0]">Nenhuma criação corresponde aos filtros</h3>
          <p className="text-xs text-[#8C8880] max-w-sm mx-auto mt-2 leading-relaxed">
            Experimente alterar ou remover os filtros para visualizar outras composições da nossa perfumaria.
          </p>
          <button
            onClick={resetFilters}
            className="mt-6 bg-[#C9A86C] hover:bg-[#DFC48F] text-[#070708] text-xs uppercase tracking-[0.2em] font-semibold px-6 py-2.5 rounded-xs"
          >
            Limpar Todos os Filtros
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
          {filteredProducts.map((product) => (
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
