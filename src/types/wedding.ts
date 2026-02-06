export interface GiftItem {
  id: string;
  name: string;
  description?: string;
  price?: number;
  link?: string;
  image?: string;
  purchased: boolean;
  purchasedBy?: string;
}

export interface WeddingInfo {
  couple: string;
  date: string;
  message: string;
  phone: string;
  email: string;
  address: string;
  pixKey?: string;
}
