import { Box, Carousel, Flex } from "@la-mk/blocks-ui";
import React from "react";
import { ImageBackgroundBox } from "../../../components/ImageBackgroundBox";
import { envvars } from "../../../tooling/env";

export const Gallery = () => {
  const images = [
    `${envvars.ARTIFACTS_ENDPOINT}/custom/mokudo/misc1.jpg`,
    `${envvars.ARTIFACTS_ENDPOINT}/custom/mokudo/misc2.jpg`,
    `${envvars.ARTIFACTS_ENDPOINT}/custom/mokudo/misc3.jpg`,
  ];

  return (
    <>
      <Box display={["block", "block", "none"]}>
        <Carousel
          navigation="dots"
          fullscreen
          items={images}
          renderItem={(item) => (
            <ImageBackgroundBox
              mx="auto"
              url={item}
              height="24rem"
              width={"100%"}
            />
          )}
        />
      </Box>
      <Flex display={["none", "none", "flex"]} direction="row">
        {images.map((item) => (
          <ImageBackgroundBox
            key={item}
            url={item}
            height="28rem"
            width={"calc(100%/3)"}
          />
        ))}
      </Flex>
    </>
  );
};
