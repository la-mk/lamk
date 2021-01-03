import React, { useState } from 'react';
import { Flex, Box, Image, ImageMagnifier } from '@sradevski/blocks-ui';
import { sdk } from '@sradevski/la-sdk';
import { Thumbnails } from '../shared/Thumbnails';
import { ProductTags } from '../shared/product/ProductTags';
import { Product } from '@sradevski/la-sdk/dist/models/product';
import { Store } from '@sradevski/la-sdk/dist/models/store';
import { useTranslation } from '../../common/i18n';

export const ProductImage = ({
  product,
  store,
}: {
  product: Product;
  store: Store;
}) => {
  const { t } = useTranslation();
  const [selectedImage, setSelectedImage] = useState(product.images[0]);

  React.useEffect(() => {
    if (product) {
      setSelectedImage(product.images[0]);
    }
  }, [product?._id]);

  return (
    <Flex
      width={['100%', '50%', '50%']}
      align='center'
      justify='flex-start'
      direction='column'
      mr={[0, 2, 2]}
    >
      <Box
        height={'28rem'}
        minWidth={'12rem'}
        // @ts-ignore
        style={{ position: 'relative' }}
      >
        <ImageMagnifier
          magnifierSize={180}
          zoomFactor={1.15}
          src={sdk.artifact.getUrlForImage(selectedImage, store._id)}
        >
          {imageProps => (
            <Image
              style={{ objectFit: 'cover' }}
              {...imageProps}
              getSrc={params =>
                sdk.artifact.getUrlForImage(selectedImage, store._id, params)
              }
              height={440}
              alt={product.name}
            />
          )}
        </ImageMagnifier>
        <ProductTags product={product} t={t} />
      </Box>
      <Box mt={4} maxWidth={['100%', '100%', '80%']}>
        <Thumbnails
          images={product.images}
          imageBucket={store._id}
          selectedImage={selectedImage}
          onImageClick={setSelectedImage}
        />
      </Box>
    </Flex>
  );
};
