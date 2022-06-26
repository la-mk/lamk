import React, { useContext, useState } from 'react';
import { Slide } from '@chakra-ui/react';
import { Flex } from '../basic/Flex';
import { Box } from '../basic/Box';
import { Text } from '../basic/Text';
import { Button } from '../basic/Button';
import { LocalizationContext } from '../basic/Provider';
import { Checkbox } from '../basic/Checkbox';

interface Consent {
  [key: string]: boolean;
}

interface ConsentRequest {
  key: keyof Consent;
  title: string;
  isRequired?: boolean;
}

export interface CookieBannerProps {
  consents?: Consent | null;
  requests: ConsentRequest[];
  onConsentsChanged: (consents: Consent) => void;
  cookiesPolicyLink: string;
}

export const CookieBanner = ({
  consents,
  requests,
  onConsentsChanged,
  cookiesPolicyLink,
}: CookieBannerProps) => {
  const localization = useContext(LocalizationContext);
  const [consentsState, setConsentsState] = useState<
    Consent | null | undefined
  >(consents);
  const shouldShow = !consents;

  return (
    <Slide
      direction="bottom"
      unmountOnExit
      in={shouldShow}
      style={{ zIndex: 20 }}
    >
      <Flex
        width="100%"
        bg="gray.50"
        align="center"
        justify="space-between"
        direction={['column', 'row', 'row']}
        p={5}
      >
        <Flex direction="column">
          <Box m={3}>
            <Text as="p">
              {localization.cookiesExplanation ??
                'We use cookies to deliver a better user experience'}
              .
            </Text>
            <Text mt={2} as="p">
              {localization.readMoreCookies ?? 'Read more in our'}{' '}
              <Button
                variant="link"
                href={cookiesPolicyLink}
                target="_blank"
                rel="noreferrer noopener"
              >
                {localization.cookiesPolicy ?? 'cookies policy'}
              </Button>
              .
            </Text>
          </Box>

          <Flex wrap="wrap">
            {requests.map(request => {
              return (
                <Checkbox
                  mx={3}
                  my={1}
                  onChange={e => {
                    setConsentsState({
                      ...consentsState,
                      [request.key]: e.target.checked,
                    });
                  }}
                  isChecked={
                    (request.isRequired || consentsState?.[request.key]) ?? true
                  }
                  key={request.key}
                  isDisabled={request.isRequired}
                >
                  {request.title}
                </Checkbox>
              );
            })}
          </Flex>
        </Flex>

        <Flex m={3} align="center" justify="center">
          <Button
            mr={3}
            onClick={() => {
              onConsentsChanged(
                requests.reduce((aggr: Consent, request) => {
                  aggr[request.key] = true;
                  return aggr;
                }, {})
              );
            }}
          >
            {localization.acceptAll ?? 'Accept all'}
          </Button>

          <Button
            ml={3}
            variant="link"
            onClick={() =>
              onConsentsChanged(
                requests.reduce((aggr: Consent, request) => {
                  aggr[request.key] =
                    (request.isRequired || consentsState?.[request.key]) ??
                    true;
                  return aggr;
                }, {})
              )
            }
          >
            {localization.acceptSelected ?? 'Accept selected'}
          </Button>
        </Flex>
      </Flex>
    </Slide>
  );
};
