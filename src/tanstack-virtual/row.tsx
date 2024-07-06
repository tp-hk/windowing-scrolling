import { FC } from 'react';
import { IDisplayRow, RowType } from './api';
import { AssignmentRow } from './assignment-row';

interface RowProps {
    data: IDisplayRow;
}

export const Row: FC<RowProps> = ({ data }) => {
    const { rowType, rowData } = data;
    if (rowType === RowType.LeadRow) {
        return <div style={{
            height: `30px`,
            border: '1px solid #000',
            background: '#323232',
            color: '#fff',
        }}>{rowData!.assignee.name}</div>
    }

    if (rowType === RowType.AssignmentRow) {
        return <AssignmentRow rowData={rowData!}/>;
    }

    if (rowType === RowType.LoadingRow) {
        return 'Loading...';
    }

    return null;
};