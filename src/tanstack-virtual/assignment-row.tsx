import { FC, ReactNode } from 'react';
import { IDisplayRow, IJob, DAY_COUNT } from './api';
import { JobBlock } from './job-block';

interface RowProps {
    rowData: IDisplayRow;
}

const groupJobsByDays = (jobs: IJob[]): Map<number, IJob[]> => {
    const map = new Map<number, IJob[]>();
    jobs.forEach(job => {
        const jobsOnDay = [...(map.get(job.dayIndex) ?? []), job ];
        map.set(job.dayIndex, jobsOnDay);
    });

    return map;
}

export const AssignmentRow: FC<RowProps> = ({ rowData }) => {
    const { assignee, jobs } = rowData;
    const jobsBydays = groupJobsByDays(jobs);
    const colWidth = 100 / (DAY_COUNT + 1);

    const getColumns = () => {
        const cols: ReactNode[] = [];
        cols.push(<div style={{width: `${colWidth}%`}}>{assignee.name}</div>);
        for (let i=0; i<DAY_COUNT; i++) {
            const jobBlock: ReactNode[] = [];
            const jobs = (jobsBydays.get(i) ?? []);
            for (let j=0; j<jobs.length; j++) {
                jobBlock.push(<JobBlock />);
            }
            cols.push(<div style={{width: `${colWidth}%`}}>{jobBlock}</div>)
        }
        return cols;
    }
    
    return <div style={{
        border: '1px solid #000',
        display: 'flex',
        flexDirection: 'row',
    }}>
        {
            getColumns()
        }
    </div>
};