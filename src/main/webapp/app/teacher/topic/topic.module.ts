import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { TopicComponent } from './list/topic.component';
import { TopicDetailComponent } from './detail/topic-detail.component';
import { TopicUpdateComponent } from './update/topic-update.component';
import { TopicDeleteDialogComponent } from './delete/topic-delete-dialog.component';
import { TopicRoutingModule } from './route/topic-routing.module';

@NgModule({
  imports: [SharedModule, TopicRoutingModule],
  declarations: [TopicComponent, TopicDetailComponent, TopicUpdateComponent, TopicDeleteDialogComponent],
  entryComponents: [TopicDeleteDialogComponent],
})
export class TopicModule {}
