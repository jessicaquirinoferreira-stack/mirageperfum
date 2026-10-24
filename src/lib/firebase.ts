import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged, signOut, User } from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  getDocFromServer, 
  collection, 
  getDocs, 
  setDoc, 
  deleteDoc, 
  query, 
  orderBy, 
  limit,
  serverTimestamp
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { Product, Order, Lead, Coupon } from '../types';
import { INITIAL_PRODUCTS, INITIAL_COUPONS } from '../data/initialProducts';

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, (firebaseConfig as any).firestoreDatabaseId);
export const auth = getAuth(app);

// Operation types for standard error handling
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.warn('Firestore Operation Notification:', JSON.stringify(errInfo));
  return errInfo;
}

// Test connection on boot per specification
export async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firebase client is offline or database initializing.');
    }
  }
}
testConnection();

// Products services with automatic fallback to initial products
export async function getProductsService(): Promise<Product[]> {
  try {
    const productsRef = collection(db, 'products');
    const snapshot = await getDocs(productsRef);
    if (snapshot.empty) {
      // Seed initial products to Firestore
      await seedDatabase();
      return INITIAL_PRODUCTS;
    }
    const products: Product[] = [];
    snapshot.forEach(docSnap => {
      const data = docSnap.data();
      products.push({
        id: docSnap.id,
        ...data,
      } as Product);
    });
    return products.length > 0 ? products : INITIAL_PRODUCTS;
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, 'products');
    // Fallback gracefully so UI remains responsive and rich
    return INITIAL_PRODUCTS;
  }
}

export async function saveProductService(product: Product): Promise<void> {
  const id = product.id || `perfume-${Date.now()}`;
  try {
    await setDoc(doc(db, 'products', id), {
      ...product,
      id,
      updatedAt: new Date().toISOString(),
    }, { merge: true });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `products/${id}`);
    throw err;
  }
}

export async function deleteProductService(productId: string): Promise<void> {
  try {
    await deleteDoc(doc(db, 'products', productId));
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, `products/${productId}`);
    throw err;
  }
}

// Seed initial database
export async function seedDatabase() {
  try {
    for (const p of INITIAL_PRODUCTS) {
      await setDoc(doc(db, 'products', p.id), {
        ...p,
        createdAt: new Date().toISOString()
      }, { merge: true });
    }
    for (const c of INITIAL_COUPONS) {
      await setDoc(doc(db, 'coupons', c.id), {
        ...c,
        createdAt: new Date().toISOString()
      }, { merge: true });
    }
  } catch (err) {
    console.log('Seed info:', err);
  }
}

// Orders Service
export async function createOrderService(order: Omit<Order, 'id'>): Promise<string> {
  const orderId = `MIR-${Math.floor(100000 + Math.random() * 900000)}`;
  try {
    await setDoc(doc(db, 'orders', orderId), {
      ...order,
      id: orderId,
      createdAt: new Date().toISOString()
    });
    return orderId;
  } catch (err) {
    handleFirestoreError(err, OperationType.CREATE, `orders/${orderId}`);
    // Save to local storage as fallback so customer order is never lost
    try {
      const existing = JSON.parse(localStorage.getItem('mirage_local_orders') || '[]');
      existing.unshift({ ...order, id: orderId, createdAt: new Date().toISOString() });
      localStorage.setItem('mirage_local_orders', JSON.stringify(existing));
    } catch {}
    return orderId;
  }
}

export async function getOrdersService(): Promise<Order[]> {
  try {
    const ordersRef = collection(db, 'orders');
    const snapshot = await getDocs(ordersRef);
    const orders: Order[] = [];
    snapshot.forEach(docSnap => {
      orders.push(docSnap.data() as Order);
    });
    // Merge with any local orders fallback
    const local = JSON.parse(localStorage.getItem('mirage_local_orders') || '[]');
    const map = new Map<string, Order>();
    orders.forEach(o => map.set(o.id, o));
    local.forEach((o: Order) => {
      if (!map.has(o.id)) map.set(o.id, o);
    });
    return Array.from(map.values()).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, 'orders');
    return JSON.parse(localStorage.getItem('mirage_local_orders') || '[]');
  }
}

export async function updateOrderStatusService(orderId: string, status: Order['status']): Promise<void> {
  try {
    await setDoc(doc(db, 'orders', orderId), { status }, { merge: true });
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, `orders/${orderId}`);
    // Local update
    try {
      const local: Order[] = JSON.parse(localStorage.getItem('mirage_local_orders') || '[]');
      const updated = local.map(o => o.id === orderId ? { ...o, status } : o);
      localStorage.setItem('mirage_local_orders', JSON.stringify(updated));
    } catch {}
  }
}

// Leads Service
export async function createLeadService(lead: Omit<Lead, 'id'>): Promise<void> {
  const leadId = `lead-${Date.now()}`;
  try {
    await setDoc(doc(db, 'leads', leadId), {
      ...lead,
      id: leadId,
      createdAt: new Date().toISOString()
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.CREATE, `leads/${leadId}`);
    try {
      const local = JSON.parse(localStorage.getItem('mirage_leads') || '[]');
      local.unshift({ ...lead, id: leadId, createdAt: new Date().toISOString() });
      localStorage.setItem('mirage_leads', JSON.stringify(local));
    } catch {}
  }
}

export async function getLeadsService(): Promise<Lead[]> {
  try {
    const leadsRef = collection(db, 'leads');
    const snapshot = await getDocs(leadsRef);
    const leads: Lead[] = [];
    snapshot.forEach(docSnap => leads.push(docSnap.data() as Lead));
    const local: Lead[] = JSON.parse(localStorage.getItem('mirage_leads') || '[]');
    const map = new Map<string, Lead>();
    leads.forEach(l => map.set(l.id, l));
    local.forEach(l => {
      if (!map.has(l.id)) map.set(l.id, l);
    });
    return Array.from(map.values()).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, 'leads');
    return JSON.parse(localStorage.getItem('mirage_leads') || '[]');
  }
}

// Coupons Service
export async function getCouponsService(): Promise<Coupon[]> {
  try {
    const couponsRef = collection(db, 'coupons');
    const snapshot = await getDocs(couponsRef);
    if (snapshot.empty) {
      return INITIAL_COUPONS;
    }
    const coupons: Coupon[] = [];
    snapshot.forEach(docSnap => coupons.push(docSnap.data() as Coupon));
    return coupons.length > 0 ? coupons : INITIAL_COUPONS;
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, 'coupons');
    return INITIAL_COUPONS;
  }
}

export async function saveCouponService(coupon: Coupon): Promise<void> {
  const id = coupon.id || coupon.code.toLowerCase();
  try {
    await setDoc(doc(db, 'coupons', id), {
      ...coupon,
      id,
      createdAt: coupon.createdAt || new Date().toISOString(),
    }, { merge: true });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `coupons/${id}`);
    throw err;
  }
}

export async function deleteCouponService(couponId: string): Promise<void> {
  try {
    await deleteDoc(doc(db, 'coupons', couponId));
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, `coupons/${couponId}`);
    throw err;
  }
}
