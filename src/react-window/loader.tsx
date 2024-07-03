import { FC, useState } from 'react';
import InfiniteLoader from 'react-window-infinite-loader';
import { itemStatusMap, fetch, DataContext, IEdits } from './api';
import { List } from './list';


export const Loader: FC = () => {
  const isItemLoaded = (index: number) => !!(itemStatusMap.get(index)?.status);
  
  const [rowMap, setRowMap] = useState(new Map());
  return (
      <DataContext.Provider value={{
        rowMap,
        updateMap: (edits: IEdits) => {
          
          if (edits.delete) {
            setRowMap(edits.delete);
          }
        },
      }}>
        <InfiniteLoader
          isItemLoaded={isItemLoaded}
          itemCount={1000}
          loadMoreItems={async (start: number, end: number) => {
            await fetch(start, end);
            setRowMap(rowMap);
          }}
        >
          {({ onItemsRendered, ref }) => (
            <List onItemsRendered={onItemsRendered} ref={ref} />
          )}
        </InfiniteLoader>
      </DataContext.Provider>
  );
};
