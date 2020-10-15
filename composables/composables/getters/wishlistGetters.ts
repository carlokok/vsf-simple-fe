/* istanbul ignore file */

import {
  WishlistGetters,
  AgnosticPrice,
  AgnosticTotals,
  AgnosticAttribute
} from '@vue-storefront/core';
import { CartItem, WishList } from '../../types';
import { priceWithTax } from '~/api-client';
import { formatPrice } from '../../helpers';


// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const getWishlistItems = (wishList: WishList): CartItem[] => wishList!.list!;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const getWishlistItemName = (product: CartItem): string => product?.name || '';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const getWishlistItemImage = (product: CartItem): string => product?.image || '';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const getWishlistItemPrice = (product: CartItem): AgnosticPrice => {
  return {
    regular: priceWithTax.value ? product.priceInclTax || 0 : product!.price || 0,
    special: priceWithTax.value ? product.specialPriceIncludingTax || 0: product!.specialPrice || 0
  };
};
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const getWishlistItemQty = (product: CartItem): number => product.quantity || 0;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const getWishlistItemAttributes = (product: CartItem, filterByAttributeName?: string[])  => {
  const o: Record<string, AgnosticAttribute | string> = {};
  if (product!.properties) {
    for (var el = 0; el < product!.properties!.length; el++) 
    {
      const prop = product!.properties![el];
      if (filterByAttributeName && -1 === filterByAttributeName.indexOf(prop!.name!)) continue;
      o[prop!.name!] = {
        label: prop.displayName!,
        name: prop.name!,
        value: prop.displayValue!
      };
    }
  }
  return o;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const getWishlistItemSku = (product: CartItem): string => product?.sku || "";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const getWishlistTotals = (wishList: WishList): AgnosticTotals => {
  let total = wishList?.list?.reduce((prev: number, curr: CartItem) => prev + (curr.totalInclTax || 0), 0);
  return { total: total || 0, subtotal: total || 0 }
}  

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const getWishlistShippingPrice = (wishList: WishList): number => 0;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const getWishlistTotalItems = (wishList: WishList): number => {
  let hash: Record<string, boolean> = {};
  let count = 0;
  for(let i = 0; i < (wishList?.list?.length || 0); i++) {
    if (wishList!.list![i]?.options?.groupId == null)
      count++;
    else if (!hash[wishList!.list![i]!.options?.groupId !]) {
      hash[wishList!.list![i]!.options?.groupId!] = true;
      count++;
    }
  }

  return count;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const getFormattedPrice = (price: number): string => formatPrice(price);

export const getWishlistItemUrl = (product: CartItem) => '/p/' + product?.sku;

const wishlistGetters: WishlistGetters<WishList, CartItem> = {
  getTotals: getWishlistTotals,
  getShippingPrice: getWishlistShippingPrice,
  getItems: getWishlistItems,
  getItemName: getWishlistItemName,
  getItemImage: getWishlistItemImage,
  getItemPrice: getWishlistItemPrice,
  getItemQty: getWishlistItemQty,
  getItemAttributes: getWishlistItemAttributes,
  getItemSku: getWishlistItemSku,
  getTotalItems: getWishlistTotalItems,
  getFormattedPrice,
  getItemUrl: getWishlistItemUrl
};

export default wishlistGetters;
