export interface ITopic {
  id?: number;
  title?: string;
  description?: string;
}

export class Topic implements ITopic {
  constructor(public id?: number, public title?: string, public description?: string) {}
}

export function getTopicIdentifier(topic: ITopic): number | undefined {
  return topic.id;
}
