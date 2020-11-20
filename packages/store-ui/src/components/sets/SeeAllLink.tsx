import React from 'react';
import { Flex, Button } from '@sradevski/blocks-ui';
import Link from 'next/link';
import { TFunction } from 'next-i18next';

export const SeeAllLink = ({
  t,
  allHref,
}: {
  t: TFunction;
  allHref: string;
}) => {
  return (
    <Flex mt={3} alignItems='center' justifyContent='center'>
      <Button>
        <Link href={allHref}>{t('common.seeAll')}</Link>
      </Button>
    </Flex>
  );
};
