import { FC, CSSProperties, ReactNode } from 'react';
import { IJob } from './api';
import { JobBlock } from './job-block';

interface CellProps {
    children: ReactNode;
    style?: CSSProperties;
    jobsInOneDay?: IJob[];
}

export const Cell: FC<CellProps> = (props) => {
  const colStyle: CSSProperties = {
    ...(props.style ?? {}),
    borderRight: '1px solid #323232',
    borderLeft: '1px solid #323232'
  }
  if (!props.jobsInOneDay) {
    return <div style={colStyle}>{props.children}</div>
  }

  return <div style={{
    ...colStyle,
    display: 'flex',
    flexDirection: 'column'
  }}>{
    props.jobsInOneDay.map((_, index) => <JobBlock key={index}/>)
  }</div>
}
