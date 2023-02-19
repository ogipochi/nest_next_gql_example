import { faker } from '@faker-js/faker';
import { Injectable } from '@nestjs/common';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { JobEntity, Job } from './entities/job.entity';

@Injectable()
export class JobsService {
  private jobs: Job[] = new Array<Job>();

  constructor() {
    for (let index = 1; index < 10000; index++) {
      this.jobs.push({
        id: index,
        name: faker.company.name(),
        salary: faker.datatype.number(),
        nowHiring: faker.datatype.boolean(),
      });
    }
  }

  create(createJobDto: CreateJobDto): Job {
    const job: Job = {
      id: this.jobs.length + 1,
      name: faker.company.name(),
      salary: faker.datatype.number(),
      nowHiring: faker.datatype.boolean(),
    };
    this.jobs.push(job);

    return job;
  }

  findAll(): Job[] {
    const jobs: Job[] = [];

    for (let index = 1; index < faker.datatype.number(); index++) {
      jobs.push({
        id: index,
        name: faker.company.name(),
        salary: faker.datatype.number(),
        nowHiring: faker.datatype.boolean(),
      });
    }

    return jobs;
  }

  findOne(id: number) {
    return this.jobs.filter((c) => c.id === id);
  }

  update(id: number, updateJobDto: UpdateJobDto) {
    this.jobs = this.jobs.map((c) => {
      if (c.id === id) {
        return {
          ...c,
          ...updateJobDto,
        };
      }
      return c;
    });
  }
  remove(id: number) {
    this.jobs = this.jobs.filter((c) => c.id !== id);
  }
}
