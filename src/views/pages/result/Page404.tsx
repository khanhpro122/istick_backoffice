import React from 'react';
import { Button, Result } from 'antd';
import { useNavigate } from 'react-router-dom';

const Page404: React.FC = () => {
  const navigate = useNavigate();

  const backHome = function () {
    navigate('/');
  };
  return (
    <Result
      status='403'
      title='403'
      subTitle='Sorry, you are not authorized to access this page.'
      extra={
        <Button onClick={backHome} type='primary'>
          Back Home
        </Button>
      }
    />
  );
};

export default Page404;
