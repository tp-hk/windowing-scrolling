import { faker } from '@faker-js/faker';

export enum RangeOption {
    Before,
    Within,
    After
}

export const LOADING = 1;
export const LOADED = 2;
const ITEM_COUNT = 1000;
export const DAY_COUNT = 3;

export interface IAssignee {
    id: number;
    name: string;
    isLead: boolean;
    leadId: number;
}

export interface IJob {
    id: number;
    location: string;
    dayIndex: number;
    assignee: number,
}

export interface IAssigneeJobs {
    assignee: IAssignee;
    jobs: IJob[]
}

export interface IDisplayRow {
    rowId: number;
    rowType: RowType;
    rowData: IAssigneeJobs | null;
}

export enum RowType {
    LeadRow,
    AssignmentRow,
    LoadingRow,
}

export const fetch = (startIndex: number, count: number): Promise<IAssigneeJobs[]> => {
    return new Promise((resolve) =>
      setTimeout(() => {
        resolve(data.slice(startIndex, startIndex + count));
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
        const assignee = createAssignee(isLead, lastLeadId);
        if (isLead) {
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

export const createAssignee = (isLead: boolean, leadId: number): IAssignee => {
    const id = faker.number.int();
    return {
        id,
        name: faker.person.firstName(),
        isLead,
        leadId: isLead? id : leadId,
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

export const createJobsForDays = (assignee: number): IJob[] => {
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