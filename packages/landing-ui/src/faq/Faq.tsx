import React from 'react';
import { Accordion, Box, Heading, Text } from '@la-mk/blocks-ui';
import { withTheme } from 'styled-components';
import { TFunction } from 'next-i18next';
import { Trans } from 'react-i18next';
import { useTranslation } from '../common/i18n';
import { HeroTitle } from '../common/HeroTitle';

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
    title: t('landingFaq.pricingGroupTitle'),
    items: getPricingItems(t),
  },
  {
    title: t('landingFaq.adminGroupTitle'),
    items: getAdminItems(t),
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
          {getFaqGroups(t).map(group => {
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
});
