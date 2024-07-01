import { getData } from './fake-data-gen';

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

const data = getData();

export const fetch = (startIndex: number, stopIndex: number): Promise<void> => {
    for (let index = startIndex; index <= stopIndex; index++) {
      if (itemStatusMap.get(index)) {
        itemStatusMap.get(index)!.status = LOADING;
      }
    }
    return new Promise((resolve) =>
      setTimeout(() => {
        for (let index = startIndex; index <= stopIndex; index++) {
          itemStatusMap.set(index, {
            status: LOADED,
            assignments: data[index],
          });
        }
        resolve();
      }, 200)
    );
  };
  