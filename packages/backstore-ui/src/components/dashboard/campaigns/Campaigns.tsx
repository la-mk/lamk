import React, { useState } from 'react';
import {
  Flex,
  hooks,
  utils,
  Button,
  Badge,
  AdvancedTable,
  AdvancedTableColumnProps,
  Spinner,
} from '@la-mk/blocks-ui';
import { useSelector } from 'react-redux';
import { getCampaigns } from '../../../state/modules/campaigns/campaigns.selector';
import { sdk } from '@la-mk/la-sdk';
import { getStore } from '../../../state/modules/store/store.selector';
import { setCampaigns } from '../../../state/modules/campaigns/campaigns.module';
import { Campaign } from '@la-mk/la-sdk/dist/models/campaign';
import { CampaignFormModal } from './CampaignFormModal';
import { useTranslation } from 'react-i18next';
import { TFunction } from 'i18next';

const getColumns = (t: TFunction): AdvancedTableColumnProps<Campaign>[] => [
  {
    Header: t('common.id'),
    accessor: '_id',
    disableSortBy: true,
    disableFilters: true,
    Cell: ({ value }: any) => sdk.utils.getShortId(value),
  },
  {
    Header: t('common.name'),
    accessor: 'name',
    disableSortBy: true,
    disableFilters: true,
  },
  {
    Header: t('campaign.active'),
    accessor: 'isActive',
    disableSortBy: true,
    disableFilters: true,
    Cell: ({ value }: any) => {
      if (value) {
        return (
          <Badge variant='outline' colorScheme='green'>
            {t('campaign.active')}
          </Badge>
        );
      }

      return (
        <Badge variant='outline' colorScheme='red'>
          {t('campaign.inactive')}
        </Badge>
      );
    },
  },
  {
    Header: t('campaign.promoted'),
    accessor: 'isPromoted',
    disableSortBy: true,
    disableFilters: true,
    Cell: ({ value }: any) => {
      if (value) {
        return (
          <Badge variant='outline' colorScheme='blue'>
            {t('campaign.promoted')}
          </Badge>
        );
      }

      return null;
    },
  },
];

export const Campaigns = () => {
  const [showModal, setShowModal] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<Campaign | undefined>(
    undefined,
  );
  const [total, setTotal] = useState<number | undefined>();
  const store = useSelector(getStore);
  const campaigns = useSelector(getCampaigns);
  const { t } = useTranslation();

  const [caller, showSpinner] = hooks.useCall();
  const [filters, setFilters] = hooks.useFilter(null, {
    storage: 'session',
    storageKey: `${store ? store._id : ''}/campaignFilters`,
  });
  const columns = React.useMemo(() => getColumns(t), [t]);

  React.useEffect(() => {
    if (!store) {
      return;
    }

    caller(
      sdk.campaign.findForStore(
        store._id,
        utils.filter.filtersAsQuery(filters),
      ),
      res => {
        setTotal(res.total);
        return setCampaigns(res.data);
      },
    );
  }, [store, filters, caller]);

  return (
    <Flex direction='column' px={[3, 4, 5]} py={5}>
      <Flex mt={3} mb={5} justify='space-between'>
        <Button
          onClick={() => {
            setEditingCampaign(undefined);
            setShowModal(true);
          }}
        >
          {t('actions.add')}
        </Button>
      </Flex>

      <Spinner isLoaded={!showSpinner}>
        <AdvancedTable<Campaign>
          data={campaigns}
          columns={columns}
          totalData={total ?? 0}
          filtersState={filters}
          onFiltersChanged={setFilters}
          onRowClick={row => {
            setEditingCampaign(row);
            setShowModal(true);
          }}
        />
      </Spinner>

      <CampaignFormModal
        campaign={editingCampaign}
        visible={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingCampaign(undefined);
        }}
      />
    </Flex>
  );
};
