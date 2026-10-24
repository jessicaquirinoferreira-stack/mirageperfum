import React from 'react';
import { ShieldCheck, Lock, Award, FileText } from 'lucide-react';

export const TermsPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 space-y-12">
      
      <div className="text-center max-w-2xl mx-auto">
        <span className="text-[11px] uppercase tracking-[0.3em] text-[#C9A86C] font-semibold block mb-2">
          Segurança Jurídica & Transparência
        </span>
        <h1 className="font-cinzel text-3xl sm:text-4xl text-[#F8F6F0] font-light uppercase tracking-wider">
          Termos & Políticas da Maison
        </h1>
        <div className="w-16 h-[1px] bg-[#C9A86C] mx-auto mt-4" />
      </div>

      <div className="bg-[#0b0b0f] border border-[#C9A86C]/20 p-8 rounded-xs space-y-8 text-xs text-[#B0ACA4] leading-relaxed">
        
        <section className="space-y-3">
          <div className="flex items-center gap-2 text-[#E8D5B7] font-cinzel text-sm uppercase tracking-wider">
            <Award size={16} className="text-[#C9A86C]" />
            <h3>1. Garantia de Autenticidade e Lotes Numerados</h3>
          </div>
          <p>
            Todas as fragrâncias comercializadas pela Mirage Parfum são criações originais formuladas com 
            óleos essenciais de colheita nobre em Grasse, França, e resinas raras certificadas. 
            Cada frasco é acompanhado de certificado físico de procedência e lacre inviolável de segurança.
          </p>
        </section>

        <section className="space-y-3">
          <div className="flex items-center gap-2 text-[#E8D5B7] font-cinzel text-sm uppercase tracking-wider">
            <Lock size={16} className="text-[#C9A86C]" />
            <h3>2. Proteção de Dados & Privacidade (LGPD)</h3>
          </div>
          <p>
            Seus dados cadastrais, endereço e contato são tratados sob rigorosos protocolos de criptografia 
            e utilizados exclusivamente para o processamento de pedidos, entrega e consultoria via Concierge. 
            Não comercializamos nem compartilhamos informações com terceiros não autorizados.
          </p>
        </section>

        <section className="space-y-3">
          <div className="flex items-center gap-2 text-[#E8D5B7] font-cinzel text-sm uppercase tracking-wider">
            <ShieldCheck size={16} className="text-[#C9A86C]" />
            <h3>3. Envio, Seguro e Devoluções</h3>
          </div>
          <p>
            Todos os despachos contam com seguro integral contra avaria ou extravio via Sedex ou JadLog Exclusif. 
            Em conformidade com o Código de Defesa do Consumidor, aceitamos devoluções em até 7 dias corridos após o recebimento, 
            desde que o lacre de celofane e a embalagem rígida permaneçam intactos. Todos os pedidos incluem amostra de 2ml idêntica para experimentação prévia à abertura do frasco principal.
          </p>
        </section>

        <section className="space-y-3">
          <div className="flex items-center gap-2 text-[#E8D5B7] font-cinzel text-sm uppercase tracking-wider">
            <FileText size={16} className="text-[#C9A86C]" />
            <h3>4. Atendimento & Concierge Oficial</h3>
          </div>
          <p>
            Para qualquer esclarecimento sobre pedidos, trocas ou suporte especializado, entre em contato 
            direto com nosso Concierge através do WhatsApp oficial: <strong>+55 (21) 98077-9429</strong>.
          </p>
        </section>

      </div>

    </div>
  );
};
