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
    <Flex mt={4} align='center' justify='center'>
      <Link href={allHref} passHref>
        <Button as='a' size='lg'>
          {t('common.seeAll')}
        </Button>
      </Link>
    </Flex>
  );
};
