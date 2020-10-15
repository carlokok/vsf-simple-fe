/* istanbul ignore file */

import { UseCheckout, vsfRef } from '@vue-storefront/core';
import { ref, Ref, watch, computed } from '@vue/composition-api';
import {
  cartShippingMethods,
  cartPaymentMethods,
  cartShippingInformation,
  order,
  CartShippingMethod,
  CartPaymentMethod,
  UserAddress,
  UserInfo,
  cartLoad
} from '~/api-client';
import { PaymentMethod } from '../../types';
import { AgnosticAddress } from '../useUser/factoryParams';
import { useCart, setCart } from '../useCart';
import { sharedRef } from '@vue-storefront/core';
export interface EntryUserDetails {
  firstname?: string;
  lastname?: string;
  email?: string;
  password?: string;
}

export function agnosticAddressToAddress(address: AgnosticAddress): UserAddress {
  return {
    firstName: address.firstName,
    lastName: address.lastName,
    city: address.city,
    email: address.email as string,
    countryCode: address.country,
    addressLine1: address.streetName,
    postCode: address.postalCode,
    addressLine2: address.apartment,
    company: address.company,
    region: address.state,
    phone: address.phoneNumber,
    vatId: address.vatid,
    defaultBilling: address.defaultBilling,
    defaultShipping: address.defaultShipping,
    id: address.id,
    streetNumber: address.streetNumber,
    streetNumberSuffix: address.streetNumberSuffix
  };
}

export default function useCheckout(): UseCheckout<
    CartPaymentMethod[],
    CartShippingMethod[],
    Ref<EntryUserDetails>,
    Ref<AgnosticAddress>,
    Ref<AgnosticAddress>,
    Ref<PaymentMethod>,
    Ref<CartShippingMethod>,
    () => Promise<string>
    > {

  const loading = ref(false);

  const paymentMethods: Ref<CartPaymentMethod[]> = vsfRef<CartPaymentMethod[]>([], 'payment-methods');
  const shippingMethods: Ref<CartShippingMethod[]> = vsfRef([], 'shippingmethods');
  const personalDetails: Ref<EntryUserDetails> = vsfRef({}, 'personaldetails');
  const shippingDetails: Ref<AgnosticAddress> = vsfRef({}, 'shippingdetails');
  const billingDetails: Ref<AgnosticAddress> = vsfRef({}, 'billingdetails');
  const chosenPaymentMethod: Ref<PaymentMethod> = vsfRef({}, 'chosenpaymentmethod');
  const chosenShippingMethod: Ref<CartShippingMethod> = vsfRef({}, 'chosenshippingmethod');

  watch(chosenShippingMethod, async () => {
    if (loading.value) return;
    loading.value = true;
    try {
      if (chosenShippingMethod.value?.code) {
        setCart((await cartShippingInformation(chosenShippingMethod.value.code!, agnosticAddressToAddress(shippingDetails.value)))!);
      }
      shippingMethods.value = (await cartShippingMethods(agnosticAddressToAddress(shippingDetails.value)))!;
      paymentMethods.value = (await cartPaymentMethods())!;
    } finally {
      loading.value = false;
    }
  });

  const placeOrder = async () => {
    let orderNo = '';
    loading.value = true;
    try {
      await cartShippingInformation(chosenShippingMethod.value.code!, agnosticAddressToAddress(shippingDetails.value));
      orderNo = (await order({
        billingAddress: agnosticAddressToAddress(billingDetails.value),
        shippingAddress: agnosticAddressToAddress(shippingDetails.value),
        paymentMethod: chosenPaymentMethod.value?.methodName,
        paymentMethodExtra: chosenPaymentMethod.value?.extraInfo,
        shippingMethod: chosenShippingMethod.value?.code
      }))!;
      // This ensures we have a clean & new cart.
      setCart((await cartLoad())!);
      return orderNo;
    } catch (e) {
      loading.value = false;
      return orderNo;
    } finally {
      loading.value = false;
    }
  };

  return {
    paymentMethods,
    shippingMethods,
    personalDetails,
    shippingDetails,
    billingDetails,
    chosenPaymentMethod,
    chosenShippingMethod,
    placeOrder,
    loading: computed(() => loading.value)
  };
}
