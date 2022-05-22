import React from "react";
import { Flex, Box, Text, Heading, Image } from "@la-mk/blocks-ui";
import { SetTitle } from "./SetTitle";
import { useTheme } from "@chakra-ui/react";
import sampleSize from "lodash/sampleSize";
import { TFunction, useTranslation } from "next-i18next";
import styled from "@emotion/styled";
import { Category } from "../../domain/category";
import { getImageURL } from "../../hacks/imageUrl";
import { ImageBackgroundBox } from "../ImageBackgroundBox";
import { HoverableLink } from "../HoverableLink";

const IllustrationWrapper = styled(Box)`
  & svg {
    height: 13rem;
    margin: auto;
  }
`;

interface CategorySetProps {
  categories: Category[];
  title: string;
  subtitle: string;
  getCategoryHref: (categorySlug: string) => string;
}

interface CategoryProps {
  categoryName: string;
  t: TFunction;
}

// The illustrations use the `--chakra...` CSS variables internally, so it depends on them to render properly.
// TODO: Specify custom variables so there is no direct dependency on Chakra
const IllustratedCategory = ({ categoryName, t }: CategoryProps) => {
  return (
    <Flex
      direction="column"
      height={"18rem"}
      minWidth={"18rem"}
      maxWidth={"24rem"}
      bg="background.light"
    >
      <IllustrationWrapper p={2}>
        <Image
          alt={`illustration-${categoryName}`}
          inlineSvg
          src={
            getImageURL(`${categoryName}.svg`, "categories/illustrations") ?? ""
          }
        />
      </IllustrationWrapper>
      <Flex
        mx={3}
        my={2}
        p={[2, 2, 3]}
        align="center"
        justify="center"
        bg="background.dark"
        // @ts-ignore
        borderRadius={"md"}
      >
        <Text align="center" size="sm" color="text.light" letterSpacing="wider">
          {t(`categories.${categoryName}`).toUpperCase()}
        </Text>
      </Flex>
    </Flex>
  );
};

const ImageCategory = ({ categoryName, t }: CategoryProps) => {
  return (
    <ImageBackgroundBox
      height={"18rem"}
      minWidth={"18rem"}
      maxWidth={"24rem"}
      // @ts-ignore
      borderRadius={"md"}
      style={{
        position: "relative",
      }}
      url={
        getImageURL(`${categoryName}.jpg`, "categories", {
          h: 280,
        }) ?? ""
      }
    >
      <Flex
        p={[2, 2, 3]}
        align="center"
        justify="center"
        bg="background.dark"
        // @ts-ignore
        borderRadius={"md"}
        style={{
          position: "absolute",
          bottom: 16,
          left: 16,
          right: 16,
        }}
      >
        <Text size="sm" color="text.light" letterSpacing="wider">
          {t(`categories.${categoryName}`).toUpperCase()}
        </Text>
      </Flex>
    </ImageBackgroundBox>
  );
};

const BoldCategory = ({
  categoryName,
  categoryIndex,
  size,
  t,
}: {
  categoryName: string;
  categoryIndex: number;
  size: "full" | "half";
  t: TFunction;
}) => {
  return (
    <ImageBackgroundBox
      height={size === "full" ? "16rem" : "7rem"}
      width={size === "full" ? "18rem" : ["9rem", "9rem", "12rem"]}
      // @ts-ignore
      borderRadius={"md"}
      style={{
        position: "relative",
      }}
      url={
        getImageURL(
          `bold-background${(categoryIndex % 4) + 1}.jpg`,
          "categories",
          {
            h: 360,
          }
        ) ?? ""
      }
      p={2}
    >
      <Box
        // @ts-ignore
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          left: 0,
          opacity: 0.5,
        }}
        width="100%"
        bg="background.dark"
      />
      <Flex
        // @ts-ignore
        position="relative"
        height="100%"
        p={[2, 2, 3]}
        border="2px solid"
        borderColor="background.light"
        align="center"
        justify="center"
      >
        <Heading
          align="center"
          color="heading.light"
          as="span"
          size={size === "full" ? "lg" : "md"}
        >
          {t(`categories.${categoryName}`).toUpperCase()}
        </Heading>
      </Flex>
    </ImageBackgroundBox>
  );
};

export const CategorySet = ({
  categories,
  title,
  subtitle,
  getCategoryHref,
}: CategorySetProps) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const ownTheme = theme.sections.Categories;

  const categoriesToShow = React.useMemo(() => {
    return sampleSize(
      Array.from(new Set(categories.map((category) => category.level2))),
      ownTheme.count
    );
  }, [categories, ownTheme.count]);

  return (
    <>
      <SetTitle emphasized title={title} subtitle={subtitle} />

      <Flex align="center" justify="center" wrap="wrap">
        {categoriesToShow.map((categoryName, idx) => {
          return (
            <Box key={categoryName} my={4} mx={[4, 4, 5]}>
              <HoverableLink href={getCategoryHref(categoryName)}>
                {ownTheme.variant === "illustrated" && (
                  <IllustratedCategory t={t} categoryName={categoryName} />
                )}
                {ownTheme.variant === "bold" && (
                  <BoldCategory
                    categoryIndex={idx}
                    t={t}
                    size="full"
                    categoryName={categoryName}
                  />
                )}
              </HoverableLink>
            </Box>
          );
        })}
      </Flex>
    </>
  );
};
