import React, { useState, useEffect, useCallback } from "react";
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
  Cascader
} from "@lamk/blocks-ui";
import { Product } from "@lamk/la-sdk/dist/models/product";
import { sdk } from "@lamk/la-sdk";
import {
  uploadImage,
  handleArtifactUploadStatus,
  getDefaultFileList
} from "../../shared/utils/artifacts";
import { useSelector } from "react-redux";
import {
  addProduct,
  patchProduct
} from "../../../state/modules/products/products.module";
import { getStore } from "../../../state/modules/store/store.selector";
import { useCall } from "../../shared/hooks/useCall";
import { setCategories } from "../../../state/modules/categories/categories.module";
import { FindResult } from "@lamk/la-sdk/dist/setup";
import { Category } from "@lamk/la-sdk/dist/models/category";
import {
  getCategories,
  createGetGroupedCategories
} from "../../../state/modules/categories/categories.selector";
import { useTranslation } from "react-i18next";

interface ProductFormModalProps {
  product: Product | null;
  onClose: () => void;
  visible: boolean;
}

function filter(inputValue: string, path: any[]) {
  return path.some(
    option => option.label.toLowerCase().indexOf(inputValue.toLowerCase()) > -1
  );
}

export const ProductFormModal = ({
  product,
  onClose,
  visible
}: ProductFormModalProps) => {
  const [caller, showSpinner] = useCall();
  const [fullCategoryValue, setFullCategoryValue] = useState<string[]>([]);
  const store = useSelector(getStore);
  const categories: Category[] = useSelector(getCategories);
  const { t } = useTranslation();
  
  const getGroupedCategories = useCallback(() => {
    return createGetGroupedCategories((categoryKey: string) =>
      t(`categories.${categoryKey}`)
    );
  }, [t])();

  const groupedCategories = useSelector(getGroupedCategories);

  useEffect(() => {
    if (!categories || !product) {
      return;
    }
    const categorySet = categories.find(
      category => category.level3 === product.category
    );
    if (!categorySet) {
      return;
    }

    setFullCategoryValue([
      categorySet.level1,
      categorySet.level2,
      categorySet.level3
    ]);
  }, [product, categories]);

  useEffect(() => {
    if (categories) {
      return;
    }

    caller(sdk.category.find(), (categories: FindResult<Category>) =>
      setCategories(categories.data)
    );
  }, [caller, categories]);

  const handlePatchProduct = (product: Product) => {
    caller(sdk.product.patch(product._id, product), (product: Product) => {
      message.success(
        t("product.updateProductSuccess", { productName: product.name })
      );
      return patchProduct(product);
    });
  };

  const handleCreateProduct = (newProduct: Product) => {
    if (store) {
      caller(
        sdk.product.create({ ...newProduct, soldBy: store._id }),
        (product: Product) => {
          message.success(t("product.addProductSuccess"));
          onClose();
          return addProduct(product);
        }
      );
    }
  };

  return (
    <Modal
      width={"80%"}
      centered
      destroyOnClose
      visible={visible}
      footer={null}
      onCancel={onClose}
      title={product ? t("actions.update") : t("actions.add")}
    >
      <Spin
        spinning={showSpinner}
        tip={
          product
            ? t("product.updatingProductTip")
            : t("product.addingProductTip")
        }
      >
        <Form
          colon={false}
          externalState={product}
          validate={(data) => sdk.product.validate(data, Boolean(product))}
          validateSingle={sdk.product.validateSingle}
          getErrorMessage={(errorName, context) => t(`errors.${errorName}`, context)}
          onFormCompleted={product ? handlePatchProduct : handleCreateProduct}
          layout="horizontal"
        >
          <Row gutter={24}>
            <Col md={8} span={24}>
              <FormItem label={t("common.name")} selector="name">
                {formInput({ placeholder: t("product.nameExample") })}
              </FormItem>
            </Col>

            <Col md={8} span={24}>
              <FormItem label={t("common.category")} selector="category">
                {(val, _onChange, onComplete) => (
                  <Cascader
                    options={groupedCategories}
                    onChange={value => {
                      // The cascader expects a full array of all categories, but we want to store only the last value (as the slugs should all be unique.)
                      setFullCategoryValue(value);
                      onComplete(value[value.length - 1]);
                    }}
                    placeholder={`${t("common.polite")} ${t("actions.select")}`}
                    showSearch={{ filter }}
                    value={fullCategoryValue}
                  />
                )}
              </FormItem>
            </Col>
            <Col md={8} span={24}>
              <FormItem label={t("common.price")} selector="price">
                {formInput({
                  placeholder: t("product.priceExample"),
                  addonBefore: "Ден",
                  type: 'number'
                })}
              </FormItem>
            </Col>
          </Row>

          <FormItem selector="images">
            {(val, _onChange, onComplete) => (
              <UploadDragger
                multiple
                listType="picture-card"
                customRequest={uploadImage}
                accept=".png, .jpg, .jpeg"
                onChange={info =>
                  handleArtifactUploadStatus(
                    info,
                    val,
                    false,
                    onComplete,
                    message.error
                  )
                }
                defaultFileList={getDefaultFileList(
                  product ? product.images : undefined
                )}
                name="product-images"
              >
                <UploadContent
                  text={t("actions.addProductImages")}
                  hint={t("uploads.hint")}
                />
              </UploadDragger>
            )}
          </FormItem>

          <FormItem label={t("common.description")} selector="description">
            {formTextArea({
              placeholder: `${t("product.descriptionExample")} (${t(
                "common.optional"
              )})`,
              rows: 3
            })}
          </FormItem>
          <Flex mt={3} justifyContent="center">
            <Button type="ghost" mr={2} onClick={onClose}>
              {t("actions.cancel")}
            </Button>
            <Button ml={2} htmlType="submit" type="primary">
              {product ? t("actions.update") : t("actions.add")}
            </Button>
          </Flex>
        </Form>
      </Spin>
    </Modal>
  );
};
