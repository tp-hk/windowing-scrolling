import { FC, useState, useRef, useEffect } from 'react';
import InfiniteLoader from 'react-window-infinite-loader';
import { itemStatusMap, fetch, DataContext, IEdits, ItemStatusMap, data } from './api';
import { List } from './list';
import { VariableSizeList } from 'react-window';
import { Row } from './row';


export const Loader: FC = () => {
  const isItemLoaded = (index: number) => !!(itemStatusMap.get(index)?.status);
  
  const [rowMap, setRowMap] = useState<ItemStatusMap>(new Map());
  const loaderRef = useRef(null);

  useEffect(() => { 
    console.log(`loader: rowMapSize: ${rowMap?.size ?? 0}; resetAfterIndex? ${!!(loaderRef?.current?.resetAfterIndex)}`)
    !!rowMap.size && (loaderRef.current as any)?.resetAfterIndex?.(1); 
  }, [rowMap]);

  return (
      <DataContext.Provider value={{
        rowMap,
        updateMap: (edits: IEdits) => {
          
          if (edits.delete?.length) {
            const clonedMapArray = [...rowMap.values()];
            const clonedMap = new Map(rowMap);
            edits.delete.forEach((toDelId) => {
              const toDelIndex = clonedMapArray.findIndex(row => row.assignments.assignee.id === toDelId)
              clonedMap.delete(toDelIndex);
            })
            setRowMap(clonedMap);
          }
        },
      }}>
        <InfiniteLoader
          isItemLoaded={isItemLoaded}
          itemCount={1000}
          loadMoreItems={async (start: number, end: number) => {
            const map = await fetch(start, end);
            setRowMap(map);
          }}
        >
          {({ onItemsRendered, ref }) => <List onItemsRendered={onItemsRendered} ref={list => {
            ref(list);
            loaderRef.current = list;
          }}/>}
        </InfiniteLoader>
      </DataContext.Provider>
  );
};


// return <VariableSizeList
// style={{ border: '1px solid #000' }}
// height={500}
// itemCount={1000}
// itemSize={(index: number) => {
//   const assignments = data[index];

//   if (!assignments) {
//     return 0;
//   }

//   // fixed size if lead row
//   if (assignments.assignee.isLead) {
//     return 30;
//   }

//   // variable size if non-lead row
//   let maxJobCount = 0;
//   assignments.jobs.forEach((jobsOnDay) => {
//     if (jobsOnDay.length > maxJobCount) {
//       maxJobCount = jobsOnDay.length;
//     }
//   });

//   return maxJobCount * 30;
// }}
// onItemsRendered={(data: any) => {
//   onItemsRendered(data);
// }}
// ref={ref}
// width="100%"
// overscanCount={5}
// >
// {Row}
// </VariableSizeList>