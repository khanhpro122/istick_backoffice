import {
  Form,
  Input,
  Button,
  DatePicker,
  Select,
  Space,
  notification,
} from 'antd';
import { useTranslation } from 'react-i18next';
import { createAUser } from '../../../../apis/users';

const { Option } = Select;

const layout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  },
};
const tailLayout = {
  wrapperCol: {
    offset: 8,
    span: 16,
  },
};

const CreateUser = () => {
  const { t } = useTranslation();

  const onFinish = (values: any) => {
    createAUser({
      address: values.address,
      dateOfBirth: values.dateOfBirth,
      email: values.email,
      name: values.name,
      gender: values.gender,
    })
      .then((res) => {
        if (res.status) {
          notification.success({
            message: t('Create user'),
            description: t('Successful'),
          });
        }
      })
      .catch((err) => {
        notification.error({
          message: t('Create user'),
          description: t('Something went wrong'),
        });
      });
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <Form
      {...layout}
      name='basic'
      initialValues={{
        remember: true,
      }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
    >
      <Form.Item
        name='email'
        label={t('E-mail')}
        rules={[
          {
            type: 'email',
            message: t('The input is not valid E-mail!'),
          },
          {
            required: true,
            message: t('Please input your E-mail!'),
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label={t('Name')}
        name='name'
        rules={[
          {
            required: true,
            message: t('Please input your name!'),
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label={t('Date Of Birth')}
        name='dateOfBirth'
        rules={[
          { required: true, message: t('Please input your date of birth!') },
        ]}
      >
        <DatePicker format={'YYYY-MM-DD'} />
      </Form.Item>

      <Form.Item
        name='gender'
        label={t('Gender')}
        rules={[{ required: true, message: t('Please select gender!') }]}
      >
        <Select placeholder={t('Select your gender')}>
          <Option value='male'>Male</Option>
          <Option value='female'>Female</Option>
          <Option value='other'>Other</Option>
        </Select>
      </Form.Item>

      <Form.Item label={t('Address')}>
        <Space.Compact>
          <Form.Item
            name={['address', 'province']}
            noStyle
            rules={[{ required: true, message: t('Province is required') }]}
          >
            <Select placeholder={t('Select province')}>
              <Option value='HN'>Ha Noi</Option>
              <Option value='HCM'>Tp. Ho Chi Minh</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name={['address', 'street']}
            noStyle
            rules={[{ required: true, message: t('Street is required') }]}
          >
            <Input placeholder={t('Input street')} />
          </Form.Item>
        </Space.Compact>
      </Form.Item>

      <Form.Item {...tailLayout}>
        <Button type='primary' htmlType='submit'>
          {t('Submit')}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default CreateUser;
