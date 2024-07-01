import { FC, forwardRef } from 'react';
// import { FixedSizeList as List } from 'react-window';
import InfiniteLoader from 'react-window-infinite-loader';
import { LOADING, LOADED, itemStatusMap } from './item-status-map';
import { List } from './list';

const isItemLoaded = (index: number) => !!itemStatusMap[index];

const fetch = (startIndex, stopIndex) => {
  for (let index = startIndex; index <= stopIndex; index++) {
    itemStatusMap[index] = LOADING;
  }
  return new Promise((resolve) =>
    setTimeout(() => {
      for (let index = startIndex; index <= stopIndex; index++) {
        itemStatusMap[index] = LOADED;
      }
      resolve(true);
    }, 200)
  );
};

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
