import { IProject } from 'app/entities/project/project.model';

export interface IFile {
  id?: number;
  dataContentType?: string;
  data?: string;
  name?: string;
  project?: IProject | null;
}

export class File implements IFile {
  constructor(
    public id?: number,
    public dataContentType?: string,
    public data?: string,
    public name?: string,
    public project?: IProject | null
  ) {}
}

export function getFileIdentifier(file: IFile): number | undefined {
  return file.id;
}
