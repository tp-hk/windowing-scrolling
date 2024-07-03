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
    columnGap: '2px'
  };

  const colStyle = {
    width: `${100/(jobs.length + 1)}%`
  };

  return <div style={rowStyle}>
    <Cell style={colStyle}>{assignee.name}: {jobs.map(jobsOnDay => jobsOnDay.length).join(', ')}</Cell>
    {
        jobs.map((jobsOnDay, index) => {
            return <Cell key={index} style={colStyle} jobsInOneDay={jobsOnDay}>{jobsOnDay.length} jobs</Cell>
        })
    }
  </div>;
}
