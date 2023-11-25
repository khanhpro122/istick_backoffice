// Libraries
import { lazy } from 'react';
import { TeamOutlined, UserOutlined } from '@ant-design/icons';
import { MenuProps } from 'antd';
import { RouteObject } from 'react-router-dom';

// Components
import Profile from '../views/app-components/account-profile/AccountProfile';
import { Counter } from '../views/app-components/counter/Counter';
import CreateEvent from '@/views/app-components/events/create-event/CreateEvent';
import ListEvent from '@/views/app-components/events/list-event/ListEvent';
import CreateResearch from '@/views/app-components/researchs/create-research/CreateResearch';
import ListResearch from '@/views/app-components/researchs/list-research/ListResearch';

// Pages
import Page404 from '../views/pages/result/Page404';
import DefaultLayout from '../layout/DefaultLayout';
import ListPackage from '@/views/app-components/packages/list-package/ListPackage';
import CreatePackage from '@/views/app-components/packages/create-package/CreatePackage';
import UsersSended from '@/views/app-components/events/sended-user/UserSended';
import ListJob from '@/views/app-components/jobs/list-job/ListJob';
import CreateJob from '@/views/app-components/jobs/create-job/CreateJob';
import CreateCompany from '@/views/app-components/companies/create-company/CreateCompany';
import ListCompany from '@/views/app-components/companies/list-company/ListCompany';

const LoginPage = lazy(() => import('../views/pages/login/LoginPage'));
const CreateUser = lazy(
  () =>
    import('../views/app-components/users-management/create-user/CreateUser')
);
const ListUser = lazy(
  () => import('../views/app-components/users-management/list-user/ListUser')
);

const UsersRegistered = lazy(
  () => import('@/views/app-components/events/user-registered/UsersRegistered')
);

const User = lazy(() => import('@/views/app-components/user/User'));
const Role = lazy(() => import('@/views/app-components/role/Role'));

interface IRoute {
  path: string;
  title: string;
  icon?: any;
  children?: IRoute[];
  component?: any;
}

const navRoutes: IRoute[] = [
  {
    path: 'user',
    title: 'Users',
    icon: <TeamOutlined />,
    children: [
      {
        path: '/users/create',
        title: 'Create User',
        component: <CreateUser />,
      },
      {
        path: '/users/list',
        title: 'List User',
        component: <ListUser />,
      },
    ],
  },
  {
    path: 'users',
    title: 'Users Management',
    icon: <TeamOutlined />,
    component: <User />,
  },
  {
    path: 'roles',
    title: 'Roles Management',
    icon: <TeamOutlined />,
    component: <Role />,
  },
  {
    path: 'event',
    title: 'Event',
    icon: <TeamOutlined />,
    children: [
      {
        path: '/event/create',
        title: 'Create Event',
        component: <CreateEvent />,
      },
      {
        path: '/event/list',
        title: 'List Event',
        component: <ListEvent />,
      },
      {
        path: '/event/user-registered',
        title: 'User Registered',
        component: <UsersRegistered />,
      },
      {
        path: '/event/user-sended',
        title: 'User Sended',
        component: <UsersSended />,
      },
    ],
  },
  {
    path: 'research',
    title: 'Research',
    icon: <TeamOutlined />,
    children: [
      {
        path: '/research/create',
        title: 'Create research',
        component: <CreateResearch />,
      },
      {
        path: '/research/list',
        title: 'List Research',
        component: <ListResearch />,
      },
    ],
  },
  {
    path: 'account',
    title: 'Account',
    icon: <UserOutlined />,
    children: [
      {
        path: '/account/profile',
        title: 'Profile',
        component: <Profile />,
      },
    ],
  },
  {
    path: 'package',
    title: 'Pack',
    icon: <TeamOutlined />,
    children: [
      {
        path: '/package/create',
        title: 'Create Package',
        component: <CreatePackage />,
      },
      {
        path: '/package/list',
        title: 'List Package',
        component: <ListPackage />,
      },
    ],
  },
  {
    path: 'job',
    title: 'Jobs',
    icon: <TeamOutlined />,
    children: [
      {
        path: '/job/create',
        title: 'Create Job',
        component: <CreateJob />,
      },
      {
        path: '/job/list',
        title: 'List Job',
        component: <ListJob />,
      },
    ],
  },
  {
    path: 'company',
    title: 'Companies',
    icon: <TeamOutlined />,
    children: [
      {
        path: '/company/create',
        title: 'Create Company',
        component: <CreateCompany />,
      },
      {
        path: '/company/list',
        title: 'List Company',
        component: <ListCompany />,
      },
    ],
  },
];

const getRoutes = function (rawRoutes: IRoute[]): RouteObject[] {
  const routes: RouteObject[] = [];
  for (let i = 0; i < rawRoutes.length; i++) {
    let rawRoute = rawRoutes[i];
    if (!rawRoute.children) {
      routes.push({
        path: rawRoute.path,
        element: rawRoute.component,
      });
    } else {
      routes.push(...getRoutes(rawRoute.children));
    }
  }
  return routes;
};
const navRouters = getRoutes(navRoutes);

const browserRouters: RouteObject[] = [
  {
    path: '/login',
    element: <LoginPage />,
    errorElement: 'Page not found',
  },
  {
    path: '/',
    element: <DefaultLayout />,
    errorElement: <Page404 />,
    children: navRouters,
  },
];

type MenuItem = Required<MenuProps>['items'][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[]
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
  } as MenuItem;
}

function GetMenu(routes: IRoute[]): MenuItem[] {
  const items: MenuItem[] = [];
  routes.map((route) => {
    if (!route.children) {
      items.push(getItem(route.title, route.path, route.icon));
    } else {
      const children = GetMenu(route.children);
      items.push(getItem(route.title, route.path, route.icon, children));
    }
  });
  return items;
}

export { navRoutes, GetMenu };
export type { IRoute };
export default browserRouters;
