import { Box, Button, Carousel, Flex, Heading, Text } from "@la-mk/blocks-ui";
import { TFunction, useTranslation } from "next-i18next";
import { ImageBackgroundBox } from "../../../../components/ImageBackgroundBox";

const categories = [
  {
    title: "Wooden accessories",
    subtitle: "Bestseller",
    link: "/images/test.webp",
  },
  {
    title: "Metal accessories",
    subtitle: "Recently released",
    link: "/images/test.webp",
  },
];

const CategoryItem = ({
  item,
  t,
}: {
  item: { title: string; subtitle: string; link: string };
  t: TFunction;
}) => (
  <ImageBackgroundBox
    // url={getImageURL(banner?._id ?? "", storeId, { h: 600 }) ?? ""}
    url={item.link}
    height={["24rem", "28rem", "32rem"]}
    width="100%"
  >
    <Box mt={6} ml={6}>
      <Text color="mutedText.dark" textTransform="uppercase" size="xs">
        {item.subtitle}
      </Text>
      <Heading as="h2" size="lg">
        {item.title}
      </Heading>
      <Button mt={2} variant="link">
        {t("actions.shopNow") as string}
      </Button>
    </Box>
  </ImageBackgroundBox>
);

export const CategorySet = () => {
  const { t } = useTranslation("translation");
  return (
    <>
      <Box display={["block", "none", "none"]}>
        <Carousel
          navigation="dots"
          fullscreen
          items={categories}
          renderItem={(item) => (
            <CategoryItem t={t} key={item.title} item={item} />
          )}
        />
      </Box>
      <Flex display={["none", "flex", "flex"]} direction="row">
        {categories.map((item) => (
          <CategoryItem t={t} key={item.title} item={item} />
        ))}
      </Flex>
    </>
  );
};
