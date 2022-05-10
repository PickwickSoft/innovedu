import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IFile, File } from '../file.model';
import { FileService } from '../service/file.service';

@Injectable({ providedIn: 'root' })
export class FileRoutingResolveService implements Resolve<IFile> {
  constructor(protected service: FileService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IFile> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((file: HttpResponse<File>) => {
          if (file.body) {
            return of(file.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new File());
  }
}
