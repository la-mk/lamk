import React from 'react';
import { Flex, Text } from '@sradevski/blocks-ui';
import { withTheme } from 'styled-components';
import { BlocksTheme } from '@sradevski/blocks-ui/dist/theme';

interface ServicesSetProps {
  services: Array<{
    icon?: string;
    title: string;
    subtitle: string;
  }>;
  theme: BlocksTheme;
}

export const ServicesSet = withTheme(
  ({ services, theme }: ServicesSetProps) => {
    const servicesToShow = services.slice(0, 3);

    return (
      <Flex py={3} alignItems='center' justifyContent='center' flexWrap='wrap'>
        {servicesToShow.map(service => {
          return (
            <Flex
              key={service.title}
              flex={1}
              minWidth={320}
              maxWidth={420}
              height={160}
              my={[4, 4, 0]}
              mx={[2, 3, 4]}
              bg='background.dark'
              style={{
                borderRadius: theme.radius[0],
              }}
              alignItems='center'
              justifyContent='center'
            >
              {!!service.icon && service.icon}
              <Flex px={5} py={4} flexDirection='column'>
                <Text fontSize={[3, 3, 4]} color='text.light'>
                  {service.title}
                </Text>
                <Text fontSize={[0, 0, 1]} color='mutedText.light'>
                  {service.subtitle}
                </Text>
              </Flex>
            </Flex>
          );
        })}
      </Flex>
    );
  },
);
