import React, { useEffect, useState } from 'react';
import {
  Flex,
  Button,
  Spin,
  Form,
  FormItem,
  UploadContent,
  UploadDragger,
  message,
} from '@sradevski/blocks-ui';
import { useTranslation } from 'react-i18next';
import { useCall } from '../../shared/hooks/useCall';
import { sdk } from '@sradevski/la-sdk';
import { useSelector } from 'react-redux';
import { getStore } from '../../../state/modules/store/store.selector';
import { StoreContents } from '@sradevski/la-sdk/dist/models/storeContents';
import { FindResult } from '@sradevski/la-sdk/dist/setup';
import {
  handleArtifactUploadStatus,
  getDefaultFileList,
  uploadImage,
} from '../../shared/utils/artifacts';
import { UploadChangeParam } from 'antd/lib/upload';

export const LandingPreferences = () => {
  const { t } = useTranslation();
  const [caller, showSpinner] = useCall();
  const store = useSelector(getStore);
  const [storeContents, setStoreContents] = useState<StoreContents>();
  // TODO: We need ot make uploading work better with `fileList` instead of `defaultFilelist`, without keeping local state everywhere.
  const [fileList, setFileList] = useState();

  useEffect(() => {
    if (storeContents && storeContents.landing) {
      setFileList(getDefaultFileList(storeContents.landing.banner));
    }
  }, [storeContents]);

  useEffect(() => {
    if (!store) {
      return;
    }

    caller<FindResult<StoreContents>>(
      sdk.storeContents.findForStore(store._id),
      res => (res.total > 0 ? setStoreContents(res.data[0]) : undefined),
    );
  }, [store]);

  const handlePatchBanner = (data: Partial<StoreContents>) => {
    if (!storeContents) {
      return;
    }

    caller<StoreContents>(
      sdk.storeContents
        .patch(storeContents._id, { landing: data.landing })
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
          onFormCompleted={handlePatchBanner}
          layout='horizontal'
        >
          <FormItem selector='landing.banner' label={t('store.storeBanner')}>
            {(val, _onChange, onComplete) => (
              <UploadDragger
                customRequest={uploadImage}
                accept='.png, .jpg, .jpeg'
                onChange={(info: UploadChangeParam) => {
                  setFileList([...(info.fileList || [])]);
                  handleArtifactUploadStatus(
                    info,
                    val,
                    true,
                    onComplete,
                    message.error,
                  );
                }}
                fileList={fileList}
                listType='picture'
                name='landing-page-banner'
              >
                <UploadContent
                  text={t('actions.addBanner')}
                  hint={t('uploads.hint')}
                />
              </UploadDragger>
            )}
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
