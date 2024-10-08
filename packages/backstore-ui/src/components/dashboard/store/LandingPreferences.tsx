import React, { useEffect, useState } from 'react';
import { Flex, Button, Spinner, toast, hooks, NewForm } from '@la-mk/blocks-ui';
import { useTranslation } from 'react-i18next';
import { sdk } from '@la-mk/la-sdk';
import { useSelector } from 'react-redux';
import { getStore } from '../../../state/modules/store/store.selector';
import { StoreContents } from '@la-mk/la-sdk/dist/models/storeContents';
import { FindResult } from '@la-mk/la-sdk/dist/setup';
import { getImageUploader } from '../../shared/utils/artifacts';
import cloneDeep from 'lodash/cloneDeep';
import { useCall } from '../../shared/hooks/useCall';
// import { getGroups } from '../../../state/modules/products/products.selector';
// import { setGroups } from '../../../state/modules/products/products.module';
// import { ProductGroup } from '@la-mk/la-sdk/dist/models/productGroup';

export const LandingPreferences = () => {
  const { t } = useTranslation();
  const [caller, showSpinner] = useCall();
  const store = useSelector(getStore);
  const [storeContents, setStoreContents] = useState<StoreContents>();
  const [
    storeContentsFormData,
    setStoreContentsFormData,
  ] = hooks.useFormState<StoreContents>(
    storeContents,
    { forStore: store?._id, landing: { sets: [] } },
    [storeContents, store?._id],
  );
  // const [groupsCaller] = useCall();
  // const groups: string[] | undefined = useSelector(getGroups);

  // React.useEffect(() => {
  //   if (!groups && store?._id) {
  //     groupsCaller<FindResult<ProductGroup>>(
  //       sdk.productGroup.findForStore(store._id),
  //       productGroups => setGroups(productGroups.data.map(x => x.groupName)),
  //     );
  //   }
  // }, [groups, groupsCaller, store]);

  useEffect(() => {
    if (!store) {
      return;
    }

    caller<FindResult<StoreContents>>(
      sdk.storeContents.findForStore(store._id),
      res => (res.total > 0 ? setStoreContents(res.data[0]) : undefined),
    );
  }, [caller, store]);

  const handlePatchLandingContent = ({
    formData,
  }: {
    formData: Partial<StoreContents>;
  }) => {
    if (!storeContents) {
      return;
    }

    caller<StoreContents>(
      sdk.storeContents.patch(storeContents._id, { landing: formData.landing }),
      () => {
        toast.success(t('common.success'));
      },
    );
  };

  const pickedSchema = cloneDeep(
    sdk.utils.schema.pick(sdk.storeContents.schema, ['landing']),
  );

  pickedSchema.properties.landing?.properties?.sets?.items?.oneOf?.forEach(
    (entry: any) => {
      entry.title = t(`productSets.${entry.properties.type.const}`);
    },
  );

  return (
    <Flex mt={3} direction='column'>
      <Spinner isLoaded={!showSpinner}>
        <NewForm
          imageUpload={{
            getImageUrl: imageId =>
              sdk.artifact.getUrlForImage(imageId, store?._id ?? '', {
                h: 80,
              }) ?? '',
            uploadImage: getImageUploader({
              maxHeight: 1600,
              maxWidth: 2000,
            }),
            removeImage: imageId => sdk.artifact.remove(imageId as any) as any,
          }}
          schema={pickedSchema}
          uiSchema={{
            landing: {
              'ui:options': {
                label: false,
              },
              banner: {
                'ui:title': t('store.storeBanner'),
                'ui:widget': 'file',
                'ui:options': {
                  name: 'landing-page-banner',
                },
              },
              sets: {
                'ui:title': t('sets.sets'),
                'ui:widget': 'tabs',
                'ui:options': {
                  itemTitles: (storeContentsFormData as StoreContents)?.landing?.sets?.map(
                    set => set.title ?? t(`productSets.${set.type}`),
                  ),
                },
                items: {
                  'ui:order': [
                    'type',
                    'value',
                    'title',
                    'subtitle',
                    'isPromoted',
                  ],
                  'ui:title': t(`sets.setType`),
                  'ui:options': {
                    asOneOf: true,
                  },
                  type: {
                    'ui:widget': 'hidden',
                  },
                  title: {
                    'ui:title': t(`sets.setTitle`),
                  },
                  subtitle: {
                    'ui:title': t(`sets.setSubtitle`),
                  },

                  value: {
                    'ui:options': {
                      mt: 2,
                    },
                    'ui:title': t('sets.value'),
                  },
                  isPromoted: {
                    'ui:options': {
                      mt: 2,
                      label: t(`sets.setPromoted`),
                    },
                  },
                },
              },
              hideSlogan: {
                'ui:widget': 'hidden',
              },
            },
          }}
          onSubmit={handlePatchLandingContent}
          onChange={({ formData }) => setStoreContentsFormData(formData)}
          formData={storeContentsFormData as StoreContents}
          getErrorMessage={(errorName, context) =>
            t(`errors.${errorName}`, context)
          }
        >
          <Button type='submit'>{t('actions.update')}</Button>
        </NewForm>
      </Spinner>
    </Flex>
  );
};
