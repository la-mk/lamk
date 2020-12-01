import { storiesOf } from '@storybook/react';
import * as React from 'react';
import { Pagination } from './';
import { Provider } from '../../';

storiesOf('Pagination', module).add('standard', () => {
  const [currentPage, setCurrentPage] = React.useState(1);
  return (
    <Provider>
      <div>
        <Pagination
          mt={3}
          totalItems={280}
          currentPage={currentPage}
          pageSize={20}
          onChange={setCurrentPage}
        />

        <Pagination
          mt={3}
          totalItems={10}
          currentPage={currentPage}
          pageSize={20}
          onChange={setCurrentPage}
        />

        <Pagination
          mt={3}
          totalItems={39}
          currentPage={currentPage}
          pageSize={20}
          onChange={setCurrentPage}
        />

        <Pagination
          mt={3}
          totalItems={119}
          currentPage={currentPage}
          pageSize={20}
          onChange={setCurrentPage}
        />

        <Pagination
          mt={3}
          totalItems={159}
          currentPage={currentPage}
          pageSize={20}
          onChange={setCurrentPage}
        />

        <Pagination
          mt={3}
          totalItems={159}
          currentPage={currentPage}
          pageSize={20}
          onChange={setCurrentPage}
          size="sm"
        />

        <Pagination
          mt={3}
          totalItems={77}
          currentPage={currentPage}
          pageSize={2}
          onChange={setCurrentPage}
        />
      </div>
    </Provider>
  );
});
