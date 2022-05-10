import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { TopicComponent } from '../list/topic.component';
import { TopicDetailComponent } from '../detail/topic-detail.component';
import { TopicUpdateComponent } from '../update/topic-update.component';
import { TopicRoutingResolveService } from './topic-routing-resolve.service';

const topicRoute: Routes = [
  {
    path: '',
    component: TopicComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: TopicDetailComponent,
    resolve: {
      topic: TopicRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: TopicUpdateComponent,
    resolve: {
      topic: TopicRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: TopicUpdateComponent,
    resolve: {
      topic: TopicRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(topicRoute)],
  exports: [RouterModule],
})
export class TopicRoutingModule {}
