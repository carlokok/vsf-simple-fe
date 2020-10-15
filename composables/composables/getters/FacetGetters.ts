/* istanbul ignore file */

import { FacetsGetters} from '@vue-storefront/core';
import { Product, ProductInfo, SearchProductsResponse } from '~/composables/types';
import { ProductInfoFilters } from './productGetters';




const facetGetters: FacetsGetters<SearchProductsResponse, Product[]> = {
  getProducts: e => e.data.items,
  getSortOptions: e => ({selected: "", options: []}),
  getAll: e => [],
  getBreadcrumbs: e=> [],
  getCategoryTree: e => ({
    isCurrent: false,
    items: [],
    label: "",
    slug: ""
  }),
  getGrouped: e => [],
  getPagination: e => ({
    currentPage: 1,
    itemsPerPage: 20,
    pageOptions: [1],
    totalItems:  !e || !e.data ? 0 : e.data.total,
    totalPages: (!e || !e.data ? 0 :(e.data.total + 19 )/ 20) | 0
  })
  
};
/*
getAll: (searchData: FacetSearchResult<SEARCH_DATA>, criteria?: CRITERIA) => AgnosticFacet[];
    getGrouped: (searchData: FacetSearchResult<SEARCH_DATA>, criteria?: CRITERIA) => AgnosticGroupedFacet[];
    getCategoryTree: (searchData: FacetSearchResult<SEARCH_DATA>) => AgnosticCategoryTree;
    getSortOptions: (searchData: FacetSearchResult<SEARCH_DATA>) => AgnosticSort;
    getProducts: (searchData: FacetSearchResult<SEARCH_DATA>) => RESULTS;
    getPagination: (searchData: FacetSearchResult<SEARCH_DATA>) => AgnosticPagination;
    getBreadcrumbs: (searchData: FacetSearchResult<SEARCH_DATA>) => AgnosticBreadcrumb[];
*/
export default facetGetters;
