import React, { useEffect } from 'react';
import { Flex, Layout, Box } from '@sradevski/blocks-ui';
import { useSelector, useDispatch } from 'react-redux';
import { getStore } from '../../state/modules/store/store.selector';
import { setUiLoaded } from '../../state/modules/ui/ui.module';
import { FooterContent } from './Footer/FooterContent';
import { SubMenu } from './SubMenu';
import { Breadcrumbs } from './Breadcrumbs';
import { Header } from './Header';

interface StoreLayoutProps {
  children?: React.ReactNode;
}

export const StoreLayout = ({ children }: StoreLayoutProps) => {
  const store = useSelector(getStore);
  const dispatch = useDispatch();

  // Fire an event to know that the UI has loaded on the client-side.
  useEffect(() => {
    dispatch(setUiLoaded());
  }, []);

  //  TODO: We currently don't highlight the selected page, support it in the future
  // const matches = router.pathname.match(/\/([^/]*)(\/?)/);
  // const selectedKey = matches && matches.length > 1 ? matches[1] : undefined;

  return (
    <>
      <Layout
        header={<Header store={store} />}
        footer={
          <Box mt={7} bg='background.dark'>
            <FooterContent store={store} />
          </Box>
        }
      >
        <Box minHeight='calc(100vh - 200px)'>
          <SubMenu />
          <div id='categories-portal-root' />
          <Breadcrumbs minHeight={'56px'} />
          <Flex direction='column'>{children}</Flex>
        </Box>
      </Layout>
    </>
  );
};
