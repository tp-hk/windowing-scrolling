import { FC } from 'react';
import InfiniteLoader from 'react-window-infinite-loader';
import { LOADING, LOADED, itemStatusMap } from './item-status-map';
import { List } from './list';
import { getData } from './fake-data-gen';

const isItemLoaded = (index: number) => !!(itemStatusMap.get(index)?.status);
const data = getData();

const fetch = (startIndex: number, stopIndex: number) => {
  for (let index = startIndex; index <= stopIndex; index++) {
    if (itemStatusMap.get(index)) {
      itemStatusMap.get(index)!.status = LOADING;
    }
  }
  return new Promise((resolve) =>
    setTimeout(() => {
      for (let index = startIndex; index <= stopIndex; index++) {
        itemStatusMap.set(index, {
          status: LOADED,
          assignments: data[index],
        });
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
