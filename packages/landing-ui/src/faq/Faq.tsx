import React from 'react';
import { Accordion, Box, Heading, Text } from '@la-mk/blocks-ui';
import { Trans } from 'react-i18next';
import { useTranslation } from '../common/i18n';
import { HeroTitle } from '../common/HeroTitle';

export interface FaqItem {
  question: string;
  answer: string;
}

export interface FaqGroup {
  title: string;
  items: FaqItem[];
}

export const Faq = ({ faqGroups }: { faqGroups: FaqGroup[] }) => {
  const { t } = useTranslation();

  return (
    <Box>
      <HeroTitle description={t('landingFaq.heroExplanation')}>
        <Trans t={t} i18nKey='landingFaq.heroSlogan'>
          Frequently&nbsp;
          <Text
            lineHeight={1.3}
            align='center'
            // @ts-ignore
            fontSize='inherit'
            color='primary.500'
          >
            Asked Questions
          </Text>
        </Trans>
      </HeroTitle>

      <Box maxWidth={'60rem'} mx={'auto'} px={[4, 6, 7]} mb={7}>
        <Text as='p'>{t('landingFaq.additionalExplanation')}</Text>
        <Box width='100%'>
          {faqGroups.map(group => {
            return (
              <Box key={group.title} mt={[6, 7, 7]}>
                <Heading as='h3' mb={4}>
                  {group.title}
                </Heading>

                <Accordion
                  items={group.items.map(x => ({
                    title: x.question,
                    content: x.answer,
                  }))}
                />
              </Box>
            );
          })}
        </Box>
      </Box>
    </Box>
  );
};
