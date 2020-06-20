import React from 'react';
import {
  Paragraph,
  Collapse,
  CollapsePanel,
  Box,
  Title,
  Flex,
  Text,
} from '@sradevski/blocks-ui';
import { CurvedSection } from '../common/CurvedSection';
import { withTheme } from 'styled-components';
import { TFunction } from 'next-i18next';
import { Trans } from 'react-i18next';
import { useTranslation } from '../common/i18n';

interface FaqItem {
  question: string;
  answer: string;
}

interface FaqGroup {
  title: string;
  items: FaqItem[];
}

const getPricingItems = (t: TFunction): FaqItem[] => [
  {
    question: t('landingFaq.pricingQuestionHowMuch'),
    answer: t('landingFaq.pricingAnswerHowMuch'),
  },
  {
    question: t('landingFaq.pricingQuestionSignContract'),
    answer: t('landingFaq.pricingAnswerSignContract'),
  },
];

const getPaymentItems = (t: TFunction): FaqItem[] => [
  {
    question: t('landingFaq.paymentsQuestionSupportedMethods'),
    answer: t('landingFaq.paymentsAnswerSupportedMethods'),
  },
];

const getFaqGroups = (t: TFunction): FaqGroup[] => [
  {
    title: t('landingFaq.pricingGroupTitle'),
    items: getPricingItems(t),
  },
  {
    title: t('landingFaq.paymentsGroupTitle'),
    items: getPaymentItems(t),
  },
];

export const Faq = withTheme(({ theme }) => {
  const { t } = useTranslation();

  return (
    <Box>
      <CurvedSection
        direction='down'
        backgroundColor={theme.colors.background.light}
      >
        <Flex
          alignItems='center'
          justifyContent='center'
          flexDirection={['column', 'row', 'row']}
          mt={[4, 4, 5]}
        >
          <Box maxWidth={600}>
            <Title
              color='secondary'
              level={1}
              mb={2}
              textAlign={'center'}
              fontSize={[6, 7, 7]}
            >
              <Trans t={t} i18nKey='landingFaq.heroSlogan'>
                Frequently&nbsp;
                <Text fontSize={[6, 7, 7]} color='primary'>
                  Asked Questions
                </Text>
              </Trans>
            </Title>

            <Paragraph
              mt={4}
              fontSize={[2, 3, 3]}
              textAlign={['center', 'center', 'center']}
            >
              {t('landingFaq.heroExplanation')}
            </Paragraph>
          </Box>
        </Flex>
      </CurvedSection>

      <Box maxWidth={960} mx={'auto'} px={[3, 4, 4]} mb={5}>
        <Paragraph>{t('landingFaq.additionalExplanation')}</Paragraph>
        <Box width='100%'>
          {getFaqGroups(t).map((group) => {
            return (
              <Box key={group.title} mt={4}>
                <Title mb={3} level={3}>
                  {group.title}
                </Title>
                <Collapse width='100%' style={{ background: 'transparent' }}>
                  {group.items.map((faqItem) => {
                    return (
                      <CollapsePanel
                        key={faqItem.question}
                        header={faqItem.question}
                      >
                        <Paragraph>{faqItem.answer}</Paragraph>
                      </CollapsePanel>
                    );
                  })}
                </Collapse>
              </Box>
            );
          })}
        </Box>
      </Box>
    </Box>
  );
});
