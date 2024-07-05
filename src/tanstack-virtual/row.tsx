import { FC } from 'react';
import { IDisplayRow } from './api';
import { AssignmentRow } from './assignment-row';

interface RowProps {
    rowData: IDisplayRow;
}

export const Row: FC<RowProps> = ({ rowData }) => {
    const { assignee, isLeadRow } = rowData;
    if (isLeadRow) {
        return <div style={{
            height: `30px`,
            border: '1px solid #000',
            background: '#323232',
            color: '#fff',
        }}>{assignee.name}</div>
    }

    return <AssignmentRow rowData={rowData}/>
};