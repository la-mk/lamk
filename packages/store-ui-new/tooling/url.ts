import Router from "next/router";
import { isNil, isString } from "lodash";
import queryString from "qs";
import { Category } from "../domain/category";

export const urls = {
  about: "/about",
  cart: "/cart",
  checkout: "/checkout",
};

export const getFiltersFromSearch = (search: string) => {
  if (isNil(search)) {
    return {};
  }

  return { q: search };
};

export const getSearchHref = (search: string) => {
  const productsUrl = `/products?${queryString.stringify({
    ...getFiltersFromSearch(search),
  })}`;

  return productsUrl;
};

export const getCategoryHref = (category: string) => {
  return `/products?${getQueryForCategories([category])}`;
};

export const getLevel2CategoryHref = (
  categoryName: string,
  categories: Category[]
) => {
  const level3Categories = categories
    .filter((category) => category.level2 === categoryName)
    .map((category) => category.level3);

  return `/products?${getQueryForCategories(level3Categories)}`;
};

export const getQueryForCategories = (categories: string | string[]) => {
  if (isString(categories)) {
    return queryString.stringify({ f: { category: categories } });
  }

  return queryString.stringify({ f: { category: { $in: categories } } });
};

export const filterRouter = {
  push: Router.push,
  routeChangeListener: (cb: () => void) => {
    Router.events.on("routeChangeComplete", cb);
    return () => Router.events.off("routeChangeComplete", cb);
  },
};
