import { FC, forwardRef } from 'react';
import { FixedSizeList } from 'react-window';
import { Row } from './row';

interface ListProps {
  onItemsRendered: Function;
}

export const List: FC<ListProps> = forwardRef((props, ref) => {
  return (
    <FixedSizeList
      style={{ border: '1px solid #000' }}
      height={150}
      itemCount={1000}
      itemSize={30}
      onItemsRendered={props.onItemsRendered}
      ref={ref}
      width={300}
      overscanCount={20}
    >
      {Row}
    </FixedSizeList>
  );
});
