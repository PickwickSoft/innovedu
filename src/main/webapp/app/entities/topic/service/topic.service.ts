import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ITopic, getTopicIdentifier } from '../topic.model';

export type EntityResponseType = HttpResponse<ITopic>;
export type EntityArrayResponseType = HttpResponse<ITopic[]>;

@Injectable({ providedIn: 'root' })
export class TopicService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/topics');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(topic: ITopic): Observable<EntityResponseType> {
    return this.http.post<ITopic>(this.resourceUrl, topic, { observe: 'response' });
  }

  update(topic: ITopic): Observable<EntityResponseType> {
    return this.http.put<ITopic>(`${this.resourceUrl}/${getTopicIdentifier(topic) as number}`, topic, { observe: 'response' });
  }

  partialUpdate(topic: ITopic): Observable<EntityResponseType> {
    return this.http.patch<ITopic>(`${this.resourceUrl}/${getTopicIdentifier(topic) as number}`, topic, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ITopic>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ITopic[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addTopicToCollectionIfMissing(topicCollection: ITopic[], ...topicsToCheck: (ITopic | null | undefined)[]): ITopic[] {
    const topics: ITopic[] = topicsToCheck.filter(isPresent);
    if (topics.length > 0) {
      const topicCollectionIdentifiers = topicCollection.map(topicItem => getTopicIdentifier(topicItem)!);
      const topicsToAdd = topics.filter(topicItem => {
        const topicIdentifier = getTopicIdentifier(topicItem);
        if (topicIdentifier == null || topicCollectionIdentifiers.includes(topicIdentifier)) {
          return false;
        }
        topicCollectionIdentifiers.push(topicIdentifier);
        return true;
      });
      return [...topicsToAdd, ...topicCollection];
    }
    return topicCollection;
  }
}
