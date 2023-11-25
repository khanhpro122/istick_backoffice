import { Button, Space, Switch, Tag, Typography } from 'antd';
import { IAccountInfo } from '../../../../types/account';

const { Text } = Typography;

const onChange = (checked: boolean) => {
  console.log(`switch to ${checked}`);
};

const ProfileDetail: React.FC<{ account: IAccountInfo | undefined }> = ({
  account,
}) => {
  return (
    <>
      <Space size={24} direction='vertical'>
        <Space>
          <Text type='secondary'>Username</Text>
          <Text strong>{account?.username}</Text>
        </Space>
        <Space>
          <Text type='secondary'>Status</Text>
          <Text strong>
            <Switch checked={account?.active} onChange={onChange} />
          </Text>
        </Space>
        <Space>
          <Text type='secondary'>Password: ***</Text>
          <Text strong>
            <Button type='primary'>Change password</Button>
          </Text>
        </Space>
        <Space>
          <Text type='secondary'>
            Two Factor Authentication: <Tag color='red'>red</Tag>
            <Tag color='green'>green</Tag>
          </Text>
          <Text strong>
            <Button type='primary'>Enable/Disable</Button>
          </Text>
        </Space>
      </Space>
    </>
  );
};

export default ProfileDetail;
