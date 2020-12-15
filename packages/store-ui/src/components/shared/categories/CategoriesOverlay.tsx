import React from 'react';
import ReactDOM from 'react-dom';
import { Fade } from '@chakra-ui/react';
import { Box } from '@sradevski/blocks-ui';

export interface OverlayProps {
  children: React.ReactNode;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export const CategoriesOverlay = ({
  children,
  isOpen,
  setIsOpen,
}: OverlayProps) => {
  const container = React.useMemo(() => {
    if (typeof window !== 'undefined') {
      return document.createElement('div');
    }
    return null;
  }, []);

  React.useEffect(() => {
    const root = document.getElementById('categories-portal-root');
    if (!root || !container) {
      return;
    }

    root.appendChild(container);
    return () => {
      root.removeChild(container);
    };
  }, [container]);

  return (
    <div>
      {container
        ? ReactDOM.createPortal(
            <>
              <Fade
                style={{
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  zIndex: 2,
                  backgroundColor: 'white',
                }}
                unmountOnExit
                in={isOpen}
              >
                <Box
                  px={3}
                  // @ts-ignore
                  onMouseEnter={() => setIsOpen(true)}
                  onMouseLeave={() => setIsOpen(false)}
                >
                  {children}
                </Box>
              </Fade>

              <Fade
                style={{
                  position: 'fixed',
                  left: 0,
                  right: 0,
                  height: '100%',
                  zIndex: 1,
                  backgroundColor: 'rgba(0, 0, 0, 0.48)',
                  backdropFilter: 'blur(1px)',
                }}
                unmountOnExit
                in={isOpen}
              >
                <Box />
              </Fade>
            </>,
            container,
          )
        : null}
    </div>
  );
};
