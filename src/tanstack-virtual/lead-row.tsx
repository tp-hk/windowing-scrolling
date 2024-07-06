import { FC } from 'react';
import { IDisplayRow } from './api';

interface RowProps {
    data: IDisplayRow;
}

export const LeadRow: FC<RowProps> = ({ data }) => {
    const { rowData } = data;
    return (
        <div style={{
            height: `30px`,
            border: '1px solid #000',
            background: '#323232',
            color: '#fff',
        }}>{rowData!.assignee.name}</div>
    );
};