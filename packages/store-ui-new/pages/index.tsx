import type { NextPage } from "next";
import { PageContextWithStore } from "../hacks/store";
import { getProps, newClient } from "../sdk/queryClient";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { getDefaultPrefetch } from "../sdk/defaults";

const Home: NextPage = () => {
  return <div></div>;
};

export async function getServerSideProps({
  locale,
  req: { store },
}: PageContextWithStore) {
  const queryClient = newClient();
  await Promise.all(getDefaultPrefetch(queryClient, store));

  return {
    props: {
      ...getProps(queryClient),
      ...(await serverSideTranslations(locale ?? "mk", ["translation"])),
      store,
    },
  };
}

export default Home;
