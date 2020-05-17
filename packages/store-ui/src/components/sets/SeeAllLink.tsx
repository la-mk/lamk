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
    <Flex mt={4} alignItems='center' justifyContent='center'>
      <Link href={allHref} passHref>
        <Button size='large' type='primary'>
          {t('common.seeAll')}
        </Button>
      </Link>
    </Flex>
  );
};
