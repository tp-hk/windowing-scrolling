import { FC } from 'react';
import { LOADING, itemStatusMap } from './item-status-map';

interface RowProps {
  index: number;
  style: CSSStyleRule;
}

export const Row: FC<RowProps> = (props) => {
  const { index, style } = props;
  const rowStyle = {
    ...style,
    borderBottom: '1px solid #000'
  };
  const row = itemStatusMap.get(index);

  if (!row || row.status === LOADING) {
    return <div style={rowStyle}>Loading...</div>
  }

  return <div style={rowStyle}>{row.assignments.assignee.name}: {row.assignments.jobs.flat().length} jobs</div>
};
