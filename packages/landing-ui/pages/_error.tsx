import React from 'react';
import { Result, Button, Flex } from '@la-mk/blocks-ui';
import Link from 'next/link';
import { useTranslation } from '../src/common/i18n';
import { Head } from '../src/common/Head';

const Error = ({ status, title, description, t }) => {
  return (
    <Flex my={8} direction='column' justify='center'>
      <Head
        url='https://la.mk/404'
        title={title}
        titlePrefix={status}
        description={description}
      />
      <Result status={status} title={title} description={description} />

      <Link href='/' passHref>
        <Button mt={4} as='a' variant='link'>
          {t('actions.goBack')}
        </Button>
      </Link>
    </Flex>
  );
};

const ErrorPage = ({ errorCode }: { errorCode: number }) => {
  const { t } = useTranslation();

  switch (errorCode) {
    case 200:
    case 404:
      return (
        <Error
          title={t('results.pageNotFound')}
          description={t('results.pageNotFoundExplanation')}
          status='404'
          t={t}
        />
      );
    case 500:
      return (
        <Error
          title={t('results.serverError')}
          description={t('results.serverErrorExplanation')}
          status='500'
          t={t}
        />
      );
    default:
      return (
        <Error
          title={t('results.genericError')}
          description={t('results.genericError')}
          status={errorCode.toString()}
          t={t}
        />
      );
  }
};

ErrorPage.getInitialProps = ({ res, xhr }) => {
  const errorCode = res ? res.statusCode : xhr ? xhr.status : null;
  return { errorCode };
};

export default ErrorPage;
