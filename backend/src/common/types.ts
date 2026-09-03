export type StockStatus = 'in' | 'pre' | 'out';
export type OrderStatus = 'new' | 'confirmed' | 'shipped' | 'way' | 'done' | 'cancel';
export type UserRole = 'admin' | 'customer';
export type PayMethod = 'cash' | 'click' | 'payme' | 'card';
export type DeliveryMethod = 'courier' | 'region' | 'pickup';

export interface JwtPayload {
  sub: string;
  email: string;
  role: UserRole;
}

/** Ro'yxat javoblari uchun umumiy shakl */
export interface Paged<T> {
  items: T[];
  total: number;
  page: number;
  pages: number;
}
