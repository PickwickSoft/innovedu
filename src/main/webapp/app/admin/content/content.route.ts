import { Route } from '@angular/router';
import { ContentComponent } from './content.component';

export const contentRoute: Route = {
  path: '',
  component: ContentComponent,
  data: {
    pageTitle: 'content.title',
  },
};
