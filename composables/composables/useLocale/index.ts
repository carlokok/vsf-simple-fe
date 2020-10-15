/* istanbul ignore file */

import {
  countries,
  currencies,
  locales,
  cookies,
  setup,
  locale as defaultLocale,
  country as defaultCountry,
  currency as defaultCurrency
} from '~/api-client';
import { AgnosticLocale, AgnosticCountry, AgnosticCurrency } from '@vue-storefront/core';
import { computed, Ref, ref, watch } from '@vue/composition-api';
import Cookies from 'js-cookie';
import { sharedRef } from '@vue-storefront/core';




export default function useLocale() {


  const locale: Ref<AgnosticLocale> = sharedRef(locales.find(e => e.code == defaultLocale.value)!, "locale-ref");
  const country: Ref<AgnosticCountry> = sharedRef(countries.find(e => e.code == defaultCountry.value)!, "country-ref");
  const currency: Ref<AgnosticCurrency> = sharedRef(currencies.find(e => e.code == defaultCurrency.value)!, "currency-ref");
  const priceWithTax: Ref<boolean> = sharedRef(Cookies.get(cookies.taxCookieName) != '0', "pricewithtax");
  
    
  let loaded = false;
  watch(priceWithTax, () => {
    if (!loaded) return;
    Cookies.set(cookies.taxCookieName, priceWithTax.value ? '1' : '0', {
      expires: new Date(new Date().getTime() + 1000 * 3600 * 24 * 30),
      path: '/',
      sameSite: 'strict'
    });
    setup({ priceWithTax: priceWithTax.value });
  }, {
  });
  
  watch(country, () => {
    if (!country.value || !loaded) return;
    Cookies.set(cookies.countryCookieName, country.value.code, {
      expires: new Date(new Date().getTime() + 1000 * 3600 * 24 * 30),
      path: '/',
      sameSite: 'strict'
    });
    setup({ country: country.value.code });
  });
  
  watch(currency, () => {
    if (!currency.value || !loaded) return;
    Cookies.set(cookies.currencyCookieName, currency.value.code, {
      expires: new Date(new Date().getTime() + 1000 * 3600 * 24 * 30),
      path: '/',
      sameSite: 'strict'
    });
    setup({ currency: currency.value.code });
  });
  

  loaded = false;
  
  let val = Cookies.get(cookies.countryCookieName) || defaultCountry;
  country.value = countries.find(e => e.code == val) || country.value;

  val = Cookies.get(cookies.currencyCookieName) || defaultCurrency;
  currency.value = currencies.find(e => e.code == val) || currency.value;

  val = Cookies.get(cookies.localeCookieName) || defaultLocale;
  locale.value = locales.find(e => e.code == val) || locale.value;

  loaded = true;


  return {
    availableLocales: computed(() => locales),
    availableCountries: computed(() => countries),
    availableCurrencies: computed(() => currencies),
    country: country.value,
    currency: currency.value,
    locale: locale.value,
    priceWithTax,
    loadAvailableLocales: () => Promise.resolve(),
    loadAvailableCountries: () => Promise.resolve(),
    loadAvailableCurrencies: () => Promise.resolve(),
    loading: computed(() => false)
  }
}
