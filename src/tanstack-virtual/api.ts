// import { createContext } from 'react';
import { faker } from '@faker-js/faker';

export const LOADING = 1;
export const LOADED = 2;
const ITEM_COUNT = 1000;
export const DAY_COUNT = 3;

export interface IJob {
    id: number;
    location: string;
    dayIndex: number;
}

export interface IAssignee {
    id: number;
    name: string;
    isLead: boolean;
    leadId: number;
}

export interface IAssigneeJobs {
    assignee: IAssignee;
    jobs: IJob[]
}

export interface IDisplayRow extends IAssigneeJobs {
    isLeadRow: boolean;
}

// export const DataContext = createContext<IData>({
//   rowMap: new Map(),
//   updateMap: (_: IEdits) => {}
// });

export const fetch = (startIndex: number, stopIndex: number): Promise<IAssigneeJobs[]> => {
    return new Promise((resolve) =>
      setTimeout(() => {
        resolve(data.slice(startIndex, stopIndex));
      }, 200)
    );
  };

let cachedData: IAssigneeJobs[] = [];
const getData = (): IAssigneeJobs[] => {
    if (cachedData.length > 0) {
        return cachedData;
    }
    
    const data: IAssigneeJobs[] = [];

    let lastLeadId = -1;
    for (let index = 0; index < ITEM_COUNT; index++) {
        const isLead = index % 10 === 0;
        const assignee = createAssignee();
        if (isLead) {
            assignee.isLead = true;
            assignee.leadId = assignee.id;
            lastLeadId = assignee.id; 
        } else {
            assignee.leadId = lastLeadId;
        }
        
        const jobs = createJobsForDays(assignee.id) as IJob[];

        data.push({
            assignee,
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

const createJobs = (jobCount: number, assignee: number): IJob[] => {
    return Array.from({
        length: jobCount
    }, () => {
        return {
            id: faker.number.int(),
            dayIndex: faker.number.int({
                min: 0,
                max: DAY_COUNT - 1
            }),
            location: faker.location.city(),
            assignee,
          }
    });
}

const createJobsForDays = (assignee: number): IJob[] => {
    const jobs: IJob[] = [];
    const jobCount = faker.number.int({
        min: 0,
        max: 5,
    })
    const jobsForDay = createJobs(jobCount, assignee);
    jobs.push(...jobsForDay);

    return jobs;
}

export const data = getData();