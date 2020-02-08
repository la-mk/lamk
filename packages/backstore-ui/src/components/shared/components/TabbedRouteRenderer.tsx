import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { Tabs, Flex, Title } from '@sradevski/blocks-ui';

interface TabbedRouteProps
  extends Pick<RouteComponentProps<{ tab?: string }>, 'match' | 'history'> {
  title?: string;
  children: React.ReactNode;
}

export const TabbedRouteRenderer = ({
  match,
  history,
  title,
  children,
}: TabbedRouteProps) => {
  return (
    <Flex flexDirection='column' px={[3, 3, 4]} py={2}>
      {title && (
        <Title mb={3} level={2}>
          {title}
        </Title>
      )}
      <Tabs
        animated={false}
        activeKey={match.params.tab}
        onChange={(tab: string) => history.push(tab)}
      >
        {children}
      </Tabs>
    </Flex>
  );
};
