import { useState, useEffect, useCallback } from 'react';
import { useCall } from './useCall';
import { PaginationProps } from 'antd/lib/pagination';

export interface Action<T = any> {
  type: T;
}

export interface FindResult<T> {
  total: number;
  limit: number;
  skip: number;
  data: T[];
}

interface AdvancedCallProps<T> {
  fetcher: ((params: any) => Promise<FindResult<T>>) | null;
  resultHandler: (res: FindResult<T>) => Action<any> | void;
}

const getQuery = (pagination: PaginationProps) => {
  return {
    $limit: pagination.pageSize,
    $skip: ((pagination.current || 1) - 1) * (pagination.pageSize || 1),
    $sort: {
      createdAt: -1,
    },
  };
};

type UseAdvancedCallResult = [any, PaginationProps, boolean];

export const useAdvancedCall = <T extends any>(
  fetcher: ((params: any) => Promise<FindResult<T>>) | null,
  resultHandler: (res: FindResult<T>) => Action<any> | void,
  initialPagination: PaginationProps = {},
): UseAdvancedCallResult => {
  const [caller, showSpinner] = useCall();
  const [pagination, setPagination] = useState<PaginationProps>({
    current: 1,
    pageSize: 20,
    showSizeChanger: false,
    ...initialPagination,
  });

  useEffect(() => {
    if (fetcher) {
      caller<FindResult<T>>(fetcher({ query: getQuery(pagination) }), res => {
        setPagination({ ...pagination, total: res.total });
        return resultHandler(res);
      });
    }
  }, [caller, fetcher, resultHandler]);

  const handlePageChange = useCallback(
    (page: PaginationProps) => {
      if (page.current === pagination.current) {
        return;
      }

      setPagination(page);
      if (fetcher) {
        caller<FindResult<T>>(fetcher({ query: getQuery(page) }), res => {
          setPagination({ ...page, total: res.total });
          return resultHandler(res);
        });
      }
    },
    [fetcher, resultHandler],
  );

  return [handlePageChange, pagination, showSpinner];
};
