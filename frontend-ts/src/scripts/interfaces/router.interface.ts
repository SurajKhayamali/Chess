import { Route, RouteContext } from 'universal-router';

export interface IRoute extends Route {
  action?: (context?: RouteContext) => Promise<{
    component: string;
    loadScripts?: () => HTMLScriptElement;
    afterInitialize?: () => void;
  }>;
  children?: IRoute[];
}
