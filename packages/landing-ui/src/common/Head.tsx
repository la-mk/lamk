import React from 'react';
import {
  NextSeo,
  NextSeoProps,
  ArticleJsonLd,
  CorporateContactJsonLd,
  FAQPageJsonLd,
  ProductJsonLd,
} from 'next-seo';

export interface HeadBaseProps {
  title: string;
  description: string;
  url: NextSeoProps['openGraph']['url'];
  canonical?: NextSeoProps['canonical'];
  homeUrl?: string;
  name?: NextSeoProps['openGraph']['site_name'];
  logoUrl?: string;
  titlePrefix?: string;
  images?: NextSeoProps['openGraph']['images'];
  contact?: {
    phoneNumber: string;
    alternatePhoneNumber?: string;
  };
  article?: NextSeoProps['openGraph']['article'];
  faq?: Array<{ questionName: string; acceptedAnswerText: string }>;
  product?: {
    productName: string;
    images: string[];
    description?: string;
    sku?: string;
    offers: Array<{
      price: string;
      priceCurrency: string;
      url: string;
    }>;
  };
}

export const Head = ({
  url,
  homeUrl = 'https://la.mk',
  name = 'la.mk',
  logoUrl = 'https://la.mk/logo-padding.png',
  title,
  titlePrefix,
  description,
  canonical,
  images = [{ url: 'https://la.mk/logo-padding.png' }],
  article,
  contact = {
    phoneNumber: '+389 77 647 585',
  },
  faq,
  product,
}: HeadBaseProps) => {
  return (
    <>
      <NextSeo
        title={title}
        titleTemplate={titlePrefix ? `${titlePrefix} | %s` : '%s'}
        description={description}
        canonical={canonical}
        openGraph={{
          type: article ? 'article' : 'website',
          url,
          images,
          article,
          site_name: name,
        }}
        twitter={{
          cardType: 'summary',
        }}
      />
      {article && (
        <ArticleJsonLd
          url={url}
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
        <ProductJsonLd
          {...product}
          offers={product.offers.map(x => ({ ...x, seller: { name } }))}
        />
      )}
    </>
  );
};
