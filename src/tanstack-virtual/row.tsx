import { FC } from 'react';
import { IDisplayRow, RowType } from './api';
import { AssignmentRow } from './assignment-row';
import { LeadRow } from './lead-row';

interface RowProps {
    data: IDisplayRow;
}

export const Row: FC<RowProps> = ({ data }) => {
    const { rowType, rowData } = data;
    if (rowType === RowType.LeadRow) {
        return <LeadRow data={data} />
    }

    if (rowType === RowType.AssignmentRow) {
        return <AssignmentRow rowData={rowData!}/>;
    }

    if (rowType === RowType.LoadingRow) {
        return <div className="loadingUi">Loading...</div>;
    }

    return null;
};