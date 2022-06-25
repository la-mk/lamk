import React from 'react';
import {
  NextSeo,
  NextSeoProps,
  ArticleJsonLd,
  CorporateContactJsonLd,
  FAQPageJsonLd,
  ProductJsonLd,
} from 'next-seo';
import { Store } from '@la-mk/la-sdk/dist/models/store';
import { sdk } from '@la-mk/la-sdk';

export interface HeadBaseProps {
  store: Store;
  title: string;
  description?: string;
  canonical?: NextSeoProps['canonical'];
  url: NextSeoProps['openGraph']['url'];
  logoUrl?: string;
  titlePrefix?: string;
  images?: NextSeoProps['openGraph']['images'];
  article?: NextSeoProps['openGraph']['article'];
  faq?: Array<{ questionName: string; acceptedAnswerText: string }>;
  product?: {
    productName: string;
    description?: string;
    aggregateOffer: {
      lowPrice: string;
      highPrice: string;
      priceCurrency: string;
      offerCount: string;
    };
  };
}

export const Head = ({
  url,
  store,
  title,
  titlePrefix,
  description,
  canonical,
  images,
  article,
  faq,
  product,
}: HeadBaseProps) => {
  const homeUrl = store?.customDomain
    ? `https://${store.customDomain}`
    : `https://${store?.slug}.la.mk`;

  const name = store?.name ?? store?.slug;
  const logoUrl = sdk.artifact.getUrlForImage(store?.logo?._id, store?._id);
  const contact = store?.contact;
  const fullUrl = `${homeUrl}${url}`;

  return (
    <>
      <NextSeo
        title={title}
        titleTemplate={titlePrefix ? `${titlePrefix} | %s` : '%s'}
        description={description}
        canonical={canonical}
        openGraph={{
          type: article ? 'article' : 'website',
          url: fullUrl,
          images: images ?? [{ url: logoUrl }],
          article,
          site_name: name,
        }}
        twitter={{
          cardType: 'summary',
        }}
      />
      {article && (
        <ArticleJsonLd
          url={fullUrl}
          title={title}
          images={images?.map(x => x.url)}
          datePublished={article.publishedTime}
          dateModified={article.modifiedTime}
          authorName={article.authors as string[]}
          publisherName={name}
          publisherLogo={logoUrl}
          description={description}
        />
      )}
      {contact && (
        <CorporateContactJsonLd
          url={homeUrl}
          logo={logoUrl}
          contactPoint={[
            {
              telephone: contact.phoneNumber,
              contactType: 'technical support',
            },
            ...(contact.alternatePhoneNumber
              ? [
                  {
                    telephone: contact.alternatePhoneNumber,
                    contactType: 'technical support',
                  },
                ]
              : []),
          ]}
        />
      )}
      {faq && <FAQPageJsonLd mainEntity={faq} />}
      {product && (
        <ProductJsonLd {...product} images={images.map(x => x.url)} />
      )}
    </>
  );
};
