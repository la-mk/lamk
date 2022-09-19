import React from "react";
import { useTheme } from "@chakra-ui/react";
import { Button, Flex, Heading } from "@la-mk/blocks-ui";
import Link from "next/link";
import { Store } from "../../../domain/store";
import { Media } from "../../../domain/media";
import { DecoratedHeading } from "../components/DecoratedHeading";
import { TFunction, useTranslation } from "next-i18next";
import { getImageURL } from "../../../hacks/imageUrl";
import { ImageBackgroundBox } from "../../../components/ImageBackgroundBox";
import { urls } from "../../../tooling/url";

const MinimalThemeContent = ({
  slogan,
  t,
}: {
  slogan: string;
  t: TFunction;
}) => {
  return (
    <>
      <Heading mb={6} px={[2, 4, 5]} align="center" as="h1" size={"3xl"}>
        {slogan}
      </Heading>
      <Link href={urls.products} passHref>
        <Button as="a" size="lg">
          {t("actions.shopNow") as string}
        </Button>
      </Link>
    </>
  );
};

const BoldThemeContent = ({
  slogan,
  storeName,
}: {
  slogan: string;
  storeName: string;
}) => {
  const { t } = useTranslation("translation");

  return (
    <Flex
      // @ts-ignore
      borderColor="background.light"
      borderWidth="2px"
      height="100%"
      width="100%"
      align="center"
      justify="center"
      direction="column"
    >
      <DecoratedHeading
        px={[2, 4, 5]}
        align="center"
        as="span"
        size={"xl"}
        color="heading.light"
      >
        {storeName}
      </DecoratedHeading>
      <Heading mb={6} align="center" as="h1" size={"2xl"} color="heading.light">
        {slogan}
      </Heading>

      <Link href={urls.products} passHref>
        <Button as="a" size="lg">
          {t("actions.shopNow") as string}
        </Button>
      </Link>
    </Flex>
  );
};

export const Banner = ({
  banner,
  store,
  hideSlogan,
}: {
  store: Store;
  banner?: Media;
  hideSlogan?: boolean;
}) => {
  const { t } = useTranslation("translation");
  const theme = useTheme();
  const ownTheme = theme.sections.Home.banner;

  if (!banner) {
    return null;
  }

  const dimensions = {
    style: {
      position: "absolute",
    },
    top: ["10%", "20%", "20%"],
    bottom: ["10%", "20%", "20%"],
    width: ["90%", "70%", "60%"],
    ml: ["5%", "15%", "20%"],
    p: 3,
  };

  return (
    <Flex bg="white">
      <ImageBackgroundBox
        mx="auto"
        url={getImageURL(banner?._id, store._id, { h: 600 }) ?? ""}
        height={["26rem", "38rem", "38rem"]}
        maxWidth={"96rem"}
        width="100%"
        // @ts-ignore
        style={{ position: "relative" }}
      >
        {store.slogan && !hideSlogan && (
          <>
            <Flex
              // @ts-ignore
              {...dimensions}
              // @ts-ignore
              style={{
                ...dimensions.style,
                opacity: ownTheme.variant === "minimal" ? 0.85 : 1,
              }}
              bg={
                ownTheme.variant === "minimal"
                  ? "background.light"
                  : "background.dark"
              }
            />

            <Flex
              // @ts-ignore
              {...dimensions}
              align="center"
              justify="center"
              direction="column"
            >
              {ownTheme.variant === "minimal" && (
                <MinimalThemeContent slogan={store.slogan} t={t} />
              )}

              {ownTheme.variant === "bold" && (
                <BoldThemeContent
                  storeName={store.name}
                  slogan={store.slogan}
                />
              )}
            </Flex>
          </>
        )}
      </ImageBackgroundBox>
    </Flex>
  );
};
