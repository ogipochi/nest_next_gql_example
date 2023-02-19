export class JobEntity {
  name: string;
  salary: number;
  nowHiring: boolean;
}

export class Job extends JobEntity {
  id: number;
}
