import React from 'react';
import { Breadcrumb, BreadcrumbItem, Box } from '@sradevski/blocks-ui';
import { useSelector } from 'react-redux';
import { HoverableLink } from '../../components/shared/components/HoverableLink';
import { BreadcrumbEntry } from '../../state/modules/ui/ui.module';
import { getBreadcrumbs } from '../../state/modules/ui/ui.selector';

export const Breadcrumbs = props => {
  const breadcrumbs = useSelector<BreadcrumbEntry[]>(getBreadcrumbs);

  if (breadcrumbs.length <= 1) {
    return null;
  }

  return (
    <Box px={[3, 4, 5]} py={3} width='100%' bg='background.light' {...props}>
      <Breadcrumb separator='>'>
        {breadcrumbs.map(breadcrumb => {
          return (
            <BreadcrumbItem key={breadcrumb.url}>
              <HoverableLink
                href={breadcrumb.urlPattern ?? breadcrumb.url}
                as={breadcrumb.urlPattern ? breadcrumb.url : undefined}
              >
                {breadcrumb.title}
              </HoverableLink>
            </BreadcrumbItem>
          );
        })}
      </Breadcrumb>
    </Box>
  );
};
