import { FacetSearchResult, useFacetFactory } from "@vue-storefront/core";
import { CatalogProductRequest, catalogProducts, SearchProductsResponse } from "~/api-client";

export const search = async (params2?: FacetSearchResult<SearchProductsResponse>): Promise<SearchProductsResponse> => {
  var req: CatalogProductRequest = {};
  let params = params2.input;

  // tweakwise
  

  if (params.search) {
    req.filter = params.search;
  }
  if (params.slug) req.urlpath = params.slug;
  if (params.perPage)  {
    if (params.page) req.skip = params.perPage * (params.page -1);
    req.take = params.perPage;
  }
  if (params.categorySlug) {
    req.categoryKeywords = [params.categorySlug];
  }
  if (params.catId)
    req.categoryId  = params.catId;
  if (params.ids)
    req.sku = params.ids;
  else
  if (params.id)
    req.sku = [params.id];


  req.sort = params.sortBy;
  /*if (params.filters) {
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
  */
  
  
  let productResponse: SearchProductsResponse = {
    total: 0,
    items: [(params as any).initial]
  };

  return await catalogProducts(req)!

};

export default useFacetFactory<SearchProductsResponse>({
  search
});
