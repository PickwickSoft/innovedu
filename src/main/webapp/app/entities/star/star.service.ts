import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApplicationConfigService } from '../../core/config/application-config.service';
import { IStar } from './star.model';

@Injectable({ providedIn: 'root' })
export class StarService {
  private resourceUrl = this.applicationConfigService.getEndpointFor('api/stars');

  constructor(private http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  queryProjectStars(id: string): Observable<HttpResponse<number>> {
    return this.http.get<number>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  queryIsProjectStarred(id: string): Observable<HttpResponse<boolean>> {
    return this.http.get<boolean>(`${this.resourceUrl}/isStared/${id}`, { observe: 'response' });
  }

  unstarProject(id: string): Observable<HttpResponse<{}>> {
    return this.http.delete<number>(`${this.resourceUrl}/unstar/${id}`, { observe: 'response' });
  }

  starProject(id: string): Observable<IStar> {
    return this.http.post<IStar>(`${this.resourceUrl}/star/${id}`, { observe: 'response' });
  }
}
