import { FC, forwardRef, useEffect, useContext } from 'react';
import { VariableSizeList } from 'react-window';
import { Row } from './row';
import { DataContext, data } from './api';

interface ListProps {
  onItemsRendered: Function;
}

export const List: FC<ListProps> = forwardRef((props, ref) => {
  const { rowMap } = useContext(DataContext);
  
  // useEffect(() => { 
  //   console.log(`list: rowMapSize: ${rowMap?.size ?? 0}; resetAfterIndex? ${!!(ref?.current?.resetAfterIndex)}`)
  //   !!rowMap?.size && (ref as any).current?.resetAfterIndex?.(0); 
  // }, [rowMap]);

  return (
    <VariableSizeList
      style={{ border: '1px solid #000' }}
      height={500}
      itemCount={1000}
      itemSize={(index: number) => {
        const assignments = data[index];

        if (!assignments) {
          return 0;
        }

        // fixed size if lead row
        if (assignments.assignee.isLead) {
          return 30;
        }

        // variable size if non-lead row
        let maxJobCount = 0;
        assignments.jobs.forEach((jobsOnDay) => {
          if (jobsOnDay.length > maxJobCount) {
            maxJobCount = jobsOnDay.length;
          }
        });

        return maxJobCount * 30;
      }}
      onItemsRendered={(data: any) => {
        props.onItemsRendered(data);
      }}
      ref={ref}
      width="100%"
      overscanCount={5}
    >
      {Row}
    </VariableSizeList>
  );
});
