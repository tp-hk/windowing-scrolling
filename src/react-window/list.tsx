import { FC, forwardRef } from 'react';
import { VariableSizeList } from 'react-window';
import { Row } from './row';

interface ListProps {
  onItemsRendered: Function;
}

const rowHeights = new Array(1000)
  .fill(true)
  .map(() => 25 + Math.round(Math.random() * 50));
 
const getItemSize = (index: number) => rowHeights[index];

export const List: FC<ListProps> = forwardRef((props, ref) => {
  return (
    <VariableSizeList
      style={{ border: '1px solid #000' }}
      height={150}
      itemCount={1000}
      itemSize={getItemSize}
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
