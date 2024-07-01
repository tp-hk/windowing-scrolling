import { FC, Fragment } from 'react';
import { IAssignee, IAssigneeJobs, LOADING, itemStatusMap } from './api';

interface RowProps {
  index: number;
  style: CSSStyleRule;
}

interface LeadRowProps {
  style: CSSStyleRule;
  assignee: IAssignee;
}

interface AssignmentRowProps {
  style: CSSStyleRule;
  assignments: IAssigneeJobs;
}

const LeadRow: FC<LeadRowProps> = ({ style = {}, assignee }) => {
  const { name } = assignee;

  const rowStyle = {
    ...style,
    borderBottom: '1px solid #000',
    backgroundColor: 'grey',
    fontWeight: 700,
  };
  return <div style={rowStyle}>{name} team</div>;
}


const AssignmentRow: FC<AssignmentRowProps> = ({ style = {}, assignments }) => {
  const { assignee, jobs } = assignments;

  const rowStyle = {
    ...style,
    borderBottom: '1px solid #000'
  };
  return <div style={rowStyle}>{assignee.name}: {jobs.flat().length} jobs</div>;
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
