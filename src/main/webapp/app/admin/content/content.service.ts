import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApplicationConfigService } from '../../core/config/application-config.service';
import { getContentIdentifier, IContent } from './content.model';

export type EntityResponseType = HttpResponse<IContent>;
export type EntityArrayResponseType = HttpResponse<IContent[]>;

@Injectable({ providedIn: 'root' })
export class ContentService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/contents');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  query(): Observable<EntityArrayResponseType> {
    return this.http.get<IContent[]>(this.resourceUrl, { observe: 'response' });
  }

  create(content: IContent): Observable<EntityResponseType> {
    return this.http.post<IContent>(this.resourceUrl, content, { observe: 'response' });
  }

  update(content: IContent): Observable<EntityResponseType> {
    return this.http.put<IContent>(`${this.resourceUrl}/${getContentIdentifier(content) as number}`, content, { observe: 'response' });
  }
}
