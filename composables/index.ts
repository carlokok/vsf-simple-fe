/* istanbul ignore file */
import { useCart, setCart } from './composables/useCart';
import useCategory from './composables/useCategory';
import useCheckout from './composables/useCheckout';
import useLocale from './composables/useLocale';
import useProduct from './composables/useProduct';
import useUser from './composables/useUser';
import useReviews from './composables/useReviews';
import useFacet from './composables/useFacet';
import useUserOrders from './composables/useUserOrders';
import { setWishlist, useWishlist } from "./composables/useWishlist";
import useStock from "./composables/useStock";
import { cartGetters, userGetters, categoryGetters, productGetters, checkoutGetters, orderGetters, reviewGetters, wishlistGetters, facetGetters } from './composables/getters/';
import { ProductInfo, ProductVariant, CartProductPrintMethod, CartProductQuantity, priceWithTax, PrintMethodData } from './types';
export * from "./types"
import useUiHelpers from './useUiHelpers';

export {
  useUiHelpers
};

export const findMethodBySku = (methods: PrintMethodData[], sku: String) => {
  for(let i = 0; i < methods.length; i++) {
    let method = methods[i];
    for (let j = 0; j < method!.variants!.length; j++) {
      if (method!.variants![j]!.sku == sku) return method!.variants![j] || null;
    }
  }
  return null;
}

export const getPriceForQuantity = (prod: ProductInfo, variants: CartProductQuantity[], methods: CartProductPrintMethod[], quantity?: number) => {
  let res = 0;
  for(let vv in variants) {
    let v = variants[vv];
    if (v.quantity <= 0) continue;
    let price = 0;
    let tiers;
    let q = quantity || v.quantity;
    let variant = prod.variants && prod.variants.find((e: ProductVariant) => e.sku == v.sku);
    if (variant) {
      price = priceWithTax.value ? variant.priceInclTax! : variant.price!;
      if (variant.rangePrice) {
        for (let i = 0; i < variant.rangePrice.length; i++) {
          if (q >= variant!.rangePrice![i]!.minQuantity!) {
            price = priceWithTax.value ?variant!.rangePrice![i]!.priceInclTax! : variant!.rangePrice![i]!.price!;
          } else break;
        }
      }
    } else {
      price = prod.price!;
      if (prod.tiers) {
        for (let i = 0; i < prod.tiers.length; i++) {
          if (q >= prod.tiers[i].quantity) {
            price = prod.tiers[i].price;
          } else break;
        }
      }
    }
    
    // props.selection
    if (methods) {
      for (let i = 0; i < methods.length; i++) {
        var selSku = methods[i].methodSku;
        let method = findMethodBySku(prod.printMethods!, selSku);
        if (method) {
          var subprice = priceWithTax.value ? method.priceInclTax! : method.price!;
          for (let j = 0; j < method!.rangePrice!.length; j++) {
            if (q >= method!.rangePrice![j]!.minQuantity) {
              subprice = priceWithTax.value ? method!.rangePrice![j]!.priceInclTax! : method!.rangePrice![j]!.price!;
            }
          }
          price += subprice;
        }
      }
    }
    res += price;
  }
  
  return res;
}

export {
  useCategory,
  useProduct,
  useCart, 
  setCart,
  useCheckout,
  useUser,
  useLocale,
  useFacet,
  useUserOrders,
  useReviews,
  setWishlist, 
  useWishlist,
  useStock,
  cartGetters,
  categoryGetters,
  checkoutGetters,
  productGetters,
  userGetters,
  orderGetters,
  reviewGetters,
  facetGetters,
  wishlistGetters
};

