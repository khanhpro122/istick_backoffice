import React, { Suspense, useEffect, useState } from 'react';
import { Button, Dropdown, MenuProps, Space } from 'antd';
import { Breadcrumb, Layout, Menu, theme } from 'antd';
import { Outlet, useNavigate } from 'react-router-dom';
import { Header } from 'antd/es/layout/layout';
import { LogoutOutlined } from '@ant-design/icons';

import { accountSelector, getAccountInfoAction } from '@/_redux/features/auth';
import { navRoutes as routes, GetMenu, IRoute } from '../routers/router';

import avt from '../assets/imgs/avatar.png';
import usa from '../assets/icons/usa.svg';
import vn from '../assets/icons/vn.png';
import logo from '../assets/imgs/logo.svg';
import { useAppDispatch } from '@/_redux/hooks';
import { ErrorBoundary } from 'react-error-boundary';
import { useTranslation } from 'react-i18next';
import { clearToken, clearUserInfo } from '@/helpers/storage';

const { Content, Footer, Sider } = Layout;

type MenuItem = Required<MenuProps>['items'][number];

const DefaultLayout: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [items, setItems] = useState<MenuItem[]>([]);
  const { accountData: account } = accountSelector();
  const [collapsed, setCollapsed] = useState(false);

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getAccountInfoAction());
  }, []);

  const onLogout = () => {
    console.log('logout');
    clearUserInfo();
    clearToken();
    location.href = '/bo/login';
  };

  const breadcrumbs = location.pathname
    .split('/')
    .filter((b) => b !== '' && b !== '/')
    .map((p) => (p ? p.charAt(0).toLocaleUpperCase() + p.slice(1) : ''));

  const headerDropdownitems: MenuProps['items'] = [
    {
      key: '0',
      label: account?.username,
    },
    {
      key: '1',
      label: (
        <Button
          style={{ float: 'right', marginBottom: '10px' }}
          type='primary'
          icon={<LogoutOutlined />}
          onClick={onLogout}
        >
          Logout
        </Button>
      ),
    },
  ];

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  const lngDropdownitems: MenuProps['items'] = [
    {
      key: '0',
      label: (
        <img
          src={usa}
          alt='lg'
          style={{ width: '32px' }}
          onClick={() => changeLanguage('en')}
        />
      ),
    },
    {
      key: '1',
      label: (
        <img
          src={vn}
          alt='lg'
          style={{ width: '32px' }}
          onClick={() => changeLanguage('vi')}
        />
      ),
    },
  ];

  const translateRouters = (
    routers: Array<IRoute> | undefined
  ): Array<IRoute> | undefined => {
    if (!routers || routers.length <= 0) {
      return undefined;
    }

    return routers.map((item) => ({
      ...item,
      title: t(item.title),
      children: translateRouters(item.children),
    }));
  };

  useEffect(() => {
    const items = GetMenu(translateRouters(routes) || []);
    setItems(items);
  }, [t]);

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const onClick: MenuProps['onClick'] = (e) => {
    navigate(e.keyPath[0]);
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
      >
        <div
          // style={{
          //   height: 32,
          //   margin: 16,
          //   background: 'rgba(255, 255, 255, 0.2)',
          // }}
          className='text-center'
          style={{
            padding: 16,
          }}
        >
          <img
            src={logo}
            alt='avatar'
            style={{ width: '80px', height: '32px' }}
          />
        </div>
        <Menu
          onClick={onClick}
          theme='dark'
          defaultSelectedKeys={[location.pathname]}
          mode='inline'
          items={items}
        />
      </Sider>
      <Layout className='site-layout'>
        <Content style={{ margin: '0 16px' }}>
          <Header style={{ paddingLeft: '16px', background: colorBgContainer }}>
            <Space style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Breadcrumb style={{ margin: '16px 0' }}>
                {breadcrumbs &&
                  breadcrumbs.map((breadcrumb, index) => (
                    <Breadcrumb.Item key={index}>{breadcrumb}</Breadcrumb.Item>
                  ))}
              </Breadcrumb>
              <div style={{ display: 'flex' }}>
                <div style={{ margin: '8px' }}>
                  <Dropdown
                    menu={{ items: lngDropdownitems }}
                    placement='bottomRight'
                    arrow
                  >
                    <img src={usa} alt='lg' style={{ width: '32px' }} />
                  </Dropdown>
                </div>
                <div style={{ margin: '8px' }}>
                  <Dropdown
                    menu={{ items: headerDropdownitems }}
                    placement='bottomRight'
                    arrow
                  >
                    <img src={avt} alt='avatar' style={{ width: '32px' }} />
                  </Dropdown>
                </div>
              </div>
            </Space>
          </Header>
          <div
            style={{
              padding: 24,
              minHeight: 360,
              background: colorBgContainer,
            }}
          >
            <ErrorBoundary fallback={<div>Something went wrong</div>}>
              <Suspense fallback={'loading...'}>
                <Outlet />
              </Suspense>
            </ErrorBoundary>
          </div>
        </Content>
        <Footer className='text-center'>
          Ant Design ©2023 Created by Ant UED
        </Footer>
      </Layout>
    </Layout>
  );
};

export default DefaultLayout;
