
import type { CartItem, ShippingInfo, User } from "./types";

export interface UserReducerInitialState {
    user: User | null;
    loading: boolean;
}

export interface CartReducerInitialState {
    cartItems:CartItem[];
    subtotal: number;
    loading: boolean;
    tax: number;
    shippingCharges: number;
    discount: number;
    total: number;
    shippingInfo: ShippingInfo | null;
}