import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { FileComponent } from './list/file.component';
import { FileDetailComponent } from './detail/file-detail.component';
import { FileUpdateComponent } from './update/file-update.component';
import { FileDeleteDialogComponent } from './delete/file-delete-dialog.component';
import { FileRoutingModule } from './route/file-routing.module';

@NgModule({
  imports: [SharedModule, FileRoutingModule],
  declarations: [FileComponent, FileDetailComponent, FileUpdateComponent, FileDeleteDialogComponent],
  entryComponents: [FileDeleteDialogComponent],
})
export class FileModule {}
