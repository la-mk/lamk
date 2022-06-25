import { hooks } from '@la-mk/blocks-ui';
import { useRouter } from 'next/router';
import React from 'react';
import { AccountMenu } from '../../components/account/AccountMenu';

export const Sider = () => {
  const { pathname } = useRouter();
  const isMobile = hooks.useBreakpoint([true, false, false]);
  if (isMobile) {
    return null;
  }

  if (pathname.startsWith('/account')) {
    return <AccountMenu />;
  }

  return null;
};
