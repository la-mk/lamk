import React from 'react';
import styled from 'styled-components';

const BannerImg = styled.img`
  width: 100%;
  height: auto;
`;

export const Banner = () => {
  return (
    <div>
      <BannerImg src='https://previews.123rf.com/images/liaarevadze/liaarevadze1707/liaarevadze170700061/82024571-online-shop-banner-design-for-promotion-with-shop-front-and-shopping-icons-flat-design-vector-illust.jpg' />
    </div>
  );
};
