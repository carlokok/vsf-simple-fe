/* istanbul ignore file */

import { UserOrderGetters } from '@vue-storefront/core';
import { CartTotal, CartItem } from '../../types';
import { formatPrice } from '../../helpers';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const getDate = (order: CartTotal): string => new Date(order?.orderDate as any).toLocaleDateString();

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const getId = (order: CartTotal): string => order?.orderId || '';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const getStatus = (order: CartTotal): string => order?.status || '';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const getPrice = (order: CartTotal): number => order?.grandTotal || 0;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const getItems = (order: CartTotal): CartItem[] => order?.items || [];

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const getItemSku = (item: CartItem): string => item?.sku || '';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const getItemName = (item: CartItem): string => item?.name || '';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const getItemQty = (item: CartItem): number => item?.quantity || 0;

export const getItemPrice = (item: CartItem): number => item?.totalInclTax || 0;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const getFormattedPrice = (price: number) => formatPrice(price);

const orderGetters: UserOrderGetters<CartTotal, CartItem> = {
  getDate,
  getId,
  getStatus,
  getPrice,
  getItems,
  getItemSku,
  getItemName,
  getItemQty,
  getFormattedPrice,
  getItemPrice
};

export default orderGetters;
