import { createContext } from 'react';
import { faker } from '@faker-js/faker';

export const LOADING = 1;
export const LOADED = 2;
const ITEM_COUNT = 1000;
export const DAY_COUNT = 3;

export interface IJob {
    id: number;
    location: string;
}

export interface IAssignee {
    id: number;
    name: string;
    isLead: boolean;
    leadId?: number;
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

export interface IEdits {
  add?: any;
  delete?: Map<number, IRow>;
  update?: any;
}

interface IData {
  rowMap: Map<number, IRow>;
  updateMap: (edits: IEdits) => void;
}

export const DataContext = createContext<IData>({
  rowMap: new Map(),
  updateMap: (_: IEdits) => {}
});

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

let cachedData: IAssigneeJobs[] = [];
const getData = (): IAssigneeJobs[] => {
    if (cachedData.length > 0) {
        return cachedData;
    }
    
    const data: IAssigneeJobs[] = [];

    let lastLeadId: number | undefined = undefined;
    for (let index = 0; index <= ITEM_COUNT; index++) {
        const assignee = createAssignee();
        const jobs = createJobsForDays(DAY_COUNT);
        if (index % 10 === 0) {
          // push an additional artifician row to create lead row
          lastLeadId = assignee.id;
          data.push({
            assignee: {
                ...assignee,
                isLead: true,
            },
            jobs,
          });          
        }
        data.push({
            assignee: {
                ...assignee,
                leadId: lastLeadId,
            },
            jobs,
          });
      };

      cachedData = data;
      return cachedData;
}

const createAssignee = (): IAssignee => {
    return {
        id: faker.number.int(),
        name: faker.person.firstName(),
        isLead: false,
        leadId: -1,
      };
  }

const createJobs = (count: number): IJob[] => {
    return Array.from({
        length: count
    }, () => {
        return {
            id: faker.number.int(),
            location: faker.location.city(),
          }
    });
}

const createJobsForDays = (dayCount: number): IJob[][] => {
    const jobs: IJob[][] = [];
    for (let i = 0; i < dayCount; i++) {
        const jobCount = faker.number.int({
            min: 0,
            max: 5,
        })
        const jobsForDay = createJobs(jobCount);
        jobs.push(jobsForDay);
    }

    return jobs;
}

export const data = getData();