/* istanbul ignore file */

import { CategoryGetters, AgnosticCategoryTree, AgnosticBreadcrumb } from '@vue-storefront/core';
import { Category } from './../../types';


export const getCategoryTree = (category: Category[]): AgnosticCategoryTree => {
  if (!category) {
    return {
      label: "",
      items: [],
      isCurrent: false
    }
  }

  let buildCategory = (c: Category): AgnosticCategoryTree => ({
    label: c.label || "",
    slug: c.slug || "",
    path: c.urlPath || "",
    items: c.children ? c.children.map(buildCategory) : [],
    labelbackgroundcolor: c.labelbackgroundcolor || null,
    labelcolor: c.labelcolor || null,
    productlabel: c.productlabel || false,
    special: c.special || false,
    isCurrent: false
  });

  return { 
    isCurrent: false,
    label: "Home",
    items: category.map(buildCategory)
  }
};

const getCategoryBreadcrumbs = (category: Category): AgnosticBreadcrumb[] => {
  let res: { text: string, link: string}[] = [{text: "Home", link:"/"}];
  if (!category) return res;

  for (let i = 0; i < category!.parents!.length; i++) { 
    res.push({text: category.parents![i].label!, link: category.parents![i].urlPath!});
  }
  res.push({text: category.label!, link: category.urlPath!});
  return res;
}

const categoryGetters: CategoryGetters<Category> = {
  getTree: getCategoryTree,
  getBreadcrumbs: getCategoryBreadcrumbs,
};

export default categoryGetters;
