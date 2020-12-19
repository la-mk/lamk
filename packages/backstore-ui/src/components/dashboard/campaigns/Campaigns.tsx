import React, { useState } from 'react';
import {
  Flex,
  Heading,
  hooks,
  utils,
  Button,
  Badge,
} from '@sradevski/blocks-ui';
import { useSelector } from 'react-redux';
import { getCampaigns } from '../../../state/modules/campaigns/campaigns.selector';
import { sdk } from '@sradevski/la-sdk';
import { getStore } from '../../../state/modules/store/store.selector';
import { setCampaigns } from '../../../state/modules/campaigns/campaigns.module';
import { Campaign } from '@sradevski/la-sdk/dist/models/campaign';
import { CampaignFormModal } from './CampaignFormModal';
import { useTranslation } from 'react-i18next';
import { TFunction } from 'i18next';
import Table, { ColumnProps } from 'antd/lib/table';

const getColumns = (t: TFunction) =>
  [
    {
      title: t('common.id'),
      dataIndex: '_id',
      render: id => sdk.utils.getShortId(id),
    },
    {
      title: t('common.name'),
      dataIndex: 'name',
    },
    {
      title: t('campaign.active'),
      dataIndex: 'isActive',
      render: val => {
        if (val) {
          return (
            <Badge variant='outline' colorScheme='blue'>
              {t('campaign.active')}
            </Badge>
          );
        }

        return null;
      },
    },
    {
      title: t('campaign.promoted'),
      dataIndex: 'isPromoted',
      render: val => {
        if (val) {
          return (
            <Badge variant='outline' colorScheme='blue'>
              {t('campaign.promoted')}
            </Badge>
          );
        }

        return null;
      },
    },
  ] as ColumnProps<Campaign>[];

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
  const columns = getColumns(t);

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
      <Flex my={3} justify='space-between'>
        <Button
          onClick={() => {
            setEditingCampaign(undefined);
            setShowModal(true);
          }}
        >
          {t('actions.add')}
        </Button>
      </Flex>

      <Table<Campaign>
        dataSource={campaigns}
        columns={columns}
        loading={showSpinner}
        pagination={{
          total: total || 0,
          showSizeChanger: false,
          current: filters.pagination ? filters.pagination.currentPage : 1,
          pageSize: filters.pagination ? filters.pagination.pageSize : 20,
        }}
        onChange={(pagination, tableFilters, sorter) => {
          const singleSorter = Array.isArray(sorter) ? sorter[0] : sorter;

          setFilters({
            pagination: {
              pageSize: pagination.pageSize || 20,
              currentPage: pagination.current || 1,
            },
            sorting:
              singleSorter?.field && singleSorter?.order
                ? {
                    field: singleSorter.field as string,
                    order: singleSorter.order,
                  }
                : undefined,
            filtering: {
              ...filters.filtering,
            },
          });
        }}
        rowKey='_id'
        onRow={campaign => ({
          onClick: () => {
            setEditingCampaign(campaign);
            setShowModal(true);
          },
        })}
      />

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
