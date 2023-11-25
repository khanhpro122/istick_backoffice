// Libraries
import {
    Form,
    Input,
    Button,
    Select,
    notification,
    InputNumber,
    Switch,
  } from 'antd';
  import { useEffect, useState } from 'react';
  import { useTranslation } from 'react-i18next';
  import { useSearchParams } from 'react-router-dom';
  
  // Apis
  import Editor from '@/views/common-components/editor/Editor';
import TextArea from 'antd/es/input/TextArea';
import { fetchCreatePackage, fetchDetailsPackage, updateAPackage } from '@/apis/packages';
  
  
  const { Option } = Select;
  
  const layout = {
    labelCol: {
      span: 4,
    },
    wrapperCol: {
      span: 18,
    },
  };
  const tailLayout = {
    wrapperCol: {
      offset: 4,
      span: 16,
    },
  };
  
  const CreatePackage = () => {
    const [form] = Form.useForm();
    const { t } = useTranslation();
    const [searchParams] = useSearchParams();
    const [description, setDescription] = useState('');
    const [packageID, setPackageID] = useState(0);
  
    useEffect(() => {
      const package_id = searchParams.get('package_id') || '';
      const slug = searchParams.get('slug') || '';
      if (package_id || slug) {
        fetchDetailsPackage(package_id).then((res) => {
        setPackageID(res.data.id);
          form.setFieldsValue({
            slug: res.data.slug,
                name: res.data.name,
                expirationPeriod: res.data.expirationPeriod,
                price: res.data.price,
                jobQuantity: res.data.jobQuantity,
                appQuantity: res.data.appQuantity,
                emailNotification: res.data.emailNotification,
                displayInSection: res.data.displayInSection,
                displayOrder: res.data.displayOrder,
                displayPosition: res.data.displayPosition,
                description: res.data.description,
                repostJob: res.data.repostJob,
                repostJobDayPeriod: res.data.repostJobDayPeriod,
                priority: res.data.priority,
          });
          setDescription(res.data.description);
        });
      }
    }, [searchParams]);
  
    const onFinish = (values: any) => {
      let title = 'Create Package';
      if (packageID) {
        title = 'Update Package';
      }
      
      if(packageID) {
        updateAPackage(values, packageID)
        .then((res) => {
          if (res.status) {
            notification.success({
              message: t(title),
              description: t('Successful'),
            });
          }
        })
        .catch((err) => {
          notification.error({
            message: t(title),
            description: t('Something went wrong'),
          });
        });
      } else {
        fetchCreatePackage(values)
          .then((res) => {
            if (res.status) {
              notification.success({
                message: t(title),
                description: t('Successful'),
              });
            }
          })
          .catch((err) => {
            notification.error({
              message: t(title),
              description: t('Something went wrong'),
            });
          });
      }
    };
  
    const onFinishFailed = (errorInfo: any) => {
      console.log('Failed:', errorInfo);
    };
    const handleDescriptionChange = (content:string) => {
      setDescription(content);
    };

    const handleOnchangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newName = e.target.value;
      const slug = newName.toLowerCase()?.replace(/[^\w\s]/g, '')?.replace(/\s+/g, '_');
      form.setFieldsValue({ slug });
    } 
  
    return (
      <Form
        {...layout}
        form={form}
        name='basic'
        initialValues={{
          remember: true,
        }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <Form.Item
          name='slug'
          label={t('Slug')}
          rules={[
            {
              required: true,
              message: t('Please input slug'),
            },
          ]}
        >
          <Input disabled />
        </Form.Item>
        <Form.Item
          label={t('Name')}
          name='name'
          rules={[
            {
              required: true,
              message: t('Please input name'),
            },
          ]}
        >
          <Input onChange={handleOnchangeName} />
        </Form.Item>
        <Form.Item
          label={t('Display in section')}
          name='displayInSection'
          rules={[
            {
              required: true,
              message: t('Please input display in section'),
            },
          ]}
        >
          <TextArea />
        </Form.Item>
  
        <Form.Item
          label={t('Display in order')}
          name='displayOrder'
          rules={[
            {
              required: true,
              message: t('Please input display order'),
            },
          ]}
        >
          <TextArea />
        </Form.Item>

        <Form.Item
          label={t('Display in position')}
          name='displayPosition'
          rules={[
            {
              required: true,
              message: t('Please input display position'),
            },
          ]}
        >
          <TextArea />
        </Form.Item>

        <Form.Item
          label={t('App quatiny')}
          name='appQuantity'
          rules={[{ required: true, message: t('Please app quantity') }]}
        >
          <InputNumber min={0} />
        </Form.Item>
  
        <Form.Item
          label={t('Job quatiny')}
          name='jobQuantity'
          rules={[{ required: true, message: t('Please job quantity') }]}
        >
          <InputNumber min={0} />
        </Form.Item>

        <Form.Item
          label={t('Priority')}
          name='priority'
          rules={[{ required: true, message: t('Please priority') }]}
        >
          <InputNumber min={0} />
        </Form.Item>
        
        <Form.Item
          label={t('Repost Job Day Period')}
          name='repostJobDayPeriod'
          rules={[{ required: true, message: t('Please repost job day period') }]}
        >
          <InputNumber min={0} />
        </Form.Item>

        <Form.Item
          label={t('Repost Job')}
          name='repostJob'
          rules={[{ required: true, message: t('Please repost job') }]}
        >
          <Input />
        </Form.Item>
        
        <Form.Item
          label={t('Price')}
          name='price'
          rules={[{ required: true, message: t('Please price') }]}
        >
          <InputNumber min={0} style={{ minWidth: "300px" }} />
        </Form.Item>

        <Form.Item
          label={t('Email Notification')}
          name='emailNotification'
          rules={[{ required: true, message: t('Please price') }]}
          valuePropName="checked"
        >
          <Switch />
        </Form.Item>

        <Form.Item
          label={t('Description')}
          name='description'
          rules={[{ required: true, message: t('Please input Description') }]}
        >
          <Editor
            value={description}
            onChange={handleDescriptionChange}
            placeholder='Write description...'
          />
        </Form.Item>

        <Form.Item {...tailLayout}>
          <Button type='primary' htmlType='submit'>
            {t('Submit')}
          </Button>
        </Form.Item>
      </Form>
    );
  };
  
  export default CreatePackage;
  