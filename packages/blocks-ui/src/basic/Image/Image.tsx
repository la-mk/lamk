import React from 'react';
import Img, { ImgProps } from 'react-image';
import { system } from '../../system';
import styled from 'styled-components';

export interface ImageProps extends ImgProps {
  maxWidth?: string | number;
  maxHeight?: string | number;
}

const StyledImg = styled(Img)`
  object-fit: contain;
  max-width: 100%;
  max-height: 100%;
  width: auto;
  height: auto;
`;

const MissingImageSvg = ({
  height,
  width,
}: {
  height?: string | number;
  width?: string | number;
}) => (
  <svg
    height={height ?? '100%'}
    width={width ?? '100%'}
    fill='#f2f2f2'
    xmlns='https://www.w3.org/2000/svg'
    viewBox='0 0 3372 3352'
    shapeRendering='geometricPrecision'
    textRendering='geometricPrecision'
    imageRendering='optimizeQuality'
    fillRule='evenodd'
    clipRule='evenodd'
  >
    <path
      d='M238 0h2895c66 0 125 27 168 70s70 103 70 168v2875c0 66-27 125-70 168s-103 70-168 70H238c-66 0-125-27-168-70S0 3178 0 3113V238c0-66 27-125 70-168S173 0 238 0zm-46 2423l1029-930c39-36 100-32 135 7 1 1 1 2 2 2l863 1021 132-812c9-52 58-88 110-79 20 3 38 13 52 26l663 636V238c0-13-5-24-14-32-8-8-20-14-32-14H237c-13 0-24 5-32 14-8 8-14 20-14 32v2185zm2987 138l-665-638-136 835c-3 23-14 45-33 61-40 34-101 29-135-11l-934-1105-1084 980v432c0 13 5 24 14 32 8 8 20 14 32 14h2895c13 0 24-5 32-14 8-8 14-20 14-32v-552zM2541 545c95 0 182 39 244 101 63 63 101 149 101 244s-39 182-101 244c-63 63-149 101-244 101s-182-39-244-101c-63-63-101-149-101-244s39-182 101-244c63-63 149-101 244-101zm137 209c-35-35-83-57-137-57-53 0-102 22-137 57s-57 83-57 137c0 53 22 102 57 137s83 57 137 57c53 0 102-22 137-57s57-83 57-137c0-53-22-102-57-137z'
      fillRule='nonzero'
    />
  </svg>
);

const ImageBase = (props: ImageProps) => {
  const { height, width, maxWidth, maxHeight } = props;
  return (
    <StyledImg
      unloader={
        <MissingImageSvg
          height={height ?? maxHeight}
          width={width ?? maxWidth}
        />
      }
      {...props}
    />
  );
};

export const Image = system<ImageProps>(ImageBase as any);
