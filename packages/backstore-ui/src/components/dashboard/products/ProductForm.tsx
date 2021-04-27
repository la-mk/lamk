import throttle from 'lodash/throttle';
import cloneDeep from 'lodash/cloneDeep';
import round from 'lodash/round';
import React, { useEffect } from 'react';
import {
  Button,
  Flex,
  toast,
  Spinner,
  hooks,
  Heading,
  Switch,
  NewForm,
} from '@la-mk/blocks-ui';

import { Product } from '@la-mk/la-sdk/dist/models/product';
import { sdk } from '@la-mk/la-sdk';
import { getImageUploader } from '../../shared/utils/artifacts';
import { useSelector } from 'react-redux';
import {
  addProduct,
  patchProduct,
  removeProduct,
  setGroups,
} from '../../../state/modules/products/products.module';
import { getStore } from '../../../state/modules/store/store.selector';
import { setCategories } from '../../../state/modules/categories/categories.module';
import { FindResult } from '@la-mk/la-sdk/dist/setup';
import { Category } from '@la-mk/la-sdk/dist/models/category';
import { useTranslation } from 'react-i18next';
import { useFullCategory } from '../../shared/hooks/useFullCategory';
import { useCategories } from '../../shared/hooks/useCategories';
import { ProductGroup } from '@la-mk/la-sdk/dist/models/productGroup';
import { getGroups } from '../../../state/modules/products/products.selector';
import { VariantName } from '../../shared/components/VariantName';

const COLORS = [
  '#FF0000',
  '#800000',
  '#0000FF',
  '#FFFF00',
  '#FFD700',
  '#FFA500',
  '#008000',
  '#800080',
  '#000080',
  '#654321',
  '#FFC0CB',
  '#FFFFFF',
  '#000000',
  '#C0C0C0',
  '#808080',
];

interface ProductFormProps {
  product: Product | undefined;
  onClose: () => void;
}

const getVariantIndex = (id: string) => {
  const parts = id.split('_');
  const variantIndex = parts.findIndex(x => x === 'variants') + 1;
  return parseInt(parts[variantIndex]);
};

const valueToPercentage = (
  product: Product | undefined,
  variantIndex: number,
  value: number,
) => {
  const variantPrice = product?.variants?.[variantIndex]?.price;
  if (!variantPrice) {
    return 0;
  }

  return variantPrice === 0 ? 0 : ((value ?? 0) / (variantPrice ?? 1)) * 100;
};

const percentageToValue = (
  product: Product | undefined,
  variantIndex: number,
  percentage: number,
) => {
  const variantPrice = product?.variants?.[variantIndex]?.price;
  if (!variantPrice) {
    return 0;
  }

  return percentage > 100 ? variantPrice : (percentage * variantPrice) / 100;
};

