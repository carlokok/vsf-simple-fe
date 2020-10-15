import { UseCategory, onSSR } from '@vue-storefront/core';
import { Category } from './../../types';
import { Ref, ref, computed, watch } from '@vue/composition-api';
import {  UseCategoryFactoryParams } from '@vue-storefront/core';
import { catalogCategoryTree, catalogCategories, CatalogCategoryRequest } from '~/api-client';
import { vsfRef } from '@vue-storefront/core';


const params: UseMyCategoryFactoryParams<Category, Category, CatalogCategoryRequest> = {
  categorySearch: async (params) => {
    if ((params as any).initial)
      return [(params as any).initial as Category];
    if (!params.slug && !params.filter && !params.urlPath) return [];
    return ((await catalogCategories(params!))!.items)!;
  },
  treeSearch: async () => {
    return (await catalogCategoryTree())!;
  }
};


export type UseMyCategoryFactoryParams<CATEGORY, CATEGORYTREE, CATEGORY_SEARCH_PARAMS> = {
  categorySearch: (searchParams: CATEGORY_SEARCH_PARAMS) => Promise<CATEGORY[]>,
  treeSearch: () => Promise<CATEGORYTREE[]>
};

export type ComputedProperty<T> = Readonly<Ref<Readonly<T>>>;

export interface UseMyCategory<CATEGORY,CATEGORYTREE,CATEGORY_SEARCH_PARAMS> {
  categories: ComputedProperty<CATEGORY[]>;
  tree: ComputedProperty<CATEGORYTREE[]>;
  search: (params: CATEGORY_SEARCH_PARAMS) => Promise<void>;
  loading: Ref<boolean>;
  loadingTree: Ref<boolean>;
  loadTree: () => Promise<void>;
}

export function useMyCategoryFactory<CATEGORY, CATEGORYTREE, CATEGORY_SEARCH_PARAMS>(
  factoryParams: UseMyCategoryFactoryParams<CATEGORY, CATEGORYTREE, CATEGORY_SEARCH_PARAMS>
) {
  return function useCategory(cacheId?: string): UseMyCategory<CATEGORY, CATEGORYTREE, CATEGORY_SEARCH_PARAMS> {
    const state = vsfRef<CATEGORY[] | undefined>(undefined, "CAT: " + (cacheId || ""));
    const treeState = vsfRef<CATEGORYTREE[] | undefined>(undefined, "tree");
    const categories: Ref<CATEGORY[]> = ref(state.value || []) as Ref<CATEGORY[]>;
    const categoryTree: Ref<CATEGORYTREE[]> = ref(treeState.value || []) as Ref<CATEGORYTREE[]>;
    const loading = ref(false);
    const loadingTree = ref(false);

    const search = async (params: CATEGORY_SEARCH_PARAMS) => {
      if (!state.value) {
        loading.value = true;
      }
      categories.value = await factoryParams.categorySearch(params);
      state.value = categories.value;
      loading.value = false;
    };

    const intLoadTree = async() => {
      if (loadingTree.value) {
        return;
      }
      if (treeState.value) return;
      loadingTree.value = true;
      
      
      categoryTree.value = await factoryParams.treeSearch();

      treeState.value = categoryTree.value;
      loadingTree.value = false;
    }

    let lastLoadTree: any = null;
    const loadTree = () => {
      if (lastLoadTree)
        return lastLoadTree;
      lastLoadTree = intLoadTree();
      return lastLoadTree;
    }

    onSSR(() => {
      loadTree();
    });

    return {
      search,
      loadTree,
      loading: computed(() => loading.value),
      categories: computed(() => categories.value),
      loadingTree: computed(() => loadingTree.value),
      tree: computed(() => categoryTree.value)
    };
  };
}

const useCategory: (id: string) => UseCategory<Category> = useMyCategoryFactory<Category, Category, CatalogCategoryRequest>(params);

export default useCategory;
