import { IUser } from '../user/user.model';
import { IProject } from '../project/project.model';

export interface IStar {
  id?: number;
  project?: IProject;
  user?: IUser;
}

export class Star implements IStar {
  constructor(public id?: number, public project?: IProject, public user?: IUser) {}
}
