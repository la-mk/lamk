import { storiesOf } from '@storybook/react';
import * as React from 'react';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from './';
import { Provider } from '../../';

storiesOf('Breadcrumb', module).add('standard', () => (
  <Provider>
    <div>
      <Breadcrumb>
        <BreadcrumbItem>
          <BreadcrumbLink href="#">First</BreadcrumbLink>
        </BreadcrumbItem>

        <BreadcrumbItem isCurrentPage>
          <BreadcrumbLink href="#">Second</BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>
    </div>
  </Provider>
));