export const ProductForm = ({ product, onClose }: ProductFormProps) => {
  const { t } = useTranslation();
  // If the product has at least one attribute, it means it has variants.
  const hasAttributes = sdk.product.hasVariants(product);
  const [showVariants, setShowVariants] = React.useState(hasAttributes);
  const [caller, productLoading] = hooks.useCall();
  const [groupsCaller, groupsLoading] = hooks.useCall();
  const [categoriesCaller, categoriesLoading] = hooks.useCall();
  const groups: string[] = useSelector(getGroups);
  const store = useSelector(getStore);
  const storeId = store ? store._id : undefined;
  const [categories, groupedCategories] = useCategories(t);
  const [productFormData, setProductFormData] = hooks.useFormState<Product>(
    product,
    {
      soldBy: storeId,
      unit: sdk.product.ProductUnit.ITEM,
      media: [],
      groups: [],
      variants: [{ price: 0 }],
    },
    [product, storeId],
  );

  const [fullCategory, setFullCategory] = useFullCategory(
    categories,
    (productFormData as Product)?.category,
  );

  useEffect(() => {
    setShowVariants(Boolean(hasAttributes));
  }, [hasAttributes]);

  useEffect(() => {
    if (categories) {
      return;
    }

    categoriesCaller<FindResult<Category>>(sdk.category.find(), categories =>
      setCategories(categories.data),
    );
  }, [categoriesCaller, categories]);

  const fetchProductGroups = throttle(
    () => {
      groupsCaller<FindResult<ProductGroup>>(
        sdk.productGroup.findForStore(storeId),
        productGroups => setGroups(productGroups.data.map(x => x.groupName)),
      );
    },
    30000,
    { leading: true, trailing: false },
  );

  const handleProductFormCompleted = ({ formData }: { formData: Product }) => {
    // It is possible that all attributes are falsy (eg. one is set to null) but they still exist, so we want to remove them.
    // This mutates the form data but it doesn't matter here.
    formData.variants.forEach(variant => {
      const hasNonNullAttributes =
        Object.values(variant.attributes ?? {}).filter(x => !!x).length > 0;

      if (!hasNonNullAttributes) {
        variant.attributes = {};
      }
    });

    if (product?._id) {
      caller<Product>(
        sdk.product.patch(product._id, formData),
        updatedProduct => {
          toast.success(
            t('product.updateProductSuccess', {
              productName: updatedProduct.name,
            }),
          );
          onClose();
          return patchProduct(updatedProduct);
        },
      );
    } else {
      caller<Product>(sdk.product.create(formData), newProduct => {
        toast.success(t('product.addProductSuccess'));
        setFullCategory([] as any);
        onClose();
        return addProduct(newProduct);
      });
    }
  };

  const handleDeleteProduct = () => {
    if (product && product._id) {
      caller<Product>(sdk.product.remove(product._id), () => {
        onClose();
        toast.success(
          t('product.productDeleted', {
            id: sdk.utils.getShortId(product._id),
          }),
        );
        return removeProduct(product._id);
      });
    }
  };

  const schemaWithEnum = React.useMemo(() => {
    const modifiedSchema = cloneDeep(
      sdk.utils.schema.pick(sdk.product.schema, [
        'soldBy',
        'name',
        'unit',
        'media',
        'groups',
        'category',
        'description',
        'variants',
      ]),
    ) as any;
    // Set max items to 1 if the product doesn't have variants
    if (!showVariants) {
      modifiedSchema.properties!.variants.maxItems = 1;
    } else {
      modifiedSchema.properties!.variants.maxItems = (sdk.product.schema
        .properties!.variants as any).maxItems;
    }

    modifiedSchema.properties!.groups.items.examples = groups;

    return modifiedSchema;
  }, [showVariants, groups]);

  return (
    <>
      <Spinner
        isLoaded={!productLoading || categoriesLoading}
        label={
          categoriesLoading
            ? undefined
            : product
            ? t('product.updatingProductTip')
            : t('product.addingProductTip')
        }
      >
        {product && (
          <Flex justify='flex-end'>
            <Button
              m={0}
              size='sm'
              variant='outline'
              onClick={handleDeleteProduct}
              isDanger
            >
              {t('actions.delete')}
            </Button>
          </Flex>
        )}

        <NewForm
          imageUpload={{
            getImageUrl: imageId =>
              sdk.artifact.getUrlForImage(imageId, store?._id ?? '', {
                h: 80,
              }) ?? '',
            uploadImage: getImageUploader({
              maxHeight: 1600,
              maxWidth: 1600,
            }),
            removeImage: imageId => sdk.artifact.remove(imageId as any) as any,
          }}
          schema={schemaWithEnum}
          uiSchema={{
            'ui:options': {
              // FUTURE: Maybe we can make section titles serializible somehow, not that important for now though.
              sections: [
                {
                  sectionTitle: (
                    <Heading m={0} as='h3'>
                      {t('common.basic')}
                    </Heading>
                  ),
                  properties: ['soldBy', 'name', 'category', 'media'],
                },
                {
                  sectionTitle: (
                    <Flex mt={3} mb={2} align='center'>
                      <Heading m={0} as='h3'>
                        {t('product.variant_plural')}
                      </Heading>
                      <Switch
                        ml={3}
                        isChecked={showVariants}
                        onChange={() => setShowVariants(!showVariants)}
                      >
                        {t('product.productHasVariants')}
                      </Switch>
                    </Flex>
                  ),
                  properties: ['variants'],
                },
                {
                  sectionTitle: (
                    <Heading mt={1} mb={2} as='h3'>
                      {t('common.details')}
                    </Heading>
                  ),
                  properties: ['unit', 'groups', 'description'],
                },
              ],
            },
            'ui:order': [
              'name',
              'category',
              'media',
              'variants',
              'unit',
              'groups',
              'description',
              '*',
            ],
            soldBy: {
              'ui:widget': 'hidden',
            },
            name: {
              'ui:title': t('common.name'),
              'ui:placeholder': t('product.nameExample'),
              'ui:options': {
                minWidth: ['calc(100% - 2rem)', '50%', '50%'],
              },
            },
            category: {
              'ui:widget': 'cascader',
              'ui:options': {
                minWidth: ['100%', '50%', '50%'],
                cascadeOptions: groupedCategories ?? [],
                fullValue: fullCategory,
              },
              'ui:title': t('common.category'),
              'ui:help': t('product.categoryTip'),
              'ui:placeholder': `${t('common.polite')} ${t('actions.select')}`,
            },
            media: {
              'ui:widget': 'files',
              // TODO: Handle files title better
              'ui:title': ' ',
            },
            variants: {
              'ui:title': t('sets.sets'),
              'ui:widget': 'tabs',
              'ui:options': {
                itemTitles: (productFormData as Product)?.variants?.map(
                  variant => (
                    <VariantName
                      t={t}
                      attributes={variant.attributes}
                      shouldShowAttributes={showVariants}
                    />
                  ),
                ),
              },
              items: {
                'ui:order': [
                  'attributes',
                  'price',
                  'discount',
                  'stock',
                  'sku',
                  '*',
                ],
                attributes: {
                  'ui:options': {
                    mb: 3,
                  },
                  color: {
                    'ui:title': t('attributes.color'),
                    'ui:widget': showVariants ? 'pickerBoxes' : 'hidden',
                    'ui:options': {
                      minWidth: ['100%', '50%', '50%'],
                      values: COLORS,
                      variant: 'color',
                      size: 'sm',
                    },
                  },
                  size: {
                    'ui:options': {
                      minWidth: '100px',
                    },
                    'ui:widget': showVariants ? undefined : 'hidden',
                    'ui:title': t('attributes.size'),
                  },
                },
                price: {
                  'ui:options': {
                    minWidth: ['100%', '50%', '50%'],
                    prefix: t(
                      `currencies.${store.preferences.currency ?? 'mkd'}`,
                    ),
                  },
                  'ui:title': t(`common.price`),
                },
                discount: {
                  'ui:options': {
                    minWidth: ['100%', '50%', '50%'],
                    // TODO: This is quite hacky, find a better way to handle input modes.
                    // TODO: Since we reference formData here, and this is only recreated when the input is `discount`, if you change the price, and then you change the discount there will be a jump in the value since it does the calculations on the old price.
                    numberInputModes: [
                      {
                        id: 'percentage',
                        suffix: '%',
                        previewSuffix: t(
                          `currencies.${store.preferences.currency ?? 'mkd'}`,
                        ),
                        baseConverter: (percentage: number, id: string) => {
                          const variantIndex = getVariantIndex(id);
                          return percentageToValue(
                            productFormData as Product,
                            variantIndex,
                            percentage,
                          );
                        },
                        inputConverter: (val: number, id: string) => {
                          const variantIndex = getVariantIndex(id);
                          return round(
                            valueToPercentage(
                              productFormData as Product,
                              variantIndex,
                              val,
                            ),
                            3,
                          );
                        },
                        previewConverter: (val: number) =>
                          (val ?? 0).toFixed(2),
                        min: 0,
                        max: 100,
                      },
                      {
                        id: 'value',
                        suffix: t(
                          `currencies.${store.preferences.currency ?? 'mkd'}`,
                        ),
                        previewSuffix: '%',
                        // TODO: Set to price if discount is > 100%
                        baseConverter: (val: number) => val,
                        inputConverter: (val: number) => val,
                        previewConverter: (val: number, id: string) => {
                          const variantIndex = getVariantIndex(id);
                          return valueToPercentage(
                            productFormData as Product,
                            variantIndex,
                            val,
                          ).toFixed(2);
                        },
                      },
                    ],
                  },
                  'ui:title': t(`product.discount`),
                },
                stock: {
                  'ui:options': {
                    minWidth: ['100%', '50%', '50%'],
                  },
                  'ui:title': t(`product.stock`),
                  'ui:help': t('product.stockTip'),
                },
                sku: {
                  'ui:options': {
                    minWidth: ['100%', '50%', '50%'],
                  },
                  'ui:title': t(`product.sku`),
                  'ui:placeholder': t('product.skuExample'),
                },
                calculatedPrice: {
                  'ui:widget': 'hidden',
                },
              },
            },
            unit: {
              'ui:widget': 'select',
              'ui:title': t('product.unit'),
              'ui:options': {
                minWidth: '150px',
                maxWidth: '300px',
                customEnumOptions: Object.values(sdk.product.ProductUnit).map(
                  unit => ({
                    value: unit,
                    label: t(`units.${unit}`),
                  }),
                ),
              },
            },
            // TODO: This will render as an array, fix once https://github.com/rjsf-team/react-jsonschema-form/pull/2125 is merged.

            groups: {
              'ui:widget': 'select',
              'ui:options': {
                minWidth: ['200px', '50%', '50%'],
                mode: 'tags',
                loading: groupsLoading,
                customEnumOptions: (groups ?? []).map(group => ({
                  value: group,
                  label: group,
                })),
              },
              'ui:title': t('product.groups'),
              'ui:help': t('product.groupsTip'),
            },
            description: {
              'ui:widget': 'textarea',
              'ui:title': t('common.description'),
              'ui:placeholder': `${t('product.descriptionExample')} (${t(
                'common.optional',
              )})`,
              'ui:options': {
                rows: 3,
              },
            },
          }}
          onFocus={(id, val) => {
            if (id?.includes('groups')) {
              fetchProductGroups();
            }
          }}
          onSubmit={handleProductFormCompleted}
          onChange={({ formData }) => setProductFormData(formData)}
          formData={productFormData as Product}
          getErrorMessage={(errorName, context) =>
            t(`errors.${errorName}`, context)
          }
        >
          <Flex mt={3} justify='center'>
            <Button variant='outline' mr={2} onClick={onClose}>
              {t('actions.cancel')}
            </Button>
            <Button ml={2} type='submit'>
              {product ? t('actions.update') : t('actions.add')}
            </Button>
          </Flex>
        </NewForm>
      </Spinner>
    </>
  );
};
