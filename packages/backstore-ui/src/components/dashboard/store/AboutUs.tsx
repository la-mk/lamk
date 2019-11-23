import React, { useEffect } from "react";
import {
  Flex,
  Button,
  Spin,
  Form,
  FormItem,
  formTextArea
} from "@lamk/blocks-ui";
import { useTranslation } from "react-i18next";
import { useCall } from "../../shared/hooks/useCall";
import { sdk } from "@lamk/la-sdk";

export const AboutUs = () => {
  // const {caller, showSpinner} = useCall();
  const showSpinner = false;
  const {t} = useTranslation();

  useEffect(() => {
    // caller(sdk.storeContents.get())
  }, []);

  return (
    <Flex mt={3} flexDirection="column">
      <Spin spinning={showSpinner} tip={"Updating about us..."}>
        <Form
          colon={false}
          externalState={{}}
          validate={() => null}
          validateSingle={() => null}
          onFormCompleted={() => null}
          layout="horizontal"
        >
          <FormItem label={"About us"} selector="description">
            {formTextArea({
              placeholder: `Win your customer's hearts`,
              autoSize: { minRows: 8, maxRows: 16 }
            })}
          </FormItem>
          <Flex mt={3} justifyContent="center">
            <Button ml={2} htmlType="submit" type="primary">
              Save changes
            </Button>
          </Flex>
        </Form>
      </Spin>
    </Flex>
  );
};
