import React from 'react';
import { Product } from '../types';
import { Sparkles, Compass, Droplets, ArrowRight } from 'lucide-react';

interface NotesGuidePageProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
  onNavigateCatalog: () => void;
}

export const NotesGuidePage: React.FC<NotesGuidePageProps> = ({
  products,
  onSelectProduct,
  onNavigateCatalog,
}) => {
  const rareNotes = [
    {
      title: 'Oud Selvagem de Assam (12 Anos)',
      origin: 'Florestas de Assam, Índia',
      category: 'Madeira Nobre & Resinosa',
      accentColor: '#9B783E',
      description: 'Conhecido na alta perfumaria como "ouro líquido", o Oud provém da resina densa e escura secretada pelas árvores de Aquilaria. Nosso lote passa por envelhecimento de 12 anos em ânforas de barro, entregando facetas de couro, fumaça nobre e terra úmida.',
      perfumes: ['oud-mystique', 'noir-imperial'],
    },
    {
      title: 'Rosa Centifolia de Grasse',
      origin: 'Campos de Grasse, França',
      category: 'Floral Nobre',
      accentColor: '#B23B5C',
      description: 'Cultivada artesanalmente e colhida manualmente apenas durante as primeiras horas da manhã de maio. São necessárias quatro toneladas de pétalas frescas para extrair um único quilograma de absoluto puro, conferindo uma sensualidade aveludada incomparável.',
      perfumes: ['rose-velours'],
    },
    {
      title: 'Âmbar Dourado & Resinas de Omã',
      origin: 'Sultanato de Omã & Bacia Mediterrânea',
      category: 'Balsâmico Solar',
      accentColor: '#D49B44',
      description: 'Uma fusão calorosa e balsâmica que evoca o pôr do sol nos desertos árabes. Proporciona um rastro aconchegante, adocicado e hipnótico, capaz de fixar na pele por mais de vinte horas.',
      perfumes: ['ambre-royal', 'noir-imperial'],
    },
    {
      title: 'Couro Toscano Artesanal',
      origin: 'Florença, Itália',
      category: 'Couro Nobre',
      accentColor: '#7A4D3B',
      description: 'Evoca o cheiro inebriante de curtumes históricos e poltronas de bibliotecas aristocráticas. Adiciona peso, mistério e uma presença dominante mas extremamente refinada à fragrância.',
      perfumes: ['noir-imperial', 'cuir-venitien'],
    },
    {
      title: 'Sândalo Branco da Mysore',
      origin: 'Karnataka, Índia',
      category: 'Madeira Sagrada',
      accentColor: '#BFA175',
      description: 'Cremoso, leitoso e de uma serenidade meditativa. Colhido a partir de árvores maduras com mais de 30 anos sob manejo sustentável, conferindo um fundo aveludado e elegante.',
      perfumes: ['santal-solstice', 'ambre-royal'],
    },
    {
      title: 'Açafrão Vermelho Persa',
      origin: 'Khorasan, Irã',
      category: 'Especiaria Dourada',
      accentColor: '#D9532A',
      description: 'O estigma vermelho colhido um a um. Conhecido por seu aroma picante, ligeiramente metálico e aristocrático, que ilumina as notas de abertura com um brilho inconfundível.',
      perfumes: ['oud-mystique'],
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
      
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 bg-[#121217] border border-[#C9A86C]/30 px-3 py-1 rounded-full mb-3 text-[11px] text-[#C9A86C] uppercase tracking-[0.2em]">
          <Compass size={13} />
          <span>Enciclopédia Sensorial</span>
        </div>
        <h1 className="font-cinzel text-3xl sm:text-4xl lg:text-5xl text-[#F8F6F0] font-light uppercase tracking-wider">
          As Matérias-Primas Raras
        </h1>
        <p className="text-xs sm:text-sm text-[#9E9A92] mt-3 font-light leading-relaxed">
          O segredo da Mirage Parfum reside na recusa intransigente à mediocridade. 
          Viajamos aos confins do globo para colher ingredientes lendários que contam histórias de civilizações.
        </p>
        <div className="w-16 h-[1px] bg-[#C9A86C] mx-auto mt-6" />
      </div>

      {/* Guide Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
        {rareNotes.map((note, idx) => {
          const matchingPerfumes = products.filter((p) => note.perfumes.includes(p.id));

          return (
            <div
              key={idx}
              className="glass-card p-6 sm:p-8 rounded-xs border border-[#C9A86C]/20 space-y-4 relative overflow-hidden bg-[#0a0a0e]"
            >
              <div className="flex items-center justify-between border-b border-[#C9A86C]/15 pb-3">
                <span className="text-[10px] uppercase tracking-[0.25em] text-[#C9A86C] font-semibold">
                  {note.category}
                </span>
                <span className="text-[11px] text-[#8C8880] font-mono">
                  {note.origin}
                </span>
              </div>

              <h3 className="font-cinzel text-xl text-[#F8F6F0] font-medium leading-snug">
                {note.title}
              </h3>

              <p className="text-xs text-[#B0ACA4] leading-relaxed font-light">
                {note.description}
              </p>

              {/* Present in perfumes */}
              {matchingPerfumes.length > 0 && (
                <div className="pt-4 border-t border-[#C9A86C]/10">
                  <span className="text-[10px] uppercase tracking-[0.2em] text-[#6E6B65] block mb-2">
                    Presente nas Criações:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {matchingPerfumes.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => onSelectProduct(p)}
                        className="text-xs bg-[#121217] hover:bg-[#1a1a24] text-[#E8D5B7] border border-[#C9A86C]/30 px-3 py-1 rounded-xs flex items-center gap-1.5 transition-colors"
                      >
                        <span>{p.name}</span>
                        <ArrowRight size={11} className="text-[#C9A86C]" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* CTA Bottom */}
      <div className="mt-16 text-center">
        <button
          onClick={onNavigateCatalog}
          className="bg-[#C9A86C] hover:bg-[#DFC48F] text-[#070708] font-semibold text-xs uppercase tracking-[0.2em] px-8 py-4 rounded-xs transition-all shadow-xl"
        >
          Experimentar o Acervo Completo
        </button>
      </div>

    </div>
  );
};
