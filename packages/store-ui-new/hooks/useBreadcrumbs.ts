import { useContext, useEffect } from "react";
import {
  BreadcrumbEntry,
  BreadcrumbsContext,
} from "../layout/BreadcrumbsProvider";

export const useBreadcrumbs = (
  breadcrumbs: BreadcrumbEntry[],
  deps: any[] = []
) => {
  const setBreadcrumbs = useContext(BreadcrumbsContext);
  useEffect(() => {
    setBreadcrumbs(breadcrumbs);
  }, [setBreadcrumbs, breadcrumbs, deps]);
};
