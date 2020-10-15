/* istanbul ignore file */

import { useCartFactory, UseCartFactoryParams } from '@vue-storefront/core';
import { ref, Ref } from '@vue/composition-api';

import {
  CartItem,
  Product,
  cartLoad,
  cartUpdate,
  cartDelete,
  cartApplyCoupon,
  cartDeleteCoupon,
  cartClear,
  CartTotal,
  CartItemOptions,
  ProductInfo
} from '../../types';

import { CartProduct, CartProductPrintMethod } from '../..'

export const productToOptions = (prod: CartProduct, groupId?: string): CartItemOptions => {
  return {
    groupId: groupId,
    configurableItemOptions: prod.printMethods?.map((e: CartProductPrintMethod) => ({
      id: e.location,
      value: {
        methodSku: e.methodSku
      }
    }))
  }
}

const params: UseCartFactoryParams<CartTotal | null, CartItem, CartProduct, string> = {
  loadCart: async () => {
    return await cartLoad();
  },
  addToCart: async ({ currentCart, product, quantity }) => {
    var res = currentCart;
    if ((product as any).sku) {
      res = (await cartUpdate(product as any))!;
      return res;
    }
    let groupId: string | null = "" + Math.floor(Math.random() * 10000) + "-" + Math.floor(Math.random() * 10000);
    for(var i = 0; i < product.variants.length; i++) {
      if (product.variants[i].quantity > 0) {
        res = (await cartUpdate({
          sku: product.variants[i].sku,
          quantity: product.variants[i].quantity,
          options: productToOptions(product, groupId)
        }))!
      }
    }
    return res;
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  removeFromCart: async ({ currentCart, product }) => {
    return (await cartDelete({itemId: product.itemId, sku: product.sku}))!;
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  updateQuantity: async ({ currentCart, product, quantity }) => {
    return (await cartUpdate({
      ...product,
      quantity: quantity
    }))!;
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  clearCart: async ({ currentCart }) => (await cartClear())!,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  applyCoupon: async ({ currentCart, couponCode }) => {
    const ok = await cartApplyCoupon(couponCode);
    let updatedCart = await cartLoad();
    return {
      updatedCart,
      updatedCoupon: ok && couponCode ? couponCode : ''
    };
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  removeCoupon: async ({ currentCart }) => {
    const ok = await cartDeleteCoupon();
    let updatedCart = await cartLoad();
    return {
      updatedCart,
      updatedCoupon: ok ? '' : ''
    };
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  isOnCart: ({ currentCart }) => {
    return true;
  }
};

const { useCart, setCart } = useCartFactory<CartTotal | null, CartItem, CartProduct, string>(params);
export { useCart, setCart };
