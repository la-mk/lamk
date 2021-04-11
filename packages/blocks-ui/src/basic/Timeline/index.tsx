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
  status: string;
  description: string;
  timestamp: string;
}

const Circle = ({ diameter }: { diameter: number }) => {
  return (
    <svg height={diameter + 2} width={diameter + 2}>
      <circle
        cx={diameter / 2 + 1}
        cy={diameter / 2 + 1}
        r={diameter / 2}
        stroke="gray"
        stroke-width="1"
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
        border: `1px ${color} solid`,
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
  const isFirst = index === 0;
  const isLast = index === total - 1;
  const theme = useTheme();
  const firstLineHeight = `calc(${theme.fontSizes.lg} * ${theme.lineHeights.base})`;

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
          color="gray"
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
        <Circle diameter={iconDiameter} />
      </Flex>

      {!isLast && (
        <Line
          padding={theme.space['3']}
          firstLineHeight={firstLineHeight}
          color="gray"
          placement="after"
          iconDiameter={iconDiameter}
        />
      )}

      <Flex maxWidth="16rem" direction="column">
        {/* @ts-ignore */}
        <Flex style={{ whitespace: 'nowrap' }} align="center" mr={3}>
          <Text noOfLines={1} size="lg">
            {event.status}
          </Text>

          <Text color="mutedText.dark" size="xs" ml={3}>
            {new Date(event.timestamp).toLocaleDateString()}
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
