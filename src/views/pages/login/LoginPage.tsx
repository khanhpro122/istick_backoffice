import React from 'react';
import { Button, Card, Checkbox, Form, Input, notification, Space } from 'antd';
import { useNavigate } from 'react-router-dom';

import { login } from '../../../apis/auth';
import './style.css';
import { UserType } from '@/types/users';
import { saveToken } from '@/helpers/storage';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();

  const onFinish = (values: any) => {
    login({
      username: values.username,
      password: values.password,
      userType: UserType.BackOffice,
    })
      .then((data) => {
        saveToken(data.token, data.refreshToken);
        notification.success({
          message: 'Login',
          description: 'Successful!',
        });
        navigate('/');
      })
      .catch((err) => {
        console.log(err);
        let errMessage = 'Something went wrong!';
        if (err?.message) {
          errMessage = err.message;
        }
        if (err?.response?.data?.message) {
          errMessage = err.response.data.message;
        }
        notification.error({
          message: 'Login',
          description: errMessage,
        });
      });
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <Space direction='horizontal' className='login-container'>
      <Card
        title='Login'
        extra={<a href='#'>Register</a>}
        style={{ width: 500 }}
      >
        <Form
          name='basic'
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          style={{ maxWidth: 600 }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete='off'
        >
          <Form.Item
            label='Username'
            name='username'
            rules={[{ required: true, message: 'Please input your username!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label='Password'
            name='password'
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            name='remember'
            valuePropName='checked'
            wrapperCol={{ offset: 8, span: 16 }}
          >
            <Checkbox>Remember me</Checkbox>
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type='primary' htmlType='submit'>
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </Space>
  );
};

export default LoginPage;
