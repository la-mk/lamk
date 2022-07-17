import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Button,
  Flex,
} from "@la-mk/blocks-ui";
import Link from "next/link";
import React from "react";
import { isEqual } from "lodash";

export interface BreadcrumbEntry {
  urlPattern?: string;
  url: string;
  title: string;
}

export const Breadcrumbs = React.memo(
  ({ breadcrumbs }: { breadcrumbs: BreadcrumbEntry[] }) => {
    if (breadcrumbs.length <= 1) {
      return null;
    }

    return (
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
                key={breadcrumb.url || index}
              >
                <BreadcrumbLink
                  href={breadcrumb.urlPattern ?? breadcrumb.url}
                  as={({ href, ...props }) => (
                    <Link
                      passHref
                      href={breadcrumb.urlPattern ?? breadcrumb.url}
                      as={breadcrumb.urlPattern ? breadcrumb.url : undefined}
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
    );
  },
  (prev, next) => isEqual(prev, next)
);

Breadcrumbs.displayName = "Breadcrumbs";
