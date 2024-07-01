import { faker } from '@faker-js/faker';
import { IAssignee, IJob, IAssigneeJobs } from './api';

const ITEM_COUNT = 1000;
export const DAY_COUNT = 7;
let cachedData: IAssigneeJobs[] = [];

export const getData = (): IAssigneeJobs[] => {
    if (cachedData.length > 0) {
        return cachedData;
    }
    
    const data: IAssigneeJobs[] = [];

    for (let index = 0; index <= ITEM_COUNT; index++) {
        const assignee = createAssignee();
        const jobs = createJobsForDays(DAY_COUNT);
        if (index % 10 === 0) {
          // push an additional artifician row to create lead row
          data.push({
            assignee: {
                ...assignee,
                isLead: true,
            },
            jobs,
          });          
        }
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
