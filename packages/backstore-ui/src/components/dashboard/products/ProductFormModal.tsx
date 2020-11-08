import throttle from 'lodash/throttle';
import cloneDeep from 'lodash/cloneDeep';
import round from 'lodash/round';
import React, { useEffect } from 'react';
import {
  Button,
  Flex,
  message,
  Spin,
  Modal,
  hooks,
  Title,
  Switch,
  Text,
  NewForm,
} from '@sradevski/blocks-ui';
import { Product } from '@sradevski/la-sdk/dist/models/product';
import { sdk } from '@sradevski/la-sdk';
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
import { FindResult } from '@sradevski/la-sdk/dist/setup';
import { Category } from '@sradevski/la-sdk/dist/models/category';
import { useTranslation } from 'react-i18next';
import { useFullCategory } from '../../shared/hooks/useFullCategory';
import { useCategories } from '../../shared/hooks/useCategories';
import { ProductGroup } from '@sradevski/la-sdk/dist/models/productGroup';
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

enum DiscountInputMode {
  percentage,
  value,
}

interface ProductFormModalProps {
  product: Product | undefined;
  onClose: () => void;
  visible: boolean;
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

  return round(
    variantPrice === 0 ? 0 : ((value ?? 0) / (variantPrice ?? 1)) * 100,
    3,
  );
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

  return round(
    percentage > 100 ? variantPrice : (percentage * variantPrice) / 100,
    3,
  );
};

export const ProductFormModal = ({
  product,
  onClose,
  visible,
}: ProductFormModalProps) => {
  const { t } = useTranslation();
  // If the product has at least one attribute, it means it has variants.
  const hasAttributes = sdk.product.hasVariants(product);
  const [showVariants, setShowVariants] = React.useState(hasAttributes);
  const [caller, showSpinner] = hooks.useCall();
  const [groupsCaller, groupsLoading] = hooks.useCall();
  const groups: string[] = useSelector(getGroups);
  const store = useSelector(getStore);
  const storeId = store ? store._id : undefined;
  const [categories, groupedCategories] = useCategories(t);
  const [productFormData, setProductFormData] = hooks.useFormState<Product>(
    product,
    {
      soldBy: storeId,
      unit: sdk.product.ProductUnit.ITEM,
      images: [],
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

    caller<FindResult<Category>>(sdk.category.find(), categories =>
      setCategories(categories.data),
    );
  }, [caller, categories]);

  const fetchProductGroups = throttle(
    () => {
      groupsCaller<FindResult<ProductGroup>>(
        sdk.productGroup.findForStore(storeId),
        productGroups => setGroups(productGroups.data.map(x => x.groupName)),
      );
    },
    5000,
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
          message.success(
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
        message.success(t('product.addProductSuccess'));
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
        message.success(
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
        'images',
        'groups',
        'category',
        'description',
        'variants',
      ]),
    ) as any;
    // We have to force set the enum here so the form knows to render a multiselect field
    (modifiedSchema.properties!.groups as any).items!.enum = groups;

    // Set max items to 1 if the product doesn't have variants
    if (!showVariants) {
      modifiedSchema.properties!.variants.maxItems = 1;
    } else {
      modifiedSchema.properties!.variants.maxItems = (sdk.product.schema
        .properties!.variants as any).maxItems;
    }

    return modifiedSchema;
  }, [groups, showVariants]);

  return (
    <Modal
      width={'80%'}
      centered
      destroyOnClose
      visible={visible}
      footer={null}
      onCancel={onClose}
      title={product ? t('actions.update') : t('actions.add')}
    >
      <Spin
        spinning={showSpinner}
        tip={
          product
            ? t('product.updatingProductTip')
            : t('product.addingProductTip')
        }
      >
        {product && (
          <Flex justifyContent='flex-end'>
            <Button m={0} onClick={handleDeleteProduct} danger>
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
                    <Title m={0} level={3}>
                      {t('common.basic')}
                    </Title>
                  ),
                  properties: ['soldBy', 'name', 'category', 'images'],
                },
                {
                  sectionTitle: (
                    <Flex mt={3} mb={2} alignItems='center'>
                      <Title m={0} level={3}>
                        {t('product.variant_plural')}
                      </Title>
                      <Switch
                        ml={3}
                        checked={showVariants}
                        onChange={() => setShowVariants(!showVariants)}
                      />
                      <Text ml={2}>{t('product.productHasVariants')}</Text>
                    </Flex>
                  ),
                  properties: ['variants'],
                },
                {
                  sectionTitle: (
                    <Title mt={3} mb={2} level={3}>
                      {t('common.details')}
                    </Title>
                  ),
                  properties: ['unit', 'groups', 'description'],
                },
              ],
            },
            'ui:order': [
              'name',
              'category',
              'images',
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
                minWidth: ['calc(100% - 32px)', '50%', '50%'],
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
            images: {
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
                      type: 'color',
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
                    suffix: 'ден',
                  },
                  'ui:title': t(`common.price`),
                },
                discount: {
                  'ui:options': {
                    minWidth: ['100%', '50%', '50%'],
                    // TODO: This is quite hacky, find a better way to handle input modes.
                    numberInputModes: [
                      {
                        id: DiscountInputMode.percentage,
                        suffix: '%',
                        previewSuffix: 'ден',
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
                          return valueToPercentage(
                            productFormData as Product,
                            variantIndex,
                            val,
                          );
                        },
                        previewConverter: (val: number) => val ?? 0,
                        min: 0,
                        max: 100,
                      },
                      {
                        id: DiscountInputMode.value,
                        suffix: 'ден',
                        previewSuffix: '%',
                        baseConverter: (val: number) => val,
                        inputConverter: (val: number) => val,
                        previewConverter: (val: number, id: string) => {
                          const variantIndex = getVariantIndex(id);
                          return valueToPercentage(
                            productFormData as Product,
                            variantIndex,
                            val,
                          );
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
            groups: {
              'ui:options': {
                minWidth: ['200px', '50%', '50%'],
                mode: 'tags',
                loading: groupsLoading,
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
          <Flex mt={3} justifyContent='center'>
            <Button type='ghost' mr={2} onClick={onClose}>
              {t('actions.cancel')}
            </Button>
            <Button ml={2} htmlType='submit' type='primary'>
              {product ? t('actions.update') : t('actions.add')}
            </Button>
          </Flex>
        </NewForm>
      </Spin>
    </Modal>
  );
};
