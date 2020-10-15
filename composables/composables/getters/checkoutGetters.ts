/* istanbul ignore file */

import { CheckoutGetters} from '@vue-storefront/core';
import { CartShippingMethod, CartPaymentMethod } from './../../types';
import { formatPrice } from '../../helpers';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const getShippingMethodId = (shippingMethod: CartShippingMethod): string => shippingMethod ? shippingMethod!.code || "" : '';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const getShippingMethodName = (shippingMethod: CartShippingMethod): string => shippingMethod ? shippingMethod!.title || "" : '';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const getShippingMethodDescription = (shippingMethod: CartShippingMethod): string => '';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const getShippingMethodPrice = (shippingMethod: CartShippingMethod): number => shippingMethod ? shippingMethod.priceInclTax || 0 : 0;


// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const getFormattedPrice = (price: number) => formatPrice(price);


export const getPaymentMethodId = (shippingMethod: CartPaymentMethod): string => shippingMethod ? shippingMethod!.code || "" : '';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const getPaymentMethodName = (shippingMethod: CartPaymentMethod): string => shippingMethod ? shippingMethod!.title || "" : '';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const getPaymentMethodDescription = (shippingMethod: CartPaymentMethod): string => '';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const getPaymentMethodPrice = (shippingMethod: CartPaymentMethod): number => 0;


const checkoutGetters: CheckoutGetters<CartShippingMethod> = {
  getShippingMethodId,
  getShippingMethodName,
  getShippingMethodDescription,
  getShippingMethodPrice,
  getFormattedPrice,
  getPaymentMethodId,
  getPaymentMethodName,
  getPaymentMethodDescription,
  getPaymentMethodPrice
};

export default checkoutGetters;
