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

        return maxJobCount * 10 + 20;
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
