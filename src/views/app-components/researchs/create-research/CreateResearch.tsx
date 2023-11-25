// Libraries
import {
  Form,
  Input,
  Button,
  notification,
  Select,
  InputNumber,
} from 'antd';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';

// Apis
import { fetchResearch, createAResearch } from '@/apis/researchs';

// Components
import Editor from '@/views/common-components/editor/Editor';

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


const CreateResearch = () => {
  const [form] = Form.useForm();
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const [researchID, setResearchID] = useState(0);
  const [description, setDescription] = useState('');
  const { TextArea } = Input;

  const { Option } = Select;

  const handleOnchangeTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    const slug = newTitle.toLowerCase()?.replace(/[^\w\s]/g, '')?.replace(/\s+/g, '_');
    form.setFieldsValue({ slug });
  }

  useEffect(() => {
    const researchId = searchParams.get('research_id') || '';
    const slug = searchParams.get('slug') || '';
    if (researchId || slug) {
      fetchResearch({
        id: researchId,
        slug: slug,
      }).then((res) => {
        setResearchID(res.data.id);
        form.setFieldsValue({
          slug: res.data.slug,
          title: res.data.title,
          bannerUrl: res.data.bannerUrl,
          description: res.data.description,
          field: res.data.field,
          overview: res.data.overview,
          authorAvatar: res.data.authorAvatar,
          status: res.data.status,
          timeToRead: res.data.timeToRead
        });
        setDescription(res.data.description);
      });
    }
  }, [searchParams]);

  const onFinish = (values: any) => {
    let title = 'Create Research';
    if (researchID) {
      values.id = researchID;
      values.timeToRead = +values.timeToRead
      title = 'Update Research';
    }

    createAResearch({...values, type: 'RESEARCH'})
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
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

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
        label={t('Title')}
        name='title'
        rules={[
          {
            required: true,
            message: t('Please input title'),
          },
        ]}
      >
        <Input onChange={handleOnchangeTitle}/>
      </Form.Item>

      <Form.Item
        label={t('Banner Image')}
        name='bannerUrl'
        rules={[{ required: true, message: t('Please input image url') }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label={t('Author Avatar')}
        name='authorAvatar'
        rules={[{ required: true, message: t('Please input author avatar') }]}
      >
        <Input />
      </Form.Item>

      {/* <Form.Item
        label={t('Type')}
        name='type'
        rules={[{ required: true, message: t('Please input type') }]}
      >
        <Input />
      </Form.Item> */}

      <Form.Item
        name="status"
        label="Status"
        rules={[{ required: true, message: 'Please select status!' }]}
      >
        <Select placeholder="select status of research">
          <Option value="PUBLISHED">Published</Option>
          <Option value="DRAFT">Draft</Option>
        </Select>
      </Form.Item>

      <Form.Item
        name="timeToRead"
        label={t('Time To Read (s)')}
      >
        <InputNumber />
      </Form.Item>

      <Form.Item
        name="field"
        label={t('Field')}
        rules={[{ required: true, message: 'Please input Category' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="overview"
        label={t('Overview')}
        rules={[{ required: true, message: 'Please input Overview' }]}
      >
        <TextArea rows={3} />
      </Form.Item>

      <Form.Item
        label={t('Description')}
        name='description'
        rules={[{ required: true, message: t('Please input Description') }]}
      >
        <Editor />
      </Form.Item>

      <Form.Item {...tailLayout}>
        <Button type='primary' htmlType='submit'>
          {t('Submit')}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default CreateResearch;
