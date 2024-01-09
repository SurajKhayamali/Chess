import { Route } from 'universal-router';

export interface IRoute extends Route {
  action?: () => Promise<{
    component: string;
    loadScripts?: () => HTMLScriptElement;
  }>;
  children?: IRoute[];
}
