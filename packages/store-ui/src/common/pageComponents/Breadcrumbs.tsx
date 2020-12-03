import React from 'react';
import {
  Breadcrumb,
  BreadcrumbItem,
  Box,
  BreadcrumbLink,
  Flex,
} from '@sradevski/blocks-ui';
import { useSelector } from 'react-redux';
import { BreadcrumbEntry } from '../../state/modules/ui/ui.module';
import { getBreadcrumbs } from '../../state/modules/ui/ui.selector';
import { HoverableLink } from '../../components/shared/components/HoverableLink';

export const Breadcrumbs = props => {
  const breadcrumbs = useSelector<BreadcrumbEntry[]>(getBreadcrumbs);

  if (breadcrumbs.length <= 1) {
    return null;
  }

  return (
    <Flex
      align='center'
      px={[3, 4, 5]}
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
                as={props => (
                  <HoverableLink
                    {...props}
                    as={breadcrumb.urlPattern ? breadcrumb.url : undefined}
                  />
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
