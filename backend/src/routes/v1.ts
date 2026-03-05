import { Router } from 'express';
import { apiModules } from '../modules';

const v1Router = Router();

for (const moduleDef of apiModules) {
  if ('router' in moduleDef) {
    v1Router.use(moduleDef.path, moduleDef.router);
    continue;
  }

  for (const router of moduleDef.routers) {
    v1Router.use(moduleDef.path, router);
  }
}

export default v1Router;
