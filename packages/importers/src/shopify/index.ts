import csvtojson from 'csvtojson';
import { toNumber, mergeWith, uniqBy, sortBy } from 'lodash';
import sanitizeHtml from 'sanitize-html';
import fetch from 'node-fetch';
import { mergeCustomizer } from './merger';
import { LamkProduct } from '../';

export interface ShopifyProduct {
  Handle: string;
  Title: string;
  'Body (HTML)': string;
  Vendor: string;
  Type: string;
  Tags: string;
  Published: string;
  'Option1 Name': string;
  'Option1 Value': string;
  'Option2 Name': string;
  'Option2 Value': string;
  'Option3 Name': string;
  'Option3 Value': string;
  'Variant SKU': string;
  'Variant Grams': string;
  'Variant Inventory Tracker': string;
  'Variant Inventory Qty': string;
  'Variant Inventory Policy': string;
  'Variant Fulfillment Service': string;
  'Variant Price': string;
  'Variant Compare At Price': string;
  'Variant Requires Shipping': string;
  'Variant Taxable': string;
  'Variant Barcode': string;
  'Image Src': string;
  'Image Position': string;
  'Image Alt Text': string;
  'Gift Card': string;
  'SEO Title': string;
  'SEO Description': string;
  'Google Shopping / Google Product Category': string;
  'Google Shopping / Gender': string;
  'Google Shopping / Age Group': string;
  'Google Shopping / MPN': string;
  'Google Shopping / AdWords Grouping': string;
  'Google Shopping / AdWords Labels': string;
  'Google Shopping / Condition': string;
  'Google Shopping / Custom Product': string;
  'Google Shopping / Custom Label 0': string;
  'Google Shopping / Custom Label 1': string;
  'Google Shopping / Custom Label 2': string;
  'Google Shopping / Custom Label 3': string;
  'Google Shopping / Custom Label 4': string;
  'Variant Image': string;
  'Variant Weight Unit': string;
  'Variant Tax Code': string;
  'Cost per item': string;
}

export interface MergedShopifyProduct
  extends Omit<ShopifyProduct, 'Image Src'> {
  'Image Src': { img: string; pos: string };
}

// These are fields that might hold some data that we either want to store as-is, or process it.
const FIELDS_MAPPING: any = {
  name: {
    key: 'Title',
  },
  description: {
    key: 'Body (HTML)',
    sanitizer: (val: string) => {
      if (!val) {
        return;
      }

      const withNewlines = val.replace(/<br>/, '\n');
      return sanitizeHtml(withNewlines, {
        allowedTags: [],
        allowedAttributes: {},
      });
    },
  },
  price: {
    key: 'Variant Price',
  },
  // 'Variant Grams',
  images: {
    key: 'Image Src',
  },
};

const normalizeDataFields = (products: any[]): LamkProduct[] => {
  return products.map(product => {
    return Object.keys(FIELDS_MAPPING).reduce((res: any, fieldKey) => {
      const mapping = FIELDS_MAPPING[fieldKey];
      if (mapping) {
        res[fieldKey] = mapping.sanitizer
          ? mapping.sanitizer(product[mapping.key])
          : product[mapping.key];
      }

      return res;
    }, {});
  });
};

const fetchRemoteImage = async (url: string) => {
  const blob = (await fetch(url).then(r => r.blob())) as Blob;
  return {
    blob,
    name: url,
  };
};

const normalizeImages = async (
  shopifyProduct: MergedShopifyProduct
): Promise<{ 'Image Src': LamkProduct['images'] }> => {
  // Originally images had position number, we replace this with the correct order in the array.
  const imageUrls = sortBy<any>(shopifyProduct['Image Src'], 'pos').map(
    x => x.img
  );
  const blobImages = await Promise.all(
    imageUrls.map(url => fetchRemoteImage(url))
  );

  return {
    'Image Src': blobImages,
  };
};

// Each variant can have a price, and then compare at price field. If the compare at price field exists, the price field is actually the discounted price of the product. We just want to keep the original price for now.
const normalizePrice = (
  shopifyProduct: MergedShopifyProduct
): { 'Variant Price': number } => {
  return {
    'Variant Price': toNumber(
      shopifyProduct['Variant Compare At Price']
        ? shopifyProduct['Variant Compare At Price']
        : shopifyProduct['Variant Price']
    ),
  };
};

// The CSV data has one row per image, together with an image position. We merge all images into a single array.
// resulting in multiple entries with the same data, after which we can just get the unique ones.
const normalizeShopifyProducts = async (shopifyProducts: ShopifyProduct[]) => {
  const merged = shopifyProducts.map(entry => {
    const others = shopifyProducts.filter(
      otherEntry => otherEntry.Handle === entry.Handle
    );

    const obj = {};
    mergeWith(obj, entry, ...others, mergeCustomizer);
    return obj as MergedShopifyProduct;
  });

  const unique = uniqBy<MergedShopifyProduct>(merged, 'Handle');

  return Promise.all(
    unique.map(async product => ({
      ...product,
      ...normalizePrice(product),
      ...(await normalizeImages(product)),
    }))
  );
};

export const execute = async (serviceData: any) => {
  const parsed = await csvtojson({ delimiter: [','] }).fromString(serviceData);

  const normalized = await normalizeShopifyProducts(parsed);
  const lamkProducts = normalizeDataFields(normalized);
  return lamkProducts;
};
