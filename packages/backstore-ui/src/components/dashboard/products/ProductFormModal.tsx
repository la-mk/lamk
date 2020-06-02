import throttle from 'lodash/throttle';
import React, { useEffect, useState } from 'react';
import {
  Button,
  Flex,
  Col,
  Row,
  UploadDragger,
  message,
  UploadContent,
  Spin,
  Modal,
  Form,
  FormItem,
  formTextArea,
  formInput,
  parsers,
  Cascader,
  hooks,
  InputNumber,
  Select,
  Option,
} from '@sradevski/blocks-ui';
import { Product } from '@sradevski/la-sdk/dist/models/product';
import { sdk } from '@sradevski/la-sdk';
import {
  getImageUploader,
  handleArtifactUploadStatus,
  getDefaultFileList,
} from '../../shared/utils/artifacts';
import { useSelector } from 'react-redux';
import {
  addProduct,
  patchProduct,
  removeProduct,
} from '../../../state/modules/products/products.module';
import { getStore } from '../../../state/modules/store/store.selector';
import { setCategories } from '../../../state/modules/categories/categories.module';
import { FindResult } from '@sradevski/la-sdk/dist/setup';
import { Category } from '@sradevski/la-sdk/dist/models/category';
import { useTranslation } from 'react-i18next';
import { cascaderFilter } from '../../shared/utils/form';
import {
  useFullCategory,
  FullCategory,
} from '../../shared/hooks/useFullCategory';
import { useCategories } from '../../shared/hooks/useCategories';
import { ProductGroup } from '@sradevski/la-sdk/dist/models/productGroup';

interface ProductFormModalProps {
  product: Product | undefined;
  onClose: () => void;
  visible: boolean;
}

