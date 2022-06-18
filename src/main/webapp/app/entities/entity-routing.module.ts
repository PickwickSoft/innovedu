import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'project',
        data: { pageTitle: 'innoveduApp.project.home.title' },
        loadChildren: () => import('./project/project.module').then(m => m.ProjectModule),
      },
      {
        path: 'file',
        data: { pageTitle: 'innoveduApp.file.home.title' },
        loadChildren: () => import('./file/file.module').then(m => m.FileModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
