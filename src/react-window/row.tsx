import { FC } from 'react';
import { LOADING, itemStatusMap } from './api';
import { LeadRow } from './lead-row';
import { AssignmentRow } from './assignment-row';

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

  // must pass styles from parent to row

  const rowAssignments = row.assignments;
  const { assignee } = rowAssignments;

  if (assignee.isLead) {
    return <LeadRow style={style} assignee={assignee} />;
  }

    return <AssignmentRow style={style} assignments={rowAssignments} />

};
