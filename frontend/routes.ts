import { Route } from '@vaadin/router';
import Role from './generated/com/example/application/data/Role';
import { appStore } from './stores/app-store';
import './views/helloworld/hello-world-view';
import './views/main-layout';

export type ViewRoute = Route & {
  title?: string;
  icon?: string;
  requiresLogin?: boolean;
  rolesAllowed?: Role[];
  children?: ViewRoute[];
};

export const hasAccess = (route: Route) => {
  const viewRoute = route as ViewRoute;
  if (viewRoute.requiresLogin && !appStore.loggedIn) {
    return false;
  }

  if (viewRoute.rolesAllowed) {
    return viewRoute.rolesAllowed.some((role) => appStore.isUserInRole(role));
  }
  return true;
};

export const views: ViewRoute[] = [
  // place routes below (more info https://vaadin.com/docs/latest/fusion/routing/overview)
  {
    path: '',
    component: 'hello-world-view',
    icon: '',
    title: '',
  },
  {
    path: 'hello',
    component: 'hello-world-view',
    icon: 'la la-globe',
    title: 'Hello World',
  },
  {
    path: 'about',
    component: 'about-view',
    icon: 'la la-file',
    title: 'About',
    action: async (_context, _command) => {
      await import('./views/about/about-view');
      return;
    },
  },
  {
    path: 'hello-world',
    component: 'hello-world2-view',
    rolesAllowed: [Role.ADMIN],
    icon: 'la la-map',
    title: 'Hello World2',
    action: async (_context, _command) => {
      if (!hasAccess(_context.route)) {
        return _command.redirect('login');
      }
      await import('./views/helloworld2/hello-world2-view');
      return;
    },
  },
];
export const routes: ViewRoute[] = [
  {
    path: 'login',
    component: 'login-view',
    icon: '',
    title: 'Login',
    action: async (_context, _command) => {
      await import('./views/login/login-view');
      return;
    },
  },

  {
    path: '',
    component: 'main-layout',
    children: [...views],
  },
];
