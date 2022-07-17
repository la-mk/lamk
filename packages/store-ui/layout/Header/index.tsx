import React from "react";
import { Store } from "../../domain/store";
import { Header as Standard } from "./Standard/Header";
import { Header as Elegant } from "./Elegant";
import { ProductSet } from "../../domain/set";
import { Category } from "../../domain/category";

export interface HeaderProps {
  store: Pick<Store, "contact" | "logo" | "_id">;
  cartCount: number;
  searchValue?: string;
  sets: ProductSet[];
  categories: Category[];
}

export const Header = (props: HeaderProps) => {
  return <Elegant {...props} />;
};
