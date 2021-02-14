import { Faq, FaqGroup, FaqItem } from '../src/faq/Faq';
import { Head } from '../src/common/Head';
import { useTranslation } from '../src/common/i18n';
import { TFunction } from 'next-i18next';

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

function FaqPage() {
  const { t } = useTranslation();
  const faqGroups = getFaqGroups(t);
  return (
    <>
      <Head
        url='https://la.mk/faq'
        title={t('landing.faqPage')}
        description={t('landingFaq.heroExplanation')}
        faq={faqGroups
          .flatMap(group => group.items)
          .map(item => ({
            questionName: item.question,
            acceptedAnswerText: item.answer,
          }))}
      />
      <Faq faqGroups={faqGroups} />
    </>
  );
}

export default FaqPage;
