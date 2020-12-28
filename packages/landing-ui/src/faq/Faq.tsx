import React from 'react';
import { Accordion, Box, Heading, Flex, Text } from '@sradevski/blocks-ui';
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

const getGeneralItems = (t: TFunction): FaqItem[] => [
  {
    question: t('landingFaq.generalQuestionNeedToStartSell'),
    answer: t('landingFaq.generalAnswerNeedToStartSell'),
  },
  {
    question: t('landingFaq.generalQuestionTechnicalKnowledge'),
    answer: t('landingFaq.generalAnswerTechnicalKnowledge'),
  },
  {
    question: t('landingFaq.generalQuestionSupportedLanguage'),
    answer: t('landingFaq.generalAnswerSupportedLanguage'),
  },
  {
    question: t('landingFaq.generalQuestionGetHelp'),
    answer: t('landingFaq.generalAnswerGetHelp'),
  },
];

const getAdminItems = (t: TFunction): FaqItem[] => [
  {
    question: t('landingFaq.adminQuestionCustomDomain'),
    answer: t('landingFaq.adminAnswerCustomDomain'),
  },

  {
    question: t('landingFaq.adminQuestionSeo'),
    answer: t('landingFaq.adminAnswerSeo'),
  },
  {
    question: t('landingFaq.adminQuestionCustomDesign'),
    answer: t('landingFaq.adminAnswerCustomDesign'),
  },
];

const getPaymentItems = (t: TFunction): FaqItem[] => [
  {
    question: t('landingFaq.paymentsQuestionSupportedMethods'),
    answer: t('landingFaq.paymentsAnswerSupportedMethods'),
  },
  {
    question: t('landingFaq.paymentsQuestionCardDirectly'),
    answer: t('landingFaq.paymentsAnswerCardDirectly'),
  },
  {
    question: t('landingFaq.paymentsQuestionCardExplain'),
    answer: t('landingFaq.paymentsAnswerCardExplain'),
  },
];

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

const getFaqGroups = (t: TFunction): FaqGroup[] => [
  {
    title: t('landingFaq.generalGroupTitle'),
    items: getGeneralItems(t),
  },
  {
    title: t('landingFaq.adminGroupTitle'),
    items: getAdminItems(t),
  },
  {
    title: t('landingFaq.paymentsGroupTitle'),
    items: getPaymentItems(t),
  },
  {
    title: t('landingFaq.pricingGroupTitle'),
    items: getPricingItems(t),
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
          align='center'
          justify='center'
          direction={['column', 'row', 'row']}
          mt={[4, 4, 5]}
        >
          <Box maxWidth={600}>
            <Heading
              color='secondary'
              as='h1'
              mb={2}
              align={'center'}
              size='2xl'
            >
              <Trans t={t} i18nKey='landingFaq.heroSlogan'>
                Frequently&nbsp;
                {/* @ts-ignore */}
                <Text fontSize={'inherit'} color='primary'>
                  Asked Questions
                </Text>
              </Trans>
            </Heading>

            <Text
              as='p'
              mt={4}
              // @ts-ignore
              size={['md', 'lg', 'lg']}
              align={['center', 'center', 'center']}
            >
              {t('landingFaq.heroExplanation')}
            </Text>
          </Box>
        </Flex>
      </CurvedSection>

      <Box maxWidth={960} mx={'auto'} px={[3, 4, 4]} mb={5}>
        <Text as='p'>{t('landingFaq.additionalExplanation')}</Text>
        <Box width='100%'>
          {getFaqGroups(t).map(group => {
            return (
              <Box key={group.title} mt={4}>
                <Heading mb={3} as='h3'>
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
});
