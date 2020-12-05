import { storiesOf } from '@storybook/react';
import * as React from 'react';
import { Layout } from './';
import { Provider } from '../../';
import { Box } from '../Box';

storiesOf('Layout', module).add('standard', () => (
  <Provider>
    <div style={{ height: '100%' }}>
      <Layout
        header={<Box bg="lightcyan" height="60px" width="100%" />}
        leftSider={<Box bg="lightblue" height="100%" width="200px" />}
        footer={<Box bg="lightseagreen" height={'200px'} width="100%" />}
      >
        <Box bg="maroon" height={'1000px'} width="100%" />
      </Layout>
    </div>
  </Provider>
));
