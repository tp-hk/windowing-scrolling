export const LOADING = 1;
export const LOADED = 2;

export interface IJob {
    id: number;
    location: string;
}

export interface IAssignee {
    id: number;
    name: string;
    isLead: boolean;
}

export interface IAssigneeJobs {
    assignee: IAssignee;
    jobs: IJob[][]
}

interface IRow {
    status: number;
    assignments: IAssigneeJobs;
}

export const itemStatusMap: Map<number, IRow> = new Map();
