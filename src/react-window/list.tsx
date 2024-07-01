import { FC, forwardRef } from 'react';
import { VariableSizeList } from 'react-window';
import { Row } from './row';
import { getData } from './fake-data-gen';

interface ListProps {
  onItemsRendered: Function;
}

const data = getData();

export const List: FC<ListProps> = forwardRef((props, ref) => {
  return (
    <VariableSizeList
      style={{ border: '1px solid #000' }}
      height={500}
      itemCount={1000}
      itemSize={(index: number) => {
        let maxJobCount = 0;
        data[index].jobs.forEach((jobsOnDay) => {
          if (jobsOnDay.length > maxJobCount) {
            maxJobCount = jobsOnDay.length;
          }
        });

        console.log(`height: ${(maxJobCount + 5) * 20}px`)
        return maxJobCount * 10 + 20;
      }}
      onItemsRendered={(data: any) => {
        console.log('itemsRendered');
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
