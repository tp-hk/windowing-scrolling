import { FC } from 'react';
import InfiniteLoader from 'react-window-infinite-loader';
import { itemStatusMap, fetch } from './api';
import { List } from './list';

const isItemLoaded = (index: number) => !!(itemStatusMap.get(index)?.status);

export const Loader: FC = () => {
  return (
    <InfiniteLoader
      isItemLoaded={isItemLoaded}
      itemCount={1000}
      loadMoreItems={fetch}
    >
      {({ onItemsRendered, ref }) => (
        <List onItemsRendered={onItemsRendered} ref={ref} />
      )}
    </InfiniteLoader>
  );
};
