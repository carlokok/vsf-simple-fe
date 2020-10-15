/* istanbul ignore file */

import {
  AgnosticMediaGalleryItem,
  AgnosticAttribute,
  AgnosticPrice,
  ProductGetters
} from '@vue-storefront/core';
import { ProductInfo, ProductVariant, ProductProperty, Product, ProductImage } from '../../types';
import { getVariantByAttributes, formatAttributeList, formatPrice } from '../../helpers';

export interface ProductInfoFilters {
  master?: boolean;
  attributes?: Record<string, string>;
}

export const getVariantsForProduct = (product: Product, 
  filter: Record<string, string>): ProductVariant[] => {
  return product.variants ? product.variants.filter((e: ProductVariant) => {
    var match = true;
    for(var pp in filter) {
      var prop = product.properties?.find((q: ProductProperty) => q.name == pp);
      if (!prop) {
        match = false;
        break;
      }
      if (!(prop.stringValue === filter[pp] ||
        "" + prop.intValue == filter[pp])) {
          match = false;
          break;
        }
    };

    return match;
  }) : [];
}

export const getImageForVariant = (product: Product, name: string, val: string): string => {
  return product.variants?.find((e: ProductVariant) => {
    var prop = product.properties?.find((q: ProductProperty) => q.name == name);
    if (!prop) return false;
    return prop.stringValue == val;
  })?.image || "";
}

export const getProductName = (product: Product | Readonly<Product>): string => product?.label || '';

export const getProductSlug = (product: Product | Readonly<Product>): string => product?.slug || '';

export const getProductPrice = (product: Product | Readonly<Product>): AgnosticPrice => {
  return {
    regular: product?.displayPrice || product?.price || 0,
    special: null
  };
};

export const getProductGallery = (product: Product): AgnosticMediaGalleryItem[] =>
  product?.images?.map((image: ProductImage) => {
    return {
      small: image.url,
      big: image.url,
      normal: image.url
    };
  }) || [];

export const getProductCoverImage = (product: Product): string => product?.image || "";

export const getProductFiltered = (products: Product[] | null, filters: ProductInfoFilters | any = {}): Product[] => {

  return products;
};

export const getProductAttributes = (products: Product[] | Product | null, filterByAttributeName?: string[]): Record<string, AgnosticAttribute | string> => {
  if (products == null) return  {} as any;
  const isSingleProduct = !Array.isArray(products);
  const productList = (isSingleProduct ? [products] : products) as Product[];

  if (!products || productList.length === 0) {
    return {} as any;
  }

  const formatAttributes = (product: Product): AgnosticAttribute[] =>
    formatAttributeList(product.properties).filter((attribute) => filterByAttributeName ? filterByAttributeName.includes(attribute.name!) : attribute);

  return (productList
    .map((product) => formatAttributes(product)) as any)
    .reduce((prev: any, curr: any) => [...prev, ...curr], [])
    .reduce((prev: any, curr: any) => {
      const isAttributeExist = prev.some((el: any) => el.name === curr.name && el.value === curr.value);
  
      if (!isAttributeExist) {
        return [...prev, curr];
      }
  
      return prev;
    }, [])
    .reduce((prev: any, curr: any) => ({
      ...prev,
      [curr.name]: isSingleProduct ? curr.value : [
        ...(prev[curr.name] || []),
        {
          value: curr.value,
          label: curr.label
        }
      ]
    }), {});
};

export const getProductDescription = (product: Product): string => product?.description || "";

export const getProductProperties = (product: Product): {name: string, value: string}[] => 
  product?.properties == null ? [] : product!.properties!.map(e => ({
    name: e.displayName || "",
    value: e.displayValue || ""
  }));

export const getBreadcrumbs = (product: Product): {text: string, link: string}[] => 
{
  let res = [{text: "Home", link: '/'}];
  if (product == null) return res;
  let idx = 0;
  idx = product!.urlPath!.indexOf('/', idx+1);
  while (idx > 0) {
    let sub = product!.urlPath!.substr(0, idx);
    let cat = product!.categories!.find(e => e.path == sub);
    if (cat) {
      res.push({text: cat?.label||"", link: cat?.path||""});
    }
    idx = product!.urlPath!.indexOf('/', idx+1);
  }
  res.push({text: product?.name||"", link: product?.urlPath||""});
  return res;
};

export const getProductCategoryIds = (product: Product): string[] => product?.categoryIds || [];

export const getProductId = (product: Product): string => product?.sku || "";

export const getFormattedPrice = (price: number): string => formatPrice(price);

export const getReviewDetails = (product: Product | null) => product == null ? 
  {score: 0, count: 0} : { 
    score: product?.ratings?.averageRating, 
    count: product?.numberOfReviews };

export const getProductSummary = (product: Product): string => 
    product?.shortDescription ?? "";

export const getColorLabel = (variant: ProductVariant): { key: string, label: string } => {
  if (variant && variant.properties) {
    const colorLabel = variant.properties.find(p => p.name === 'color');
    if (colorLabel)
      return colorLabel.displayValue ? {label: colorLabel.displayValue || '', key: colorLabel.stringValue || ''} : {key: '', label: ''};
  }

  return {key: '', label: ''};
}

export const colorToString = (s: string, context: any) => {
  if (!s || s == "") 
  return context.root.$t("Geen opdruk");
  switch (s.toLowerCase()) {
    case "1":return context.root.$t("1 kleur");
    case "2":return context.root.$t("2 kleuren");
    case "3":return context.root.$t("3 kleuren");
    case "4":return context.root.$t("4 kleuren");
    case "5":return context.root.$t("5 kleuren");
    case "6":return context.root.$t("6 kleuren");
    case "geborduurd": return context.root.$t("Geborduurd");
    case "lasergravure": return context.root.$t("Lasergravure");
    case "*":return context.root.$t("Full colour");
  }
  return s;
}


const productGetters: ProductGetters<Product, ProductInfoFilters> = {
  getName: getProductName,
  getSlug: getProductSlug,
  getPrice: getProductPrice,
  getGallery: getProductGallery,
  getCoverImage: getProductCoverImage,
  getFiltered: getProductFiltered,
  getAttributes: getProductAttributes,
  getDescription: getProductDescription,
  getCategoryIds: getProductCategoryIds,
  getId: getProductId,
  getProperties: getProductProperties,
  getBreadcrumbs: getBreadcrumbs,
  getFormattedPrice: getFormattedPrice,
  getReviewDetails: getReviewDetails,
  getProductSummary: getProductSummary,
  getVariantsForProduct: getVariantsForProduct,
  getImageForVariant: getImageForVariant,
  getColorLabel: getColorLabel,
  colorToString: colorToString
};
/*
    const properties = computed(() => productGetters.getProperties(product.value));
    const categories = computed(() => productGetters.getCategoryIds(product.value));
    const description = computed(() => productGetters.getDescription(product.value));
    const breadcrumbs = computed(() => productGetters.getBreadcrumbs(product.value));
*/

export default productGetters;
