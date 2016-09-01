import { Routes } from '@angular/router';

import { HomeRoutes } from './+home/index';
import { DesignRoutes } from './+design/index';

export const routes: Routes = [
  ...HomeRoutes,
  ...DesignRoutes
];
