import {
  Breadcrumb as ChakraBreadcrumb,
  BreadcrumbItem as ChakraBreadcrumbItem,
  BreadcrumbLink as ChakraBreadcrumbLink,
  BreadcrumbProps as ChakraBreadcrumbProps,
  BreadcrumbItemProps as ChakraBreadcrumbItemProps,
  BreadcrumbLinkProps as ChakraBreadcrumbLinkProps,
  SpaceProps,
  As,
} from '@chakra-ui/react';

export interface BreadcrumbProps
  extends Pick<ChakraBreadcrumbProps, 'separator' | 'children'>,
    SpaceProps {}

export interface BreadcrumbItemProps
  extends Pick<ChakraBreadcrumbItemProps, 'children' | 'isCurrentPage'> {}

export interface BreadcrumbLinkProps
  extends Pick<ChakraBreadcrumbLinkProps, 'href' | 'children'> {
  as?: As;
}

export const Breadcrumb = ChakraBreadcrumb as React.FunctionComponent<
  BreadcrumbProps
>;
export const BreadcrumbItem = ChakraBreadcrumbItem as React.FunctionComponent<
  BreadcrumbItemProps
>;
export const BreadcrumbLink = ChakraBreadcrumbLink as React.FunctionComponent<
  BreadcrumbLinkProps
>;
