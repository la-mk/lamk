import React, { useState } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Button,
  Flex,
} from "@la-mk/blocks-ui";
import Link from "next/link";

export interface BreadcrumbEntry {
  urlPattern?: string;
  url: string;
  title: string;
}

export const BreadcrumbsContext = React.createContext<
  (setBreadcrumbs: BreadcrumbEntry[]) => void
>(() => {});

export const BreadcrumbsProvider = ({
  children,
}: {
  children: React.ReactElement;
}) => {
  const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbEntry[]>([]);

  return (
    <BreadcrumbsContext.Provider value={setBreadcrumbs}>
      {breadcrumbs.length <= 1 ? (
        children
      ) : (
        <>
          <Flex
            align="center"
            px={[4, 6, 7]}
            minHeight={"56px"}
            width="100%"
            bg="background.light"
          >
            <Breadcrumb separator=">">
              {breadcrumbs.map((breadcrumb, index) => {
                return (
                  <BreadcrumbItem
                    isCurrentPage={index === breadcrumbs.length - 1}
                    key={breadcrumb.url}
                  >
                    <BreadcrumbLink
                      href={breadcrumb.urlPattern ?? breadcrumb.url}
                      as={({ href, ...props }) => (
                        <Link
                          passHref
                          href={breadcrumb.urlPattern ?? breadcrumb.url}
                          as={
                            breadcrumb.urlPattern ? breadcrumb.url : undefined
                          }
                        >
                          <Button as="a" variant="link" {...props} />
                        </Link>
                      )}
                    >
                      {breadcrumb.title}
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                );
              })}
            </Breadcrumb>
          </Flex>
          {children}
        </>
      )}
    </BreadcrumbsContext.Provider>
  );
};
