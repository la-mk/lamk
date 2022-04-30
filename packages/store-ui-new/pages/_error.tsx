import React from "react";
import { Result, Button, Flex } from "@la-mk/blocks-ui";
import Link from "next/link";
import { useTranslation } from "next-i18next";
import { Head } from "../layout/Head";
import { PageContextWithStore } from "../hacks/store";
import { Store } from "../domain/store";

const Error = ({
  status,
  title,
  description,
  t,
  store,
}: {
  title: string;
  status: string;
  description: string;
  t: (key: string) => string;
  store: Store;
}) => {
  return (
    <Flex mt={8} direction="column" justify="center">
      <Head
        url={`/${status}`}
        store={store}
        title={title}
        titlePrefix={status}
        description={description}
      />
      <Result status={status as any} title={title} description={description} />

      <Link href="/" passHref>
        <Button mt={4} as="a" variant="link">
          {t("actions.goBack")}
        </Button>
      </Link>
    </Flex>
  );
};

const ErrorPage = ({
  errorCode,
  store,
}: {
  errorCode: number;
  store: Store;
}) => {
  const { t } = useTranslation();

  switch (errorCode) {
    case 200:
    case 404:
      return (
        <Error
          store={store}
          title={t("results.pageNotFound")}
          description={t("results.pageNotFoundExplanation")}
          status="404"
          t={t}
        />
      );
    case 500:
      return (
        <Error
          store={store}
          title={t("results.serverError")}
          description={t("results.serverErrorExplanation")}
          status="500"
          t={t}
        />
      );
    default:
      return (
        <Error
          store={store}
          title={t("results.genericError")}
          description={t("results.genericError")}
          status={errorCode.toString()}
          t={t}
        />
      );
  }
};

ErrorPage.getInitialProps = ({ req, res, err }: PageContextWithStore) => {
  const errorCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { errorCode, store: req.store };
};

export default ErrorPage;
