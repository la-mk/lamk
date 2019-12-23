import { uniqBy } from 'lodash';
import { ShopifyProduct, MergedShopifyProduct } from './';

const mergeImages = (
  objValue: any,
  srcValue: any,
  obj: ShopifyProduct,
  src: ShopifyProduct
) => {
  if (!objValue && !srcValue) {
    return [];
  }

  if (!objValue) {
    if (Array.isArray(srcValue)) {
      return srcValue;
    }

    return [{ pos: src['Image Position'], img: srcValue }];
  }

  if (!srcValue) {
    if (Array.isArray(objValue)) {
      return objValue;
    }

    return [{ pos: obj['Image Position'], img: objValue }];
  }

  if (Array.isArray(objValue)) {
    if (srcValue) {
      if (Array.isArray(srcValue)) {
        return uniqBy([...objValue, ...srcValue], 'img');
      }

      return uniqBy(
        [...objValue, { pos: src['Image Position'], img: srcValue }],
        'img'
      );
    }
  }

  return objValue;
};

export const mergeCustomizer = (
  objValue: any,
  srcValue: any,
  key: string,
  obj: ShopifyProduct,
  src: ShopifyProduct
): MergedShopifyProduct => {
  switch (key) {
    case 'Image Src':
      return mergeImages(objValue, srcValue, obj, src);

    default:
      return objValue;
  }
};
