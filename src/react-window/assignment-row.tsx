import { FC, CSSProperties } from 'react';
import { IAssigneeJobs } from './api';
import { Cell } from './cell';

interface AssignmentRowProps {
  style: CSSStyleRule;
  assignments: IAssigneeJobs;
}

export const AssignmentRow: FC<AssignmentRowProps> = ({ style, assignments }) => {
  const { assignee, jobs } = assignments;

  const rowStyle: CSSProperties = {
    ...style,
    borderBottom: '1px solid #000',
    display: 'flex',
    flexDirection: 'row',
  };

  const colStyle = {
    width: `${100/(jobs.length + 1)}%`
  };

  return <div style={rowStyle}>
    <Cell style={colStyle}>{assignee.name}</Cell>
    {
        jobs.map(jobsOnDay => {
            return <Cell style={colStyle}>{jobsOnDay.length} jobs</Cell>
        })
    }
  </div>;
}
