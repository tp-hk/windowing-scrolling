import { FC, Fragment } from 'react';
import { IAssignee, IAssigneeJobs, LOADING, itemStatusMap } from './item-status-map';

interface RowProps {
  index: number;
  style: CSSStyleRule;
}

interface LeadRowProps {
  assignee: IAssignee;
}

interface AssignmentRowProps {
  assignments: IAssigneeJobs;
}


const LeadRow: FC<LeadRowProps> = ({ assignee }) => {
  const rowStyle = {
    backgroundColor: 'grey'
  };
  return <div style={rowStyle}><button>Close</button> {assignee.name}</div>
}

const AssignmentRow: FC<AssignmentRowProps> = ({ assignments }) => {
  const { assignee, jobs } = assignments;

  const rowStyle = {
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

  const rowAssignments = row.assignments;
  const { assignee } = rowAssignments;

  // UI will break if trying to have 2 rows in one row
    return <Fragment>
      { assignee.isLead ? <LeadRow assignee={assignee}/> : null}
      <AssignmentRow assignments={rowAssignments} />
    </Fragment>

};
