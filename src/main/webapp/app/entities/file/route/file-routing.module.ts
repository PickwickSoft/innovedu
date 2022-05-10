import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { FileComponent } from '../list/file.component';
import { FileDetailComponent } from '../detail/file-detail.component';
import { FileUpdateComponent } from '../update/file-update.component';
import { FileRoutingResolveService } from './file-routing-resolve.service';

const fileRoute: Routes = [
  {
    path: '',
    component: FileComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: FileDetailComponent,
    resolve: {
      file: FileRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: FileUpdateComponent,
    resolve: {
      file: FileRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: FileUpdateComponent,
    resolve: {
      file: FileRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(fileRoute)],
  exports: [RouterModule],
})
export class FileRoutingModule {}
