import React, { useContext } from 'react';
import { Slide } from '@chakra-ui/react';
import { Flex } from '../basic/Flex';
import { Box } from '../basic/Box';
import { Text } from '../basic/Text';
import { Button } from '../basic/Button';
import { LocalizationContext } from '../basic/Provider';

interface Consent {
  [key: string]: boolean;
}

interface ConsentRequest {
  key: keyof Consent;
  title: string;
}

export interface CookieBannerProps {
  consents?: Consent | null;
  requests: ConsentRequest[];
  onConsentsChanged: (consents: Consent) => void;
  privacyPolicyLink: string;
}

export const CookieBanner = ({
  consents,
  requests,
  onConsentsChanged,
  privacyPolicyLink,
}: CookieBannerProps) => {
  const localization = useContext(LocalizationContext);
  // Don't run this on the server-side
  const shouldShow = !(consents || typeof window === 'undefined');

  return (
    <Slide
      direction="bottom"
      unmountOnExit
      in={shouldShow}
      style={{ zIndex: 20 }}
    >
      <Flex
        width="100%"
        bg="gray.300"
        align="center"
        justify="space-between"
        direction={['column', 'row', 'row']}
        p={5}
      >
        <Box m={3}>
          <Text as="p">
            {localization.cookiesExplanation ??
              'We use cookies to deliver a better user experience'}
          </Text>
          <Text as="p">
            {localization.readMoreCookies ?? 'Read more in our'}{' '}
            <Button
              variant="link"
              href={privacyPolicyLink}
              target="_blank"
              rel="noreferrer noopener"
            >
              {localization.privacyPolicy ?? 'privacy policy'}
            </Button>
            .
          </Text>
        </Box>

        <Flex m={3} align="center" justify="center">
          <Button
            mr={3}
            onClick={() =>
              onConsentsChanged(
                requests.reduce((aggr: Consent, request) => {
                  aggr[request.key] = true;
                  return aggr;
                }, {})
              )
            }
          >
            {localization.acceptCookies ?? 'Accept cookies'}
          </Button>

          <Button ml={3} variant="link">
            {localization.decline ?? 'Decline'}
          </Button>
        </Flex>
      </Flex>
    </Slide>
  );
};
