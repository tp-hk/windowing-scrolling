import { FC } from 'react';
import { LOADED, itemStatusMap } from './item-status-map';

interface RowProps {
  index: number;
  style: CSSStyleRule;
}

export const Row: FC<RowProps> = (props) => {
  const { index, style } = props;
  let label = '';
  if (itemStatusMap[index] === LOADED) {
    label = `Row ${index}`;
  } else {
    label = 'Loading...';
  }
  return <div style={style}>{label}</div>;
};
