import styled from "@emotion/styled";
import { Box, Button, Flex, Heading, hooks, Text } from "@la-mk/blocks-ui";
import { useTranslation } from "next-i18next";
import Link from "next/link";
import React from "react";
import { ImageBackgroundBox } from "../../../components/ImageBackgroundBox";
import { Media } from "../../../domain/media";
import { getImageURL } from "../../../hacks/imageUrl";
import { urls } from "../../../tooling/url";

const AnimatedBannerAction = styled(Flex)`
  @keyframes showUp {
    0% {
      transform: translateY(15%);
      opacity: 0;
    }
    100% {
      transform: translateX(0);
      opacity: 1;
    }
  }

  animation: 2s ease-out 0s 1 showUp;
`;

const dimensions = {
  style: {
    position: "absolute",
  },
  bottom: ["50%", "60%", "10%"],
  left: ["10%", "25%", "2%"],
  width: ["80%", "50%", "30%"],
  justify: ["center", "center", "flex-start"],
  align: ["center", "center", "flex-start"],
  p: 3,
};

export const Banner = ({
  storeId,
  banner,
  slogan,
}: {
  storeId: string;
  banner: Media | undefined;
  slogan: string | undefined;
}) => {
  const { t } = useTranslation("translation");
  const textAlign: "center" | "left" = hooks.useBreakpoint([
    "center",
    "center",
    "left",
  ]);

  return (
    <div>
      <ImageBackgroundBox
        mx="auto"
        // url={getImageURL(banner?._id ?? "", storeId, { h: 600 }) ?? ""}
        url={"/images/test.webp"}
        height={["32rem", "40rem", "48rem"]}
        width="100%"
        // @ts-ignore
        style={{ position: "relative" }}
      >
        <Box {...dimensions}>
          <AnimatedBannerAction
            direction="column"
            justify={["center", "center", "flex-start"]}
            align={["center", "center", "flex-start"]}
          >
            <Heading align={textAlign} mb={5} as="h1" size={"xl"}>
              {slogan ?? "Time to shop"}
            </Heading>
            <Link href={urls.products} passHref>
              {/* @ts-ignore */}
              <Button maxWidth="12rem" as="a" size="lg">
                {t("actions.shopNow") as string}
              </Button>
            </Link>
          </AnimatedBannerAction>
        </Box>
      </ImageBackgroundBox>
    </div>
  );
};
