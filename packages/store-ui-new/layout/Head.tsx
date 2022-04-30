import React from "react";
import {
  NextSeo,
  NextSeoProps,
  ArticleJsonLd,
  CorporateContactJsonLd,
  FAQPageJsonLd,
  ProductJsonLd,
} from "next-seo";
import { Store } from "../domain/store";
import { Media } from "../domain/media";

type OpenGraph = Exclude<NextSeoProps["openGraph"], undefined>;

export interface HeadBaseProps {
  store: Pick<Store, "slug" | "customDomain" | "name" | "contact" | "logo">;
  title: string;
  description?: string;
  logo?: Media;
  titlePrefix?: string;
  canonical?: NextSeoProps["canonical"];
  url: OpenGraph["url"];
  images?: Media[];
  article?: OpenGraph["article"];
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
  logo,
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

  const contact = store?.contact;
  const fullUrl = `${homeUrl}${url}`;
  const mappedImages: OpenGraph["images"] = (images ?? []).map((image) => ({
    url: image.defaultUrl ?? "",
    width: image.width,
    height: image.height,
    type: image.mimeType,
  }));
  const imageUrls = mappedImages.map((x) => x.url);

  return (
    <>
      <NextSeo
        title={title}
        titleTemplate={titlePrefix ? `${titlePrefix} | %s` : "%s"}
        description={description}
        canonical={canonical}
        openGraph={{
          type: article ? "article" : "website",
          url: fullUrl,
          images:
            mappedImages ??
            (logo
              ? [
                  {
                    url: logo.defaultUrl ?? "",
                    width: logo.width,
                    height: logo.height,
                    type: logo.mimeType,
                  },
                ]
              : []),
          article,
          site_name: name,
        }}
        twitter={{
          cardType: "summary",
        }}
      />
      {article && (
        <ArticleJsonLd
          url={fullUrl}
          title={title}
          images={imageUrls}
          datePublished={article.publishedTime ?? ""}
          dateModified={article.modifiedTime}
          authorName={article.authors as string[]}
          publisherName={name}
          publisherLogo={logo?.defaultUrl}
          description={description ?? ""}
        />
      )}
      {contact && (
        <CorporateContactJsonLd
          url={homeUrl}
          logo={logo?.defaultUrl}
          contactPoint={[
            {
              telephone: contact.phoneNumber,
              contactType: "technical support",
            },
            ...(contact.alternatePhoneNumber
              ? [
                  {
                    telephone: contact.alternatePhoneNumber,
                    contactType: "technical support",
                  },
                ]
              : []),
          ]}
        />
      )}
      {faq && <FAQPageJsonLd mainEntity={faq} />}
      {product && <ProductJsonLd {...product} images={imageUrls} />}
    </>
  );
};
