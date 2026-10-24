export type ConcentrationType = 'Extrait de Parfum' | 'Eau de Parfum' | 'Eau de Toilette' | 'Elixir';

export interface Product {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  longDescription?: string;
  price: number;
  promotionalPrice?: number;
  volume: string;
  availableVolumes: string[];
  category: string;
  concentration: ConcentrationType;
  notesTop: string;
  notesHeart: string;
  notesBase: string;
  longevity: string;
  sillage: string;
  gender: 'Unissex' | 'Masculino' | 'Feminino';
  images: string[];
  featured: boolean;
  isBestseller: boolean;
  stock: number;
  status: 'active' | 'draft' | 'archived';
  ratingCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedVolume: string;
}

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  volume: string;
  image: string;
}

export interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  cep: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  items: OrderItem[];
  subtotal: number;
  shippingPrice: number;
  shippingType: string;
  shippingDeadline: string;
  discount: number;
  couponCode?: string;
  total: number;
  notes?: string;
  status: 'novo' | 'em preparação' | 'enviado' | 'entregue' | 'cancelado';
  createdAt: string;
}

export interface Lead {
  id: string;
  email: string;
  name?: string;
  phone?: string;
  source: 'newsletter' | 'checkout_abandonment' | 'vip_club';
  createdAt: string;
}

export interface Coupon {
  id: string;
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  minOrderValue: number;
  maxUses?: number;
  usedCount: number;
  validUntil?: string;
  isActive: boolean;
  createdAt: string;
}

export interface ShippingOption {
  id: string;
  name: string;
  carrier: 'Correios' | 'JadLog' | 'Mirage Concierge';
  price: number;
  deadline: string;
  description: string;
}

export interface AdminUser {
  email: string;
  role: 'superadmin' | 'admin';
  isAuthenticated: boolean;
}
