import { IDisplayRow, RowType } from './api';
import { AssignmentRow } from './assignment-row';
import { LeadRow } from './lead-row';
import { LoadingRow } from './loading-row';

interface RowProps {
    row: IDisplayRow;
    // should be shared via context to avoid props drilling
    fetchData: () => Promise<void>;
}

export const getRow = ({ row, fetchData }: RowProps) => {
    const { rowType, rowData } = row;

    if (rowType === RowType.LeadRow && rowData) {
        return <LeadRow assigneeJobs={rowData} />
    }

    if (rowType === RowType.AssignmentRow) {
        return <AssignmentRow assigneeJobs={rowData!} />;
    }

    if (rowType === RowType.LoadingRow) {
        return <LoadingRow fetchData={fetchData} />
    }

    return null;
};