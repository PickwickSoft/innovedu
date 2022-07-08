export interface IContent {
  id?: number;
  projectSectionTitle?: string;
  projectSectionDescription?: string;
}

export class Content implements IContent {
  constructor(public id?: number, public projectSectionTitle?: string, public projectSectionDescription?: string) {}
}

export function getContentIdentifier(content: IContent): number | undefined {
  return content.id;
}
