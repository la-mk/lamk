import React, { useState, useEffect } from "react";
import {
  Card,
  UploadDragger,
  Cascader,
  UploadContent,
  Form,
  FormItem,
  Button,
  message,
  formInput,
  formTextArea,
  parsers
} from "@lamk/blocks-ui";
import { Product } from "@lamk/la-sdk/dist/models/product";
import { sdk } from "@lamk/la-sdk";
import { UploadChangeParam } from "antd/es/upload";
import {
  uploadImage,
  handleArtifactUploadStatus,
  getDefaultFileList
} from "../shared/utils/artifacts";
import { Category } from "@lamk/la-sdk/dist/models/category";
import { GroupedCategories } from "../../state/modules/categories/categories.selector";
import { useTranslation } from "react-i18next";
import { Store } from "@lamk/la-sdk/dist/models/store";

interface AddProductCardProps {
  storeId: Store['_id'] | undefined;
  product?: Product;
  categories: Category[] | null;
  groupedCategories: GroupedCategories | null;
  onAddProduct: (product: Product) => void;
  onPatchProduct: (product: Product) => void;
  onRemoveProduct: (id: string) => void;
}

function filter(inputValue: string, path: any[]) {
  return path.some(
    option => option.label.toLowerCase().indexOf(inputValue.toLowerCase()) > -1
  );
}

export const AddProductCard = ({
  storeId,
  product,
  categories,
  groupedCategories,
  onAddProduct,
  onPatchProduct,
  onRemoveProduct
}: AddProductCardProps) => {
  const [fullCategoryValue, setFullCategoryValue] = useState<string[]>([]);
  const [externalState, setExternalState] = useState<Partial<Product> | undefined>(product);
  const { t } = useTranslation();

  useEffect(() => {
    if(!product){
      setExternalState({soldBy: storeId});
    }
    else {
      setExternalState(product);
    }
  }, [product, storeId])

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

  return (
    <Form
      colon={false}
      validate={(data) => sdk.product.validate(data, Boolean(product))}
      validateSingle={sdk.product.validateSingle}
      getErrorMessage={(errorName, context) => t(`errors.${errorName}`, context)}
      externalState={externalState}
      onFormCompleted={product ? onPatchProduct : onAddProduct}
    >
      <Card
        title={
          <FormItem mb={0} selector="name">
            {formInput({ placeholder: t("common.name") })}
          </FormItem>
        }
        extra={
          <FormItem ml={3} mb={0} width="130px" selector="price" parser={parsers.number}>
            {formInput({ placeholder: t("common.price"), addonBefore: "Ден" })}
          </FormItem>
        }
        width={390}
        actions={[
          <Button type="link" icon="more">
            {t("common.more")}
          </Button>,
          ...(product
            ? [
                <Button
                  onClick={() => onRemoveProduct(product._id)}
                  type="link"
                  icon="delete"
                >
                  {t("actions.delete")}
                </Button>
              ]
            : []),

          <Button htmlType="submit" type="link" icon="check">
            {product ? t("actions.update") : t("actions.add")}
          </Button>
        ]}
      >
        <FormItem selector="category">
          {(_val, _onChange, onComplete) => (
            <Cascader
              options={groupedCategories!}
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

        <FormItem selector="images">
          {(val, _onChange, onComplete) => (
            <UploadDragger
              multiple
              listType="picture-card"
              customRequest={uploadImage}
              accept=".png, .jpg, .jpeg"
              onChange={(info: UploadChangeParam) =>
                handleArtifactUploadStatus(
                  info,
                  val,
                  false,
                  onComplete,
                  message.error
                )
              }
              defaultFileList={getDefaultFileList(
                product ? product.images : []
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

        <FormItem mb={0} mt={3} selector="description">
          {formTextArea({
            placeholder: `${t("common.description")} (${t("common.optional")})`,
            rows: 3
          })}
        </FormItem>
      </Card>
    </Form>
  );
};