export const ProductFormModal = ({
  product,
  onClose,
  visible,
}: ProductFormModalProps) => {
  const { t } = useTranslation();
  const [caller, showSpinner] = hooks.useCall();
  const [groupsCaller, groupsLoading] = hooks.useCall();
  const [groups, setGroups] = useState<string[] | undefined>();
  const store = useSelector(getStore);
  const storeId = store ? store._id : undefined;
  const [categories, groupedCategories] = useCategories(t);
  const [fullCategory, setFullCategory] = useFullCategory(categories, product);
  const [externalState] = hooks.useFormState<Product>(
    product,
    {
      soldBy: storeId,
      unit: sdk.product.ProductUnit.ITEM,
      images: [],
      groups: [],
    },
    [product, storeId],
  );

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

  const handlePatchProduct = (product: Product) => {
    caller<Product>(sdk.product.patch(product._id, product), product => {
      message.success(
        t('product.updateProductSuccess', { productName: product.name }),
      );
      onClose();
      return patchProduct(product);
    });
  };

  const handleCreateProduct = (newProduct: Product) => {
    if (store) {
      caller<Product>(sdk.product.create(newProduct), product => {
        message.success(t('product.addProductSuccess'));
        onClose();
        return addProduct(product);
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
          <Flex mb={3} justifyContent='flex-end'>
            <Button onClick={handleDeleteProduct} danger>
              {t('actions.delete')}
            </Button>
          </Flex>
        )}

        <Form
          colon={false}
          externalState={externalState}
          validate={data => sdk.product.validate(data, Boolean(product))}
          validateSingle={sdk.product.validateSingle}
          getErrorMessage={(errorName, context) =>
            t(`errors.${errorName}`, context)
          }
          onFormCompleted={product ? handlePatchProduct : handleCreateProduct}
          layout='vertical'
        >
          <Row gutter={24}>
            <Col md={12} span={24}>
              <FormItem label={t('common.name')} selector='name'>
                {formInput({ placeholder: t('product.nameExample') })}
              </FormItem>
            </Col>

            <Col md={12} span={24}>
              <FormItem label={t('common.category')} selector='category'>
                {(_val, _onChange, onComplete) => (
                  <Cascader
                    options={groupedCategories || []}
                    onChange={value => {
                      // The cascader expects a full array of all categories, but we want to store only the last value (as the slugs should all be unique.)
                      setFullCategory(value as FullCategory);
                      onComplete(value[value.length - 1]);
                    }}
                    placeholder={`${t('common.polite')} ${t('actions.select')}`}
                    showSearch={{ filter: cascaderFilter }}
                    value={fullCategory}
                  />
                )}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col md={8} span={24}>
              <FormItem
                label={t('common.price')}
                selector='price'
                parser={parsers.number}
              >
                {(
                  val: any,
                  onChange: (val: any) => void,
                  onComplete: (val: any) => void,
                ) => {
                  return (
                    <InputNumber
                      placeholder={t('product.priceExample')}
                      formatter={value => {
                        return value ? `${value} ден` : '';
                      }}
                      parser={value => (value || '').replace(/[^0-9.]/g, '')}
                      width='100%'
                      min={0}
                      max={99999999}
                      decimalSeparator='.'
                      value={val}
                      onChange={onChange}
                      onBlur={() => onComplete(val)}
                    />
                  );
                }}
              </FormItem>
            </Col>
            <Col md={8} span={24}>
              <FormItem
                label={t('product.discount')}
                selector='discount'
                parser={parsers.number}
              >
                {(
                  val: any,
                  onChange: (val: any) => void,
                  onComplete: (val: any) => void,
                ) => {
                  return (
                    <InputNumber
                      formatter={value => {
                        return value ? `${value} ден` : '';
                      }}
                      parser={value => (value || '').replace(/[^0-9.]/g, '')}
                      width='100%'
                      min={0}
                      max={99999999}
                      decimalSeparator='.'
                      value={val}
                      onChange={onChange}
                      onBlur={() => onComplete(val)}
                    />
                  );
                }}
              </FormItem>
            </Col>
            <Col md={8} span={24}>
              <FormItem label={t('product.unit')} selector='unit'>
                {(val, _onChange, onComplete) => (
                  <Select value={val} onChange={onComplete}>
                    {Object.values(sdk.product.ProductUnit).map(option => {
                      return (
                        <Option key={option} value={option}>
                          {t(`units.${option}`)}
                        </Option>
                      );
                    })}
                  </Select>
                )}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col md={12} span={24}>
              <FormItem
                help={t('product.stockTip')}
                label={t('product.stock')}
                selector='stock'
                parser={parsers.integer}
              >
                {(
                  val: any,
                  onChange: (val: any) => void,
                  onComplete: (val: any) => void,
                ) => {
                  return (
                    <InputNumber
                      width='100%'
                      min={0}
                      max={999999}
                      value={val}
                      onChange={onChange}
                      onBlur={() => onComplete(val)}
                      placeholder={t('product.stockExample')}
                    />
                  );
                }}
              </FormItem>
            </Col>
            <Col md={12} span={24}>
              <FormItem label={t('product.sku')} selector='sku'>
                {formInput({
                  placeholder: t('product.skuExample'),
                })}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col md={24} span={24}>
              <FormItem
                help={t('product.groupsTip')}
                label={t('product.groups')}
                selector='groups'
              >
                {(val, _onChange, onComplete) => (
                  <Select
                    mode='tags'
                    value={val}
                    onChange={onComplete}
                    onFocus={fetchProductGroups}
                    tokenSeparators={[',']}
                    maxTagTextLength={127}
                    notFoundContent={
                      groupsLoading ? <Spin size='small' /> : null
                    }
                  >
                    {groups && !groupsLoading
                      ? groups
                          .filter(x => !val || !val.includes(x))
                          .map(option => {
                            return (
                              <Option key={option} value={option}>
                                {option}
                              </Option>
                            );
                          })
                      : null}
                  </Select>
                )}
              </FormItem>
            </Col>
          </Row>
          <FormItem selector='images'>
            {(val, _onChange, onComplete) => (
              <UploadDragger
                multiple
                listType='picture-card'
                customRequest={getImageUploader()}
                accept='.png, .jpg, .jpeg'
                onChange={info =>
                  handleArtifactUploadStatus(
                    info,
                    val,
                    false,
                    onComplete,
                    message.error,
                  )
                }
                defaultFileList={getDefaultFileList(
                  product ? product.images : [],
                  storeId,
                )}
                name='product-images'
              >
                <UploadContent
                  text={t('actions.addProductImages')}
                  hint={t('uploads.hint')}
                />
              </UploadDragger>
            )}
          </FormItem>

          <FormItem label={t('common.description')} selector='description'>
            {formTextArea({
              placeholder: `${t('product.descriptionExample')} (${t(
                'common.optional',
              )})`,
              rows: 3,
            })}
          </FormItem>
          <Flex mt={3} justifyContent='center'>
            <Button type='ghost' mr={2} onClick={onClose}>
              {t('actions.cancel')}
            </Button>
            <Button ml={2} htmlType='submit' type='primary'>
              {product ? t('actions.update') : t('actions.add')}
            </Button>
          </Flex>
        </Form>
      </Spin>
    </Modal>
  );
};
