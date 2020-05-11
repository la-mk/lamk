import React, { createRef, useEffect, useRef } from 'react';
import iro from '@jaames/iro';
import { Flex, Input, Box } from '@sradevski/blocks-ui';

const hexRegex = /^#[0-9A-F]{6}$/i;

const isValidHex = (val: string) => {
  return hexRegex.test(val);
};

interface IroColorPicker {
  on: (action: string, callback: Function) => void;
  color: {
    hexString: string;
    set: (value: any) => void;
    setState: (state: any) => void;
  };
}

export interface ColorInputProps {
  value: string;
  onChange: (color: string) => void;
}

export const ColorPicker = ({ value, onChange }: ColorInputProps) => {
  const colorPicker = useRef<IroColorPicker | null>(null);
  const el = createRef<HTMLDivElement>();

  useEffect(() => {
    if (!el.current) {
      return;
    }

    colorPicker.current = iro.ColorPicker(el.current, {
      color: value,
      width: 160,
      layout: [
        {
          component: iro.ui.Box,
        },
        {
          component: iro.ui.Slider,
          options: {
            sliderType: 'hue',
          },
        },
      ],
      layoutDirection: 'horizontal',
    });

    const handler = ({ hexString }: { hexString: string }) => {
      onChange(hexString);
    };

    // @ts-ignore
    colorPicker.current.on(['color:init', 'color:change'], handler);
    return () =>
      // @ts-ignore
      colorPicker.current.off(['color:init', 'color:change'], handler);
  }, []);

  useEffect(() => {
    if (
      colorPicker?.current?.color &&
      value !== colorPicker?.current?.color.hexString &&
      isValidHex(value)
    ) {
      colorPicker.current.color.hexString = value;
    }
  });

  return (
    <Flex
      alignItems='center'
      justifyContent='center'
      flexDirection='column'
      my={2}
    >
      <div ref={el} />

      <Flex alignItems='center' justifyContent='space-between'>
        <Box mr={2} height={30} width={60} style={{ backgroundColor: value }} />
        <Input
          ml={2}
          width={100}
          value={value}
          onChange={e => {
            onChange(e.target.value);
          }}
        />
      </Flex>
    </Flex>
  );
};
