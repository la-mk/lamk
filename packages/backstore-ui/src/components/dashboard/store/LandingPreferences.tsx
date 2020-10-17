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
  hooks,
} from '@sradevski/blocks-ui';
import { useTranslation } from 'react-i18next';
import { sdk } from '@sradevski/la-sdk';
import { useSelector } from 'react-redux';
import { getStore } from '../../../state/modules/store/store.selector';
import { StoreContents } from '@sradevski/la-sdk/dist/models/storeContents';
import { FindResult } from '@sradevski/la-sdk/dist/setup';
import {
  handleArtifactUploadStatus,
  getDefaultFileList,
  getImageUploader,
} from '../../shared/utils/artifacts';
import { UploadChangeParam } from 'antd/lib/upload';
import { UploadFile } from 'antd/lib/upload/interface';

export const LandingPreferences = () => {
  const { t } = useTranslation();
  const [caller, showSpinner] = hooks.useCall();
  const store = useSelector(getStore);
  const [storeContents, setStoreContents] = useState<StoreContents>();
  const [externalState] = hooks.useFormState<StoreContents>(
    storeContents,
    { forStore: store?._id, landing: { sets: [] } },
    [storeContents, store?._id],
  );

  // TODO: We need ot make uploading work better with `fileList` instead of `defaultFilelist`, without keeping local state everywhere.
  const [fileList, setFileList] = useState<UploadFile<any>[] | undefined>();

  useEffect(() => {
    if (storeContents && storeContents.landing) {
      setFileList(
        getDefaultFileList(storeContents.landing.banner || [], store?._id, {
          h: 80,
        }),
      );
    }
  }, [store, storeContents]);

  useEffect(() => {
    if (!store) {
      return;
    }

    caller<FindResult<StoreContents>>(
      sdk.storeContents.findForStore(store._id),
      res => (res.total > 0 ? setStoreContents(res.data[0]) : undefined),
    );
  }, [store, caller]);

  const handlePatchBanner = (data: Partial<StoreContents>) => {
    if (!storeContents) {
      return;
    }

    caller<StoreContents>(
      sdk.storeContents.patch(storeContents._id, { landing: data.landing }),
      () => {
        message.success(t('common.success'));
      },
    );
  };

  return (
    <Flex mt={3} flexDirection='column'>
      <Spin spinning={showSpinner}>
        <Form
          colon={false}
          externalState={externalState}
          getErrorMessage={(errorName, context) =>
            t(`errors.${errorName}`, context)
          }
          validate={data => sdk.storeContents.validate(data, true)}
          // TODO: Add single validation when the validation library can handle nested schemas/selectors.
          onFormCompleted={handlePatchBanner}
          layout='vertical'
        >
          <FormItem selector='landing.banner' label={t('store.storeBanner')}>
            {(val, _onChange, onComplete) => (
              <UploadDragger
                customRequest={getImageUploader({
                  maxHeight: 1600,
                  maxWidth: 2000,
                })}
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
