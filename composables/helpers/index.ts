/* istanbul ignore file */

import { locale, currency, country, ProductVariant, priceWithTax } from '~/api-client';
import { ProductInfo, ProductProperty, PrintMethodData } from '../types';
import { AgnosticAttribute } from '@vue-storefront/core';



export const formatPrice = (price: number | null): string =>  price ? new Intl.NumberFormat(`${locale.value}-${country.value}`, { style: 'currency', currency: currency.value }).format(price) : null as any;

export const formatAttributeList = (attributes: ProductProperty[]): AgnosticAttribute[] =>
  attributes.map((attr) => {
    const attrValue = String(attr.intValue ?? attr.decimalValue ?? attr.stringValue);
    return {
      name: attr.name || "",
      value: attrValue || "",
      label: attr.displayValue || ""
    };
  });

export const getVariantByAttributes = (products: ProductInfo[] | Readonly<ProductInfo[]>, attributes: any): ProductInfo | null => {
  if (!products || products.length === 0) {
    return null;
  }

  const configurationKeys = Object.keys(attributes);

  return products.find((product) => {
    const currentAttributes = formatAttributeList(product.properties);

    return configurationKeys.every((attrName) =>
      currentAttributes.find(({ name, value }) => attrName === name && attributes[attrName] === value)
    );
  }) || null;
};
