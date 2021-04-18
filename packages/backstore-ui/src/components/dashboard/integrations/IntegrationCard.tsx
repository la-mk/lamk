import { Box, Button, Card, Flex, Image, Text } from '@la-mk/blocks-ui';
import React from 'react';
import { useTranslation } from 'react-i18next';
import type { Integration } from './Integrations';

export const IntegrationCard = ({
  integration,
  onSelect,
  isDisabled,
}: {
  isDisabled: boolean;
  integration: Integration;
  onSelect: (integration: Integration) => void;
}) => {
  const { t } = useTranslation();

  return (
    <Card maxWidth='280px'>
      <Flex mb={3} align='center'>
        <Box height='3rem' mr={2} p={1}>
          <Image src={integration.config.logo} />
        </Box>

        <Text size='lg' ml={2}>
          {integration.config.name}
        </Text>
      </Flex>

      <Text as='p' color='mutedText.dark' mt={3} size='sm'>
        {integration.config.description}
      </Text>

      <Button
        isDisabled={isDisabled}
        mt={4}
        mx='auto'
        variant={integration.value ? 'outline' : 'solid'}
        isFullWidth
        onClick={() => onSelect(integration)}
      >
        {integration.value
          ? t('actions.updateIntegration')
          : t('actions.integrateNow')}
      </Button>
    </Card>
  );
};
