import { IProject } from 'app/entities/project/project.model';

export interface IFile {
  id?: number;
  type?: string;
  dataContentType?: string;
  data?: string;
  name?: string;
  dimension?: number;
  project?: IProject | null;
}

export class File implements IFile {
  constructor(
    public id?: number,
    public type?: string,
    public dataContentType?: string,
    public data?: string,
    public name?: string,
    public dimension?: number,
    public project?: IProject | null
  ) {}
}

export function getFileIdentifier(file: IFile): number | undefined {
  return file.id;
}
