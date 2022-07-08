import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'app/shared/shared.module';
import { ContentComponent } from './content.component';
import { contentRoute } from './content.route';

@NgModule({
  imports: [SharedModule, RouterModule.forChild([contentRoute])],
  declarations: [ContentComponent],
})
export class ContentModule {}
