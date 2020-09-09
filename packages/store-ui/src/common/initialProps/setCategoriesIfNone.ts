import { getStore } from '../../state/modules/store/store.selector';
import { sdk } from '@sradevski/la-sdk';
import { NextPageContext } from 'next';
import { getCategories } from '../../state/modules/categories/categories.selector';
import { setCategories } from '../../state/modules/categories/categories.module';

export const setCategoriesIfNone = (ctx: NextPageContext & { store: any }) => {
  const state = ctx.store.getState();
  const store = getStore(state);
  const categories = getCategories(state);

  const categoriesAction = categories
    ? Promise.resolve(categories)
    : sdk.storeCategory.findForStore(store?._id);

  return categoriesAction
    .then(categoriesResult => {
      if (categoriesResult && categoriesResult.total > 0) {
        ctx.store.dispatch(setCategories(categoriesResult.data));
      }
    })
    .catch(err => {
      console.log(err);
    });
};
