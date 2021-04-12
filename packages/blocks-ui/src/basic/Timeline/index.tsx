import { Box } from '../../basic/Box';
import { Flex } from '../../basic/Flex';
import { Text } from '../../basic/Text';
import React from 'react';
import { Tooltip } from '@chakra-ui/tooltip';
import { useTheme } from '@emotion/react';

export interface TimelineProps {
  events: Event[];
}

export interface Event {
  title: string;
  description: string;
  timestamp: string;
}

const Circle = ({ diameter, color }: { diameter: number; color: string }) => {
  return (
    <svg height={diameter + 2} width={diameter + 2}>
      <circle
        cx={diameter / 2 + 1}
        cy={diameter / 2 + 1}
        r={diameter / 2}
        stroke={color}
        stroke-width="2"
        fill="white"
      />
    </svg>
  );
};

const Line = ({
  iconDiameter,
  placement,
  padding,
  color,
  firstLineHeight,
}: {
  iconDiameter: number;
  placement: 'before' | 'after';
  padding: string;
  color: string;
  firstLineHeight: string;
}) => {
  return (
    <Box
      // @ts-ignore
      style={{
        position: 'absolute',
        top:
          placement === 'before'
            ? 0
            : `calc(${padding} + ${firstLineHeight} / 2)`,
        bottom:
          placement === 'before'
            ? `calc(100% - ${padding} - ${firstLineHeight} / 2)`
            : 0,
        left: iconDiameter / 2,
        border: `1px ${color} dashed`,
      }}
    ></Box>
  );
};

const Event = ({
  event,
  iconDiameter,
  index,
  total,
}: {
  event: Event;
  iconDiameter: number;
  index: number;
  total: number;
}) => {
  const theme = useTheme();
  const isFirst = index === 0;
  const isLast = index === total - 1;
  const firstLineHeight = `calc(${theme.fontSizes.lg} * ${theme.lineHeights.base})`;
  const date = new Date(event.timestamp);

  return (
    <Flex
      pt={3}
      pb={3}
      // @ts-ignore
      style={{ position: 'relative' }}
    >
      {!isFirst && (
        <Line
          padding={theme.space['3']}
          firstLineHeight={firstLineHeight}
          color={theme.colors.gray['300']}
          placement="before"
          iconDiameter={iconDiameter}
        />
      )}

      <Flex
        align="center"
        height={firstLineHeight}
        // @ts-ignore
        style={{ zIndex: 2 }}
        mr={4}
      >
        <Circle color={theme.colors.background.dark} diameter={iconDiameter} />
      </Flex>

      {!isLast && (
        <Line
          padding={theme.space['3']}
          firstLineHeight={firstLineHeight}
          color={theme.colors.gray['300']}
          placement="after"
          iconDiameter={iconDiameter}
        />
      )}

      <Flex maxWidth="16rem" direction="column">
        {/* @ts-ignore */}
        <Flex style={{ whitespace: 'nowrap' }} align="center" mr={[3, 3, 4]}>
          <Text noOfLines={1} size="lg">
            {event.title}
          </Text>

          <Text color="mutedText.dark" size="xs" ml={[3, 3, 4]}>
            {`${date.toLocaleDateString()} ${date.toLocaleTimeString()}`}
          </Text>
        </Flex>
        <Tooltip label={event.description}>
          <Text as="p" noOfLines={2} size="sm">
            {event.description}
          </Text>
        </Tooltip>
      </Flex>
    </Flex>
  );
};

export const Timeline = ({ events }: TimelineProps) => {
  const iconDiameter = 12;

  return (
    <Flex direction="column">
      {events.map((event, i) => (
        <Event
          event={event}
          key={i}
          index={i}
          total={events.length}
          iconDiameter={iconDiameter}
        />
      ))}
    </Flex>
  );
};
