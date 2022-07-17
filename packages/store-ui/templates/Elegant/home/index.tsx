import { Box, Button, Carousel, Flex, Heading, Text } from "@la-mk/blocks-ui";
import React from "react";
import { sortBy } from "lodash";
import { ImageBackgroundBox } from "../../../components/ImageBackgroundBox";
import { Banner } from "./Banner";
import { sampleSize } from "../../../tooling/util";
import { HomeProps } from "../../../containers/home";
import { ProductSet } from "../components/sets/ProductSet";
import { ProductGrid } from "../components/sets/ProductGrid";

const categories = [
  { title: "Wooden accessories", subtitle: "Bestseller", link: "http://test" },
  {
    title: "Metal accessories",
    subtitle: "Recently released",
    link: "http://test",
  },
];

const CategoryItem = ({ item }: { item: any }) => (
  <ImageBackgroundBox
    // url={getImageURL(banner?._id ?? "", storeId, { h: 600 }) ?? ""}
    url="/images/test.webp"
    height={["24rem", "24rem", "28rem"]}
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
        Shop now
      </Button>
    </Box>
  </ImageBackgroundBox>
);

const CategorySet = () => {
  return (
    <>
      <Box display={["block", "none", "none"]}>
        <Carousel
          navigation="dots"
          fullscreen
          items={categories}
          renderItem={(item) => <CategoryItem key={item.title} item={item} />}
        />
      </Box>
      <Flex display={["none", "flex", "flex"]} direction="row">
        {categories.map((item) => (
          <CategoryItem key={item.title} item={item} />
        ))}
      </Flex>
    </>
  );
};

export const Home = (props: HomeProps) => {
  const selectedProductSets = sampleSize(
    sortBy(props.productSets ?? [], "setTag"),
    10,
    2
  );

  return (
    <>
      <Banner
        storeId={props.store._id}
        banner={props.banner}
        slogan={props.store?.slogan}
      />

      <Flex>Some text</Flex>

      <CategorySet />
      <Box mt={[7, 8, 8]}>
        {(selectedProductSets ?? []).map((set, index) => (
          <React.Fragment key={set.setTag.type + (set.setTag.value || "")}>
            <Box px={[2, 4, 5]} mb={8}>
              <>
                {index % 4 === 0 ? (
                  <ProductSet set={set} store={props.store} />
                ) : null}
                {index % 4 === 1 ? (
                  <ProductGrid set={set} store={props.store} />
                ) : null}
              </>
            </Box>
          </React.Fragment>
        ))}
      </Box>

      <Box>Our story</Box>
    </>
  );
};
