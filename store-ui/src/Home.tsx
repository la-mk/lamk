import React from 'react';
import { StoreLayout } from './StoreLayout';
import Link from 'next/link';

export const Home = () => {
  return (
    <StoreLayout>
      <Link href='/products/[pid]' as={`/products/123`}>
        <a>Hi</a>
      </Link>
    </StoreLayout>
  );
};
