import React from 'react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Button,
  Flex,
} from '@la-mk/blocks-ui';
import { useSelector } from 'react-redux';
import { BreadcrumbEntry } from '../../state/modules/ui/ui.module';
import { getBreadcrumbs } from '../../state/modules/ui/ui.selector';
import Link from 'next/link';

export const Breadcrumbs = props => {
  const breadcrumbs: BreadcrumbEntry[] = useSelector(getBreadcrumbs);

  if (breadcrumbs.length <= 1) {
    return null;
  }

  return (
    <Flex
      align='center'
      px={[4, 6, 7]}
      width='100%'
      bg='background.light'
      {...props}
    >
      <Breadcrumb separator='>'>
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
                    href={href}
                    as={breadcrumb.urlPattern ? breadcrumb.url : undefined}
                  >
                    <Button as='a' variant='link' {...props} />
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
};
