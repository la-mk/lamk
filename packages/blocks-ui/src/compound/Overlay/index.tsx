import React from 'react';
import ReactDOM from 'react-dom';
import { Fade } from '@chakra-ui/react';

export interface OverlayProps {
  children: React.ReactNode;
  trigger: ({
    toggle,
    open,
    close,
  }: {
    toggle: () => void;
    open: () => void;
    close: () => void;
  }) => React.ReactNode;
}

export const Overlay = ({ children, trigger }: OverlayProps) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const container = React.useMemo(() => document.createElement('div'), []);

  React.useEffect(() => {
    const root = document.getElementById('portal-root');
    if (!root) {
      return;
    }

    root.appendChild(container);
    return () => {
      root.removeChild(container);
    };
  }, []);

  return (
    <div>
      {trigger({
        toggle: () => setIsOpen(x => !x),
        open: () => setIsOpen(true),
        close: () => setIsOpen(false),
      })}
      {ReactDOM.createPortal(
        <Fade unmountOnExit in={isOpen}>
          <div
            onMouseEnter={() => setIsOpen(true)}
            onMouseLeave={() => setIsOpen(false)}
          >
            {children}
          </div>
        </Fade>,
        container
      )}
    </div>
  );
};
