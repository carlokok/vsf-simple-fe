/* istanbul ignore file */

import { useWishlistFactory, UseWishlistFactoryParams } from '@vue-storefront/core';
import { ProductInfo, WishList, CartItem, wishlistGetCreate, wishlistAdditem, wishlistRemoveitem, wishlistClear } from '../../types';
import { productToOptions } from '../useCart';
import { CartProduct } from '../..';

const wishlistName = "default";

const params: UseWishlistFactoryParams<WishList, CartItem, CartProduct> = {
  loadWishlist: async () => (await wishlistGetCreate(wishlistName))!,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  addToWishlist: async ({ currentWishlist, product }) => {
    let res = currentWishlist;
    let groupId: string | null = "" + Math.floor(Math.random() * 10000) + "-" + Math.floor(Math.random() * 10000);
    for (let i = 0; i < product.variants.length; i++) {
      if (product.variants[i].quantity > 0) {
          res = (await wishlistAdditem(wishlistName, {
          quantity: product.variants[i].quantity,
          sku: product.variants[i].sku,
          options: productToOptions(product, groupId)
        }))!;
      }
    }
    return res;    
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  removeFromWishlist: async ({ currentWishlist, product }) => (await wishlistRemoveitem(wishlistName, product))!,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  clearWishlist: async ({ currentWishlist }) => {
    await wishlistClear(wishlistName);
    return {name: wishlistName, list: []};
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  isOnWishlist: ({currentWishlist, product}) => !! currentWishlist.list?.find((a: CartItem) => a.sku == (product as any as ProductInfo).sku)
};

const {setWishlist, useWishlist } = useWishlistFactory<WishList, CartItem, CartProduct>(params);

export { setWishlist, useWishlist};
