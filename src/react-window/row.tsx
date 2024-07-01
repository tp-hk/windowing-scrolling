import { FC, Fragment } from 'react';
import { IAssignee, IAssigneeJobs, LOADING, itemStatusMap } from './item-status-map';

interface RowProps {
  index: number;
  style: CSSStyleRule;
}

interface LeadRowProps {
  style?: CSSStyleRule;
  assignee: IAssignee;
}

interface AssignmentRowProps {
  style?: CSSStyleRule;
  assignments: IAssigneeJobs;
}

const LeadRow: FC<LeadRowProps> = ({ style = {}, assignee }) => {
  const { name } = assignee;

  const rowStyle = {
    ...style,
    borderBottom: '1px solid #000',
    backgroundColor: 'grey',
    color: 'red'
  };
  return <div style={rowStyle}><button>close</button>{name}</div>;
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


  const rowAssignments = row.assignments;
  const { assignee } = rowAssignments;

    // must pass styles from parent to row
    return <Fragment>
      <div style={style}>
      {
        assignee.isLead ? <LeadRow assignee={assignee} /> : null 
      }
      <AssignmentRow assignments={rowAssignments} />
      </div>
    </Fragment>

};
