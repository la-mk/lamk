import React, { useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import styled from '@emotion/styled';
import { Button } from '@chakra-ui/react';
import { ChevronLeft, ChevronRight } from 'react-feather';

const Wrapper = styled.div<{ fullscreen?: boolean }>`
  overflow: hidden;
  position: relative;

  .embla__container {
    display: flex;
  }
  .embla__slide {
    position: relative;
    ${(props) => (props.fullscreen ? 'flex: 0 0 100%;' : '')}
  }
`;

const Dot = styled.div<{ active?: boolean }>`
  height: 10px;
  width: 10px;
  border-radius: 50%;
  display: inline-block;
  margin-right: 6px;

  background-color: ${(props) =>
    props.active
      ? props.theme.colors.primary['400']
      : props.theme.colors.gray[200]};
  transition: background-color 300ms;
`;

const ArrowButton = styled(Button)<{ direction: ArrowDirection }>`
  position: absolute !important;
  top: 0;
  bottom: 0;
  ${(props) => (props.direction === 'left' ? 'left: 0' : 'right: 0')};
  margin-top: auto;
  margin-bottom: auto;
`;

const DotsWrapper = styled.div`
  position: absolute;
  bottom: 5%;
  left: 2%;
`;

export type ArrowDirection = 'left' | 'right';

export interface CarouselProps<T> {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
  loop?: boolean;
  dragFree?: boolean;
  skipSnaps?: boolean;
  fullscreen?: boolean;
  navigation?: 'dots' | 'arrows' | 'none';
  slidesToScroll?: 'auto' | number;
}

export const Carousel = <T extends any>({
  renderItem,
  items,
  fullscreen,
  navigation = 'none',
  ...others
}: CarouselProps<T>) => {
  const [emblaRef, emblaApi] = useEmblaCarousel(others);
  const [currentProgress, setCurrentProgress] = useState(0);

  useEffect(() => {
    if (!emblaApi) {
      return;
    }

    const action = () => {
      setCurrentProgress(emblaApi.selectedScrollSnap());
    };
    emblaApi.on('select', action);
    return () => {
      emblaApi.off('select', action);
    };
  }, [emblaApi]);

  return (
    <Wrapper fullscreen={fullscreen} className="embla" ref={emblaRef}>
      <div className="embla__container">
        {items.map((item) => {
          return <div className="embla__slide">{renderItem(item)}</div>;
        })}
      </div>
      {navigation === 'dots' && !!fullscreen && !others.dragFree && (
        <DotsWrapper>
          {items.map((_, i) => {
            return <Dot key={i} active={currentProgress === i} />;
          })}
        </DotsWrapper>
      )}
      {navigation === 'arrows' && (
        <>
          <ArrowButton
            variant="ghost"
            disabled={!emblaApi?.canScrollPrev()}
            onClick={() => emblaApi?.scrollPrev()}
            direction="left"
            leftIcon={<ChevronLeft />}
          />
          <ArrowButton
            variant="ghost"
            disabled={!emblaApi?.canScrollNext()}
            onClick={() => emblaApi?.scrollNext()}
            direction="right"
            leftIcon={<ChevronRight />}
          />
        </>
      )}
    </Wrapper>
  );
};
