import { Box } from "@la-mk/blocks-ui";
import React from "react";
import { sortBy } from "lodash";
import { Banner } from "./Banner";
import { sampleSize } from "../../../tooling/util";
import { HomeProps } from "../../../containers/home";
import { ProductSet } from "../components/sets/ProductSet";
import { ProductGrid } from "../components/sets/ProductGrid";
import { BusinessMessage } from "./BusinessMessage";
import { Featured } from "./Featured";
import { CategorySet } from "../components/sets/CategorySet";
import { Gallery } from "./Gallery";

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

      <BusinessMessage />

      <CategorySet />
      <Box mt={[8, 8, 9]}>
        {(selectedProductSets ?? []).map((set, index) => (
          <React.Fragment key={set.setTag.type + (set.setTag.value || "")}>
            <Box px={[2, 4, 5]} mb={[8, 8, 9]}>
              <>
                {index % 4 === 0 ? (
                  <ProductSet set={set} store={props.store} />
                ) : null}
                {index % 4 === 1 ? (
                  <ProductGrid set={set} store={props.store} />
                ) : null}
              </>
            </Box>
            {index % 4 === 0 && <Featured />}
          </React.Fragment>
        ))}
      </Box>

      <Gallery />
    </>
  );
};
