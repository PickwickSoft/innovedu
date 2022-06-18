import dayjs from 'dayjs/esm';
import { IUser } from 'app/entities/user/user.model';
import { ITopic } from 'app/teacher/topic/topic.model';

export interface IProject {
  id?: number;
  title?: string;
  description?: string;
  stars?: number | null;
  approved?: boolean;
  date?: dayjs.Dayjs | null;
  user?: IUser | null;
  topic?: ITopic | null;
}

export class Project implements IProject {
  constructor(
    public id?: number,
    public title?: string,
    public description?: string,
    public stars?: number | null,
    public approved?: boolean,
    public date?: dayjs.Dayjs | null,
    public user?: IUser | null,
    public topic?: ITopic | null
  ) {
    this.approved = this.approved ?? false;
  }
}

export function getProjectIdentifier(project: IProject): number | undefined {
  return project.id;
}
