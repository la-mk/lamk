import React from 'react';
import { Head } from '../src/common/pageComponents/Head';

const ErrorPage = ({ errorCode }: { errorCode: number }) => {
  switch (errorCode) {
    case 200:
    case 404:
      return (
        <div>
          <Head title='404 | Not Found' />
          The page does not exist.
        </div>
      );
    case 500:
      return (
        <div>
          <Head title='500 | Server Error' />
          <p>An internal server error occurred.</p>
        </div>
      );
    default:
      return (
        <div>
          <Head title={`${errorCode} | Error Occured`} />
          An <strong>HTTP {errorCode}</strong> error occurred.
        </div>
      );
  }
};

ErrorPage.getInitialProps = ({ res, xhr }) => {
  const errorCode = res ? res.statusCode : xhr ? xhr.status : null;
  return { errorCode };
};

export default ErrorPage;
