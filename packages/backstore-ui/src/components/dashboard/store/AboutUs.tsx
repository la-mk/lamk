import React, { useEffect, useState } from 'react';
import {
  Flex,
  Button,
  Spin,
  Form,
  FormItem,
  formTextArea,
  message,
} from '@sradevski/blocks-ui';
import { useTranslation } from 'react-i18next';
import { useCall } from '../../shared/hooks/useCall';
import { sdk } from '@sradevski/la-sdk';
import { useSelector } from 'react-redux';
import { getStore } from '../../../state/modules/store/store.selector';
import { StoreContents } from '@sradevski/la-sdk/dist/models/storeContents';
import { FindResult } from '@sradevski/la-sdk/dist/setup';

export const AboutUs = () => {
  const { t } = useTranslation();
  const [caller, showSpinner] = useCall();
  const store = useSelector(getStore);
  const [storeContents, setStoreContents] = useState<StoreContents>();

  useEffect(() => {
    if (!store) {
      return;
    }

    caller<FindResult<StoreContents>>(
      sdk.storeContents.findForStore(store._id),
      res => (res.total > 0 ? setStoreContents(res.data[0]) : undefined),
    );
  }, [store]);

  const handlePatchAboutUs = (data: Partial<StoreContents>) => {
    if (!storeContents) {
      return;
    }

    caller<StoreContents>(
      sdk.storeContents
        .patch(storeContents._id, { aboutUs: data.aboutUs })
        .then(() => message.success(t('common.success'))),
    );
  };

  return (
    <Flex mt={3} flexDirection='column'>
      <Spin spinning={showSpinner}>
        <Form
          colon={false}
          externalState={storeContents}
          getErrorMessage={(errorName, context) =>
            t(`errors.${errorName}`, context)
          }
          validate={data => sdk.storeContents.validate(data, true)}
          // TODO: Add single validation when the validation library can handle nested schemas/selectors.
          onFormCompleted={handlePatchAboutUs}
          layout='horizontal'
        >
          <FormItem label={t('store.aboutUs')} selector='aboutUs.description'>
            {formTextArea({
              placeholder: t('store.aboutUsExample'),
              autoSize: { minRows: 8, maxRows: 16 },
            })}
          </FormItem>
          <Flex mt={3} justifyContent='center'>
            <Button ml={2} htmlType='submit' type='primary'>
              {t('actions.update')}
            </Button>
          </Flex>
        </Form>
      </Spin>
    </Flex>
  );
};
