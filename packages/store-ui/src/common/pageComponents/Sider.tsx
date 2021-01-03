import { useRouter } from 'next/router';
import React from 'react';
import { Sidebar as AccountSidebar } from '../../components/account/Sidebar';

export const Sider = () => {
  const { pathname } = useRouter();
  if (pathname.startsWith('/account')) {
    return <AccountSidebar />;
  }

  return null;
};
