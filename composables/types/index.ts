import {
  ProductProperty,
  ProductCategory,
  ProductRatingStatistics,
  ProductVariant,
  Product
} from '~/api-client';

export * from '~/api-client';


export interface PrintMethodData {
    id?: string;
    name?: string;
    type?: string;
    image?: string;
    variants?: PrintMethodVariant[];
}

export interface PrintMethodVariant {
    price?: number;
    priceInclTax?: number;
    rangePrice?: { minQuantity: number; price: number; priceInclTax?: number }[];
    name?: string;
    sku?: string;
}

export interface PrintPositionData {
    location?: string;
    method?: string; // -> PrintMethodData.id
    size?: string;
    default?: string; // -> PrintMethodData.variants.sku
    image?: string; // url
    locationId?: string;
}

export interface CartProductQuantity {
    sku: string;
    quantity: number;
}

export interface CartProduct {
    id: string;
    variants: CartProductQuantity[];
    printMethods: CartProductPrintMethod[];
}

export interface CartProductPrintMethod {
    location: string;
    methodSku: string;
}

// Variant OR Product
export interface ProductInfo {
    id?: string;
    name?: string;
    sku?: string;
    slug?: string;
    price?: number;
    displayPrice?: number;
    defaultQuantity?: number;
    specialPrice?: number;
    tiers?: { quantity: number; price: number }[];
    image?: string;
    description?: string;
    images?: string[];
    categoryIds?: string[];
    categories?: ProductCategory[];
    variant: boolean;
    properties: ProductProperty[];
    ratings?: ProductRatingStatistics;
    numberOfReviews?: number;
    shortDescription?: string;
    urlPath?: string;
    minQuantity?: number;
    primaryVariantSelector?: VariantSelector | null;
    secondiaryVariantSelectors?: VariantSelector[];
    variants?: ProductVariant[];
    printMethods?: PrintMethodData[];
    printPositions?: PrintPositionData[];
    original: Product;
}

export interface VariantSelector {
    field: string;
    label: string;
    options: VariantSelectorOption[];
}

export interface VariantSelectorOption {
    name: string;
    label: string;
}

export interface CreateUserInfo {
    firstName?: string;
    lastName?: string;
    email?: string;
    password?: string;

    [x: string]: any;
}

export interface SearchOrderHistory {
    skip: number;
}

export interface PaymentMethod {
    methodName?: string;
    extraInfo?: any;
}

export class RecentlyViewedProducts {
    private _cookieGetter: () => string;
    private _cookieSetter: (val: string) => void;

    private recentSkus: string[] = [];

    public constructor(cookieGetter: () => string, cookieSetter: (val: string) => void) {
      this._cookieGetter = cookieGetter;
      this._cookieSetter = cookieSetter;

      const currentSkus = String(this._cookieGetter() || '');

      if (currentSkus) {
        this.recentSkus = currentSkus.split('|').filter((e: string) => e !== '');
      }
    }

    public getAndUpdateRecentProducts(currentSku: string): string[] {
      if (!currentSku || currentSku === '') return this.recentSkus;
      const n = this.recentSkus.indexOf(currentSku);
      if (n >= 0) {
        this.recentSkus.splice(n, 1);
      }
      this.recentSkus.unshift(currentSku);
      if (this.recentSkus.length > 20) {
        this.recentSkus.splice(20);
      }
      this._cookieSetter(this.recentSkus.join('|'));
      return this.recentSkus.filter((e: string) => e != currentSku);
    }
}
