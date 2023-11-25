import { accountSelector } from '@/_redux/features/auth';
import { UserOutlined } from '@ant-design/icons';
import {
  Avatar,
  Badge,
  Skeleton,
  Space,
  Tabs,
  TabsProps,
  Typography,
} from 'antd';
import React, { useEffect, useState } from 'react';

import ProfileDetail from './profile-detail/ProfileDetail';

const { Text } = Typography;

const AccountProfile: React.FC = () => {
  const { loading, accountData: account } = accountSelector();
  const [tabItems, setTabItems] = useState<TabsProps['items']>();

  useEffect(() => {
    const profileDetailComp = loading ? (
      <Skeleton />
    ) : (
      <ProfileDetail account={account} />
    );

    const items: TabsProps['items'] = [
      {
        key: '1',
        label: `Detail`,
        children: profileDetailComp,
      },
      {
        key: '2',
        label: `Login Logs`,
        children: `Login logs`,
      },
    ];
    setTabItems(items);
  }, [loading, account]);

  const onChange = (key: string) => {
    console.log(key);
  };

  return (
    <>
      <Space size={24}>
        <Badge dot>
          <Avatar shape='square' icon={<UserOutlined />} />
        </Badge>
        <Space direction='vertical'>
          <Text strong>{account?.email}</Text>
          <Text>{account?.role}</Text>
        </Space>
      </Space>
      <Tabs defaultActiveKey='1' items={tabItems} onChange={onChange} />
    </>
  );
};

export default AccountProfile;
