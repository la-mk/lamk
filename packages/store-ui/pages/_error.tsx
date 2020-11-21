import React from 'react';
import { Head } from '../src/common/pageComponents/Head';
import { Result, Button } from '@sradevski/blocks-ui';
import Link from 'next/link';
import { useTranslation } from '../src/common/i18n';

const ErrorPage = ({ errorCode }: { errorCode: number }) => {
  const { t } = useTranslation();

  switch (errorCode) {
    case 200:
    case 404:
      return (
        <div>
          <Head
            title={`404 | ${t('results.pageNotFound')}`}
            description={t('results.pageNotFoundExplanation')}
          />
          <Result
            status='404'
            title='404'
            subTitle={t('results.pageNotFoundExplanation')}
            extra={
              <Link href='/' passHref>
                <Button as='a' variant='link'>
                  {t('actions.goBack')}
                </Button>
              </Link>
            }
          />
        </div>
      );
    case 500:
      return (
        <div>
          <Head
            title={`500 | ${t('results.serverError')}`}
            description={t('results.serverErrorExplanation')}
          />
          <Result
            status='500'
            title='500'
            subTitle={t('results.serverErrorExplanation')}
            extra={
              <Link href='/' passHref>
                <Button as='a' variant='link'>
                  {t('actions.goBack')}
                </Button>
              </Link>
            }
          />
        </div>
      );
    default:
      return (
        <div>
          <Head
            title={`${errorCode} | ${t('results.genericError')}`}
            description={t('results.genericError')}
          />
          <Result
            status='error'
            title={errorCode}
            subTitle={t('results.genericErrorExplanation', {
              statusCode: errorCode,
            })}
            extra={
              <Link href='/' passHref>
                <Button as='a' variant='link'>
                  {t('actions.goBack')}
                </Button>
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
