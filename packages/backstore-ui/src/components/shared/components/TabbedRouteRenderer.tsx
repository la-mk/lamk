import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { Tabs, Flex, Heading, TabsProps } from '@sradevski/blocks-ui';

interface TabbedRouteProps
  extends Pick<RouteComponentProps<{ tab?: string }>, 'match' | 'history'> {
  title?: string;
  items: TabsProps['items'];
}

export const TabbedRouteRenderer = ({
  match,
  history,
  title,
  items,
}: TabbedRouteProps) => {
  const selectedTab = match.params.tab ?? '0';

  let tabIdx = React.useMemo(() => {
    let idx = 0;
    try {
      idx = parseInt(selectedTab);
      if (isNaN(idx) || idx > items.length - 1) {
        idx = 0;
      }
    } catch {}

    return idx;
  }, [selectedTab, items]);

  return (
    <Flex direction='column' px={[3, 3, 4]} py={2}>
      {title && (
        <Heading mb={4} as='h2'>
          {title}
        </Heading>
      )}
      <Tabs
        isExpandable={false}
        items={items}
        index={tabIdx}
        onChange={changedIdx => history.push(changedIdx.toString())}
      />
    </Flex>
  );
};
