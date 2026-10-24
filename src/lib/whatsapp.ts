import { Order } from '../types';
import { formatCurrency } from './shipping';

export const MIRAGE_WHATSAPP_NUMBER = '5521980779429';

/**
 * Formats order into an exquisite luxury WhatsApp order message
 */
export function formatOrderWhatsAppMessage(order: Order): string {
  const itemsText = order.items
    .map(
      (item, idx) =>
        `${idx + 1}. *${item.name}* (${item.volume})\n   Qtd: ${item.quantity}x | Unit: ${formatCurrency(item.price)} | Subtotal: ${formatCurrency(item.price * item.quantity)}`
    )
    .join('\n\n');

  const discountText =
    order.discount > 0
      ? `\n• Desconto Aplicado (${order.couponCode || 'Cupom'}): -${formatCurrency(order.discount)}`
      : '';

  const notesText = order.notes?.trim()
    ? `\n\n📝 *OBSERVAÇÕES DO CLIENTE:*\n${order.notes.trim()}`
    : '';

  const complementText = order.complement ? `, Compl: ${order.complement}` : '';

  return `⚜️ *NOVO PEDIDO - MIRAGE PARFUM* ⚜️
*Pedido:* #${order.id}
*Data:* ${new Date(order.createdAt).toLocaleDateString('pt-BR')} às ${new Date(order.createdAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}

👤 *DADOS DO CLIENTE:*
• Nome: ${order.customerName}
• Telefone: ${order.customerPhone}
• E-mail: ${order.customerEmail}

📍 *ENDEREÇO DE ENTREGA:*
• CEP: ${order.cep}
• Endereço: ${order.street}, nº ${order.number}${complementText}
• Bairro: ${order.neighborhood}
• Cidade/UF: ${order.city} - ${order.state}

🛍️ *FRAGRÂNCIAS SELECIONADAS:*
${itemsText}

💰 *RESUMO FINANCEIRO:*
• Subtotal dos Produtos: ${formatCurrency(order.subtotal)}
• Frete (${order.shippingType} - ${order.shippingDeadline}): ${formatCurrency(order.shippingPrice)}${discountText}
• *TOTAL DO PEDIDO: ${formatCurrency(order.total)}*${notesText}

---
_Aguardando confirmação para início da preparação artesanal com caixa rígida perfumada Mirage Parfum._`;
}

/**
 * Generates the WhatsApp URL for sending the order
 */
export function getWhatsAppOrderUrl(order: Order): string {
  const message = formatOrderWhatsAppMessage(order);
  return `https://api.whatsapp.com/send?phone=${MIRAGE_WHATSAPP_NUMBER}&text=${encodeURIComponent(message)}`;
}

/**
 * Generates direct concierge WhatsApp chat link
 */
export function getConciergeWhatsAppUrl(customSubject?: string): string {
  const text = customSubject 
    ? `Olá, gostaria de falar com o Concierge da Mirage Parfum sobre: ${customSubject}`
    : 'Olá, gostaria de um atendimento exclusivo com o Concierge da Mirage Parfum.';
  return `https://api.whatsapp.com/send?phone=${MIRAGE_WHATSAPP_NUMBER}&text=${encodeURIComponent(text)}`;
}
