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
  @keyframes bannerShowUp {
    0% {
      transform: translateY(15%);
      opacity: 0;
    }
    100% {
      transform: translateX(0);
      opacity: 1;
    }
  }

  animation: 2s ease-out 0s 1 bannerShowUp;
`;

const dimensions = {
  style: {
    position: "absolute",
  },
  background: "rgba(45,46,46,0.15)",
  bottom: [0, 0, 0],
  left: [0, 0, 0],
  width: ["100%", "100%", "100%"],
  justify: "center",
  align: "center",
  p: [4, 5, 7],
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
        url={getImageURL(banner?._id ?? "", storeId, { h: 800 }) ?? ""}
        height={["32rem", "40rem", "48rem"]}
        width="100%"
        // @ts-ignore
        style={{ position: "relative" }}
      >
        <Box {...dimensions}>
          <AnimatedBannerAction
            direction="column"
            justify={"center"}
            align={"center"}
          >
            <Heading align={textAlign} mb={5} as="h1" size={"xl"}>
              {slogan ?? "The place to shop"}
            </Heading>
            <Link href={urls.products} passHref>
              {/* @ts-ignore */}
              <Button maxWidth="14rem" as="a" size="lg">
                {t("actions.shopNow") as string}
              </Button>
            </Link>
          </AnimatedBannerAction>
        </Box>
      </ImageBackgroundBox>
    </div>
  );
};
