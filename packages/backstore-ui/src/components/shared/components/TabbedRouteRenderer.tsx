import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { Tabs, Flex, Title, TabsProps } from '@sradevski/blocks-ui';

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
    <Flex flexDirection='column' px={[3, 3, 4]} py={2}>
      {title && (
        <Title mb={3} level={2}>
          {title}
        </Title>
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
