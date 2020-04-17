import React from 'react';
// import { Head } from '../src/common/pageComponents/Head';
import { Result, Button } from '@sradevski/blocks-ui';
import Link from 'next/link';

const ErrorPage = ({ errorCode }: { errorCode: number }) => {
  switch (errorCode) {
    case 200:
    case 404:
      return (
        <div>
          {/* <Head title={`404 | ${t('results.pageNotFound')}`} /> */}
          <Result
            status='404'
            title='404'
            subTitle={''}
            extra={
              <Link href='/' passHref>
                <Button type='link'>Go back</Button>
              </Link>
            }
          />
        </div>
      );
    case 500:
      return (
        <div>
          {/* <Head title={`500 | ${t('results.serverError')}`} /> */}
          <Result
            status='500'
            title='500'
            subTitle={''}
            extra={
              <Link href='/' passHref>
                <Button type='link'>Go back</Button>
              </Link>
            }
          />
        </div>
      );
    default:
      return (
        <div>
          {/* <Head title={`${errorCode} | ${t('results.genericError')}`} /> */}
          <Result
            status='error'
            title={errorCode}
            subTitle={''}
            extra={
              <Link href='/' passHref>
                <Button type='link'>Go back</Button>
              </Link>
            }
          />
        </div>
      );
  }
};

ErrorPage.getInitialProps = ({ res, xhr }) => {
  const errorCode = res ? res.statusCode : xhr ? xhr.status : null;
  return { errorCode };
};

export default ErrorPage;
