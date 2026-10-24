import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem, Coupon, ShippingOption } from '../types';
import { getCouponsService } from '../lib/firebase';

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, volume?: string, quantity?: number) => void;
  removeFromCart: (productId: string, volume: string) => void;
  updateQuantity: (productId: string, volume: string, delta: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartSubtotal: number;
  appliedCoupon: Coupon | null;
  applyCoupon: (code: string) => Promise<{ success: boolean; message: string }>;
  removeCoupon: () => void;
  discountAmount: number;
  selectedShipping: ShippingOption | null;
  setSelectedShipping: (shipping: ShippingOption | null) => void;
  isCartDrawerOpen: boolean;
  setIsCartDrawerOpen: (open: boolean) => void;
  wishlist: Product[];
  toggleWishlist: (product: Product) => void;
  isInWishlist: (productId: string) => boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'mirage_cart_v1';
const WISHLIST_STORAGE_KEY = 'mirage_wishlist_v1';

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [wishlist, setWishlist] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem(WISHLIST_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [selectedShipping, setSelectedShipping] = useState<ShippingOption | null>(null);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch {}
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlist));
    } catch {}
  }, [wishlist]);

  const addToCart = (product: Product, volume?: string, quantity = 1) => {
    const selectedVol = volume || product.volume;
    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.product.id === product.id && item.selectedVolume === selectedVol
      );

      if (existingIndex > -1) {
        const next = [...prev];
        next[existingIndex] = {
          ...next[existingIndex],
          quantity: next[existingIndex].quantity + quantity,
        };
        return next;
      }
      return [...prev, { product, volume: selectedVol, quantity, selectedVolume: selectedVol }];
    });
    setIsCartDrawerOpen(true);
  };

  const removeFromCart = (productId: string, volume: string) => {
    setCart((prev) =>
      prev.filter((item) => !(item.product.id === productId && item.selectedVolume === volume))
    );
  };

  const updateQuantity = (productId: string, volume: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.product.id === productId && item.selectedVolume === volume) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
    setSelectedShipping(null);
  };

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const cartSubtotal = cart.reduce((acc, item) => {
    const unitPrice = item.product.promotionalPrice || item.product.price;
    return acc + unitPrice * item.quantity;
  }, 0);

  const applyCoupon = async (code: string): Promise<{ success: boolean; message: string }> => {
    const clean = code.trim().toUpperCase();
    if (!clean) return { success: false, message: 'Digite um código de cupom.' };

    const coupons = await getCouponsService();
    const found = coupons.find((c) => c.code.toUpperCase() === clean && c.isActive);

    if (!found) {
      return { success: false, message: 'Cupom inválido ou expirado.' };
    }

    if (found.minOrderValue && cartSubtotal < found.minOrderValue) {
      return {
        success: false,
        message: `Este cupom exige um pedido mínimo de R$ ${found.minOrderValue.toFixed(2)}.`,
      };
    }

    setAppliedCoupon(found);
    return {
      success: true,
      message: `Cupom ${found.code} aplicado com sucesso!`,
    };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  const discountAmount = appliedCoupon
    ? appliedCoupon.type === 'percentage'
      ? (cartSubtotal * appliedCoupon.value) / 100
      : appliedCoupon.value
    : 0;

  const toggleWishlist = (product: Product) => {
    setWishlist((prev) => {
      const exists = prev.some((p) => p.id === product.id);
      if (exists) {
        return prev.filter((p) => p.id !== product.id);
      }
      return [...prev, product];
    });
  };

  const isInWishlist = (productId: string) => {
    return wishlist.some((p) => p.id === productId);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        cartSubtotal,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        discountAmount,
        selectedShipping,
        setSelectedShipping,
        isCartDrawerOpen,
        setIsCartDrawerOpen,
        wishlist,
        toggleWishlist,
        isInWishlist,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};
