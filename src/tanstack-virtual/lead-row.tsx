import { FC } from 'react';
import { IAssigneeJobs, getDataIndex } from './api';

interface RowProps {
    assigneeJobs: IAssigneeJobs;
}

export const LeadRow: FC<RowProps> = ({ assigneeJobs: data }) => {
    const dataIndex = getDataIndex(data.assignee.id)
    return (
        <div style={{
            height: `30px`,
            border: '1px solid #000',
            background: '#323232',
            color: '#fff',
        }}>{data.assignee.name}</div>
    );
};