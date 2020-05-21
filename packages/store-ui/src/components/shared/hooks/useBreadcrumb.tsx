import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import {
  setBreadcrumbs,
  BreadcrumbEntry,
} from '../../../state/modules/ui/ui.module';

export const useBreadcrumb = (breadcrumbs: BreadcrumbEntry[]) => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setBreadcrumbs(breadcrumbs));
  }, []);
};
