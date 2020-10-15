import { AgnosticSortByOption, ProductsSearchResult, AgnosticOrderStatus, UseProductFactoryParams, UseProduct, vsfRef, sharedRef, SearchParams, useProductFactory } from '@vue-storefront/core';
import { catalogRelatedProducts, catalogProducts, priceWithTax, CatalogProductRequest, Product, AggregateResponse, SearchProductsResponse, AggregateField, AttributeOption, AggregateResponseBucket, ProductProperty, Category, ProductVariant, RangePrice, ProductCategory, ProductImage } from '~/api-client';
import { ProductInfo, VariantSelector } from '../../types';
import { ref, Ref, computed } from '@vue/composition-api';

export interface FilterData {
  name: string;
  label: string;
  options: FilterOption[];
  settings?: FilterSettings;
}

export interface FilterSettings 
{
  facetid?: number;
  isvisible?: boolean;
  attributename?: string;
  urlkey?: string;
  title?: string;
  iscollapsible?: boolean;
  iscollapsed?: boolean;
  nrofshownattributes?: number;
  expandtext?: string;
  collapsetext?: string;
  ismultiselect?: boolean;
  multiselectlogic?: string;
  selectiontype?: string;
  nrofcolumns?: number;
  isnrofresultsvisible?: boolean;
  isinfovisible?: boolean;
  infotext?: string;
  containsclickpoints?: boolean;
  containsbuckets?: boolean;
  source?: string;
  prefix?: string;
  postfix?: string;
  cssclass?: string;
}

export interface FilterOption 
{
  count: number;
  selected: boolean;
  label: string;
  value: string;
}

const getFiltersFromResponse = (prod: SearchProductsResponse, req?: Record<string, FilterData>): Record<string, FilterData> => {
  let res: Record<string, FilterData> = {};
  if (prod.minimumPrice && prod.maximumPrice) {
    res['price'] = {
      name: 'price',
      label: 'Price',
      options: [
        {
          count: prod.minimumPrice,
          selected: false,
          value: 'min',
          label: 'min'
        },
        {
          count: prod.maximumPrice,
          selected: false,
          value: 'max',
          label: 'max'
        }
      ]
    }
  }

  if (prod.aggregates) {
    for(let i = 0; i < prod.aggregates.length; i++)
    {
      var el = prod.aggregates[i];
      if (!el.attribute) continue;
      var selected: string[] = [];
      if (req && req[el.aggregateName || ""]?.options) {
        selected = req![el.aggregateName || ""]?.options.filter((e: FilterOption) => e.selected).map((e: FilterOption) => e.value);
      }
      res[el.aggregateName || ""] = {
        label: el.attribute.label || el.aggregateName || "",
        name: el.aggregateName || "",
        options: el?.buckets?.map((e: AggregateResponseBucket) => ({
          count: e.count || 0,
          selected: selected.indexOf(e.filterKey || "") >= 0,
          label: e.filterKey || "",
          value: el?.attribute?.options?.find((o: AttributeOption) => String(o.value) == e.filterKey)?.label || e.filterKey  || ""
        })) || []
      }
    }
  }

  return res;
};

interface ProductSearchParameters {
  slug?: string;
  perPage?: number;
  page?: number;
  catId?: string[];
  category: Category;
  twkey: string;
  id?: string;
  ids?: string[];
  sortBy: string;
  filters?: Record<string, FilterData>;
  search?: string;
  related?: boolean;
  viewed?: boolean;
  minMaxFilter: { min: any, max: any}
}

const availableSortingOptions = [
  { value: 'recommended', label: 'Recommended' },
  { value: 'created_at:desc', label: 'Latest' },
  { value: 'final_price:asc', label: 'Price from low to high' },
  { value: 'final_price:desc', label: 'Price from high to low' }
];

const productsSearch = async (params: ProductSearchParameters): Promise<ProductsSearchResult<Product, Record<string, FilterData>, AgnosticSortByOption[]>> => {
  var req: CatalogProductRequest = {};

  // tweakwise
  

  if (params.search) {
    req.filter = params.search;
  }
  if (params.slug) req.urlpath = params.slug;
  if (params.perPage)  {
    if (params.page) req.skip = params.perPage * (params.page -1);
    req.take = params.perPage;
  }
  if (params.catId)
    req.categoryId  = params.catId;
  if (params.ids)
    req.sku = params.ids;
  else
  if (params.id)
    req.sku = [params.id];


  req.sort = params.sortBy;
  if (params.filters) {
    req.propertyFilters = {};
    for(let key in params.filters) {
      var sel = params.filters[key].options?.find((e: FilterOption) => e.selected);
      if (sel) {
        if (req.propertyFilters[params.filters[key].name]) {
          req.propertyFilters[params.filters[key].name].push(sel.value);
        } else 
          req.propertyFilters[params.filters[key].name] = [sel.value];
      }
    }
  }
  
  
  
  let productResponse: SearchProductsResponse = {
    total: 0,
    items: [(params as any).initial]
  };

  if ((params as any).initial) {
    productResponse = {
      total: 0,
      items: [(params as any).initial]
    }
  } else {
    if (params.related) {
      productResponse = {
        total: 0,
        items: await catalogRelatedProducts(params.catId, params.id!)
      }
    } else {
      productResponse = (await catalogProducts(req))!;
    }
  }


  
  let res = {
    availableFilters: getFiltersFromResponse(productResponse),
    availableSortingOptions: availableSortingOptions,
    total: productResponse.total || 0,
    data: (productResponse!.items)
  };
  
  return res;
};


export default useProductFactory<Product, ProductSearchParameters, Record<string, FilterData>, AgnosticSortByOption[]>({ productsSearch });
