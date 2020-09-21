import React, { useRef, useState, useEffect } from 'react';
import styled from 'styled-components';
import throttle from 'lodash/throttle';
import debounce from 'lodash/debounce';

// Heavily inspired by https://github.com/samuelmeuli/react-magnifier. We can probably PR it there if necessary.

const MagnifyingContainer = styled.div`
  position: relative;
  display: inline-block;
  line-height: 0;
  height: 100%;
  max-width: 100%;
`;

const MagnifyingGlass = styled.div<{
  magnifierSize: number;
  src: string;
}>`
  position: absolute;
  z-index: 1;
  background: #e5e5e5 no-repeat;
  border: 2px solid #ebebeb;
  box-shadow: 2px 2px 3px rgba(0, 0, 0, 0.3);
  pointer-events: none;

  width: ${props => props.magnifierSize}px;
  height: ${props => props.magnifierSize}px;
  background-image: url(${props => props.src});
  background-size: auto;
`;

export interface ImageMagnifierProps {
  children: (imageProps: any) => React.ReactNode;
  magnifierSize?: number;
  zoomFactor?: number;
  src: string;
}

export const ImageMagnifier = ({
  children,
  magnifierSize = 60,
  zoomFactor = 2,
  src,
}: ImageMagnifierProps) => {
  const imageRef = useRef<HTMLImageElement>(null);
  const [imageBounds, setImageBounds] = useState<DOMRect | undefined>();
  const [showMagnifier, setShowMagnifier] = useState(false);
  const [magnifierPosition, setMagnifierPosition] = useState<{
    x: number;
    y: number;
  }>();

  useEffect(() => {
    if (!imageRef.current) {
      return;
    }

    const debouncedSetImageBounds = debounce(
      () => setImageBounds(imageRef.current?.getBoundingClientRect()),
      200
    );

    const onMouseEnter = () => {
      setShowMagnifier(true);
      setImageBounds(imageRef.current?.getBoundingClientRect());
    };

    const onMouseMove = throttle(
      (e: MouseEvent) => {
        if (!imageBounds?.left || !imageBounds?.top) {
          return;
        }

        const target = e.target as HTMLElement;
        const x = (e.clientX - imageBounds.left) / target.clientWidth;
        const y = (e.clientY - imageBounds.top) / target.clientHeight;

        setMagnifierPosition({
          x,
          y,
        });
      },
      30,
      { trailing: false }
    );

    const onMouseOut = () => {
      setShowMagnifier(false);
    };

    let touchStartY: number | undefined;

    const onTouchStart = (e: TouchEvent) => {
      touchStartY = e.targetTouches[0]?.clientY;
    };

    const onTouchEnd = (e: TouchEvent) => {
      const newImageBounds = imageRef.current?.getBoundingClientRect();
      setImageBounds(newImageBounds);

      const isScroll =
        touchStartY &&
        Math.abs(touchStartY - e.changedTouches[0]?.clientY) > 12;
      touchStartY = undefined;

      if (isScroll) {
        setShowMagnifier(false);
        return;
      }

      if (!newImageBounds?.left || !newImageBounds?.top) {
        return;
      }

      const target = e.target as HTMLElement;
      const x =
        (e.changedTouches[0].clientX - newImageBounds.left) /
        target.clientWidth;
      const y =
        (e.changedTouches[0].clientY - newImageBounds.top) /
        target.clientHeight;

      // Only show magnifying glass if touch is inside image
      if (x >= 0 && y >= 0 && x <= 1 && y <= 1) {
        setShowMagnifier(true);
        setMagnifierPosition({
          x,
          y,
        });
      } else {
        setShowMagnifier(false);
      }
    };

    // Add mouse/touch event listeners to image element (assigned in render function)
    // `passive: false` prevents scrolling on touch move
    imageRef.current.addEventListener('mouseenter', onMouseEnter, {
      passive: false,
    });
    imageRef.current.addEventListener('mousemove', onMouseMove, {
      passive: false,
    });
    imageRef.current.addEventListener('mouseout', onMouseOut, {
      passive: false,
    });

    imageRef.current.addEventListener('touchstart', onTouchStart, {
      passive: false,
    });
    imageRef.current.addEventListener('touchend', onTouchEnd, {
      passive: false,
    });

    window.addEventListener('resize', debouncedSetImageBounds);
    window.addEventListener('scroll', debouncedSetImageBounds, true);

    return () => {
      imageRef.current?.removeEventListener('mouseenter', onMouseEnter);
      imageRef.current?.removeEventListener('mousemove', onMouseMove);
      imageRef.current?.removeEventListener('mouseout', onMouseOut);
      imageRef.current?.removeEventListener('touchstart', onTouchStart);
      imageRef.current?.removeEventListener('touchend', onTouchEnd);

      window.addEventListener('resize', debouncedSetImageBounds);
      window.addEventListener('scroll', debouncedSetImageBounds, true);
    };
  }, [
    imageRef?.current,
    imageBounds?.left,
    imageBounds?.top,
    setShowMagnifier,
    setMagnifierPosition,
  ]);

  const calculateImageBounds = () => {
    if (!imageRef?.current) {
      return;
    }

    setImageBounds(imageRef.current.getBoundingClientRect());
  };

  console.log(src, imageBounds);

  return (
    <MagnifyingContainer>
      {children({
        imageRef,
        onLoad: calculateImageBounds,
      })}
      {showMagnifier && magnifierPosition && imageBounds && src && (
        <MagnifyingGlass
          magnifierSize={magnifierSize}
          src={src}
          // For performance reasons we don't use styled components for the positioning, as it recreates classes on every change.
          style={{
            left: `calc(${magnifierPosition?.x * 100}% - ${magnifierSize /
              2}px)`,
            top: `calc(${magnifierPosition?.y * 100}% - ${magnifierSize /
              2}px)`,
            backgroundSize: `${zoomFactor * imageBounds.width}% ${zoomFactor *
              imageBounds.height}%`,
            backgroundPosition: `calc(${magnifierPosition?.x *
              100}% + ${magnifierSize / 2}px - ${magnifierPosition?.x *
              magnifierSize}px) calc(${magnifierPosition?.y *
              100}% + ${magnifierSize / 2}px - ${magnifierPosition?.y *
              magnifierSize}px)`,
          }}
        />
      )}
    </MagnifyingContainer>
  );
};
