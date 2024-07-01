import { faker } from '@faker-js/faker';
import { IAssignee, IJob, IAssigneeJobs } from './item-status-map';

const ITEM_COUNT = 1000;
export const DAY_COUNT = 7;
export const createData = (): IAssigneeJobs[] => {
    
    const data = [];

    for (let index = 0; index <= ITEM_COUNT; index++) {
        const assignee = createAssignee();
        if (index % 10 === 0) {
          assignee.isLead = true;
        }
        data.push({
            assignee,
            jobs: createJobsForDays(DAY_COUNT),
          });
      };

      return data;
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
