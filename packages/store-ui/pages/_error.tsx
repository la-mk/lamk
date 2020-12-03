import React from 'react';
import { Head } from '../src/common/pageComponents/Head';
import { Result, Button, Flex } from '@sradevski/blocks-ui';
import Link from 'next/link';
import { useTranslation } from '../src/common/i18n';

const ErrorPage = ({ errorCode }: { errorCode: number }) => {
  const { t } = useTranslation();

  switch (errorCode) {
    case 200:
    case 404:
      return (
        <Flex direction='column' justify='center'>
          <Head
            title={`404 | ${t('results.pageNotFound')}`}
            description={t('results.pageNotFoundExplanation')}
          />
          <Result
            status='404'
            title='404'
            description={t('results.pageNotFoundExplanation')}
          />

          <Link href='/' passHref>
            <Button mt={4} as='a' variant='link'>
              {t('actions.goBack')}
            </Button>
          </Link>
        </Flex>
      );
    case 500:
      return (
        <Flex direction='column' justify='center'>
          <Head
            title={`500 | ${t('results.serverError')}`}
            description={t('results.serverErrorExplanation')}
          />
          <Result
            status='500'
            title='500'
            description={t('results.serverErrorExplanation')}
          />
          <Link href='/' passHref>
            <Button mt={4} as='a' variant='link'>
              {t('actions.goBack')}
            </Button>
          </Link>
        </Flex>
      );
    default:
      return (
        <Flex direction='column' justify='center'>
          <Head
            title={`${errorCode} | ${t('results.genericError')}`}
            description={t('results.genericError')}
          />
          <Result
            status='error'
            title={errorCode}
            description={t('results.genericErrorExplanation', {
              statusCode: errorCode,
            })}
          />
          <Link href='/' passHref>
            <Button mt={4} as='a' variant='link'>
              {t('actions.goBack')}
            </Button>
          </Link>
        </Flex>
      );
  }
};

ErrorPage.getInitialProps = ({ res, xhr }) => {
  const errorCode = res ? res.statusCode : xhr ? xhr.status : null;
  return { errorCode };
};

export default ErrorPage;
