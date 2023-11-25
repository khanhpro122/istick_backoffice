// Libraries
import {
  Form,
  Input,
  Button,
  DatePicker,
  Select,
  Space,
  notification,
  InputNumber,
} from 'antd';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';

// Apis
import { createAEvent, fetchEvent, updateAEvent } from '@/apis/events';
import Editor from '@/views/common-components/editor/Editor';
import { generateKey, removeIdRecursively } from '@/utils';
import { TQuestion } from '@/types/event';
import QuestionList from '@/components/Questions/QuestionList';


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

const dateTimeFormat = 'YYYY-MM-DD HH:mm:ss';

const CreateEvent = () => {
  const [form] = Form.useForm();
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const [description, setDescription] = useState('');
  const [eventID, setEventID] = useState(0);
  const [recap, setRecap] = useState('');
  const [eventQuestions, setEventQuestions] = useState<TQuestion[]>([
    {
      content: '',
      questionType: 'TEXT',
      id: generateKey(8),
      required: false,
      choices: [],
      isNew: true,
    }
  ]);

  useEffect(() => {
    const event_id = searchParams.get('event_id') || '';
    const slug = searchParams.get('slug') || '';
    if (event_id || slug) {
      fetchEvent({
        id: event_id,
        slug: slug,
      }).then((res) => {
        setEventID(res.data.id);
        form.setFieldsValue({
          slug: res.data.slug,
          title: res.data.title,
          bannerUrl: res.data.bannerUrl,
          host: res.data.host,
          cost: res.data.cost,
          startDate: dayjs(res.data.startDate),
          endDate: dayjs(res.data.endDate),
          registrationDeadline: dayjs(res.data.registrationDeadline),
          types: res.data.types,
          description: res.data.description,
          recap: res.data.recap,
          location: res.data.location,
          mapLocation: res.data.mapLocation,
          livestreamUrl: res.data.livestreamUrl,
        });
        setDescription(res.data.description);
        setRecap(res.data.recap)
        if(res?.data?.eventQuestions) {
          setEventQuestions(res?.data?.eventQuestions)
        }
      });
    }
  }, [searchParams]);

  const onFinish = (values: any) => {
    let title = 'Create Event';
    if (eventID) {
      title = 'Update Event';
    }
    
    values.eventQuestions = removeIdRecursively(eventQuestions)
    if(eventID) {
      updateAEvent(values, eventID)
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
      createAEvent(values)
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

  const handleRecapChange = (content:string) => {
    setRecap(content);
  };

  const handleOnchangeTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    const slug = newTitle.toLowerCase()?.replace(/[^\w\s]/g, '')?.replace(/\s+/g, '_');
    form.setFieldsValue({ slug });
  } 

  const handleAddQuestion = () => {
    const cloneListQuestion = [...eventQuestions];
    const addQuestion = {
      content: '',
      questionType: 'TEXT',
      id: generateKey(8),
      required: false,
      choices: [],
      isNew: true,
    }
    setEventQuestions([...cloneListQuestion, addQuestion]);
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
        label={t('Title')}
        name='title'
        rules={[
          {
            required: true,
            message: t('Please input title'),
          },
        ]}
      >
        <Input onChange={handleOnchangeTitle} />
      </Form.Item>

      <Form.Item
        label={t('Banner Image')}
        name='bannerUrl'
        rules={[{ required: true, message: t('Please input image url') }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label={t('Host')}
        name='host'
        rules={[{ required: true, message: t('Please input Host') }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label={t('Location')}
        name='location'
        rules={[{ required: true, message: t('Please input location') }]}
      >
        <Input />
      </Form.Item>

      <Form.Item label={t('Map Location')} name='mapLocation'>
        <Input />
      </Form.Item>

      <Form.Item label={t('Livestream URL')} name='livestreamUrl'>
        <Input />
      </Form.Item>

      <Form.Item
        label={t('Cost')}
        name='cost'
        rules={[{ required: true, message: t('Please input Cost') }]}
      >
        <InputNumber min={0} />
      </Form.Item>

      <Form.Item
        label={t('Start Date')}
        name='startDate'
        rules={[{ required: true, message: t('Please input Start Date') }]}
      >
        <DatePicker format={dateTimeFormat} showTime={true} />
      </Form.Item>

      <Form.Item
        label={t('End Date')}
        name='endDate'
        rules={[{ required: true, message: t('Please input End Date') }]}
      >
        <DatePicker format={dateTimeFormat} showTime={true} />
      </Form.Item>

      <Form.Item
        label={t('Registration Deadline')}
        name='registrationDeadline'
        rules={[
          { required: true, message: t('Please input Registration Deadline') },
        ]}
      >
        <DatePicker format={dateTimeFormat} showTime={true} />
      </Form.Item>

      <Form.Item
        name='types'
        label={t('Types')}
        rules={[{ required: true, message: t('Please select Types!') }]}
      >
        <Select mode='multiple' allowClear placeholder={t('Select Types')}>
          <Option value='ONLINE'>Online</Option>
          <Option value='OFFLINE'>Offline</Option>
        </Select>
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
      <Form.Item
        label={t('Recap')}
        name='recap'
        rules={[{ required: true, message: t('Please input Recap') }]}
      >
        <Editor
          value={recap}
          onChange={handleRecapChange}
          placeholder='Write recap...'
        />
      </Form.Item>
      <Form.Item
        label={t('More Questions')}
      >
        <QuestionList 
          eventQuestions={eventQuestions} 
          setEventQuestions={setEventQuestions} 
        />
        <Button style={{marginTop: '8px'}} type='primary' onClick={handleAddQuestion}>
            {t('Add question')}
          </Button>
      </Form.Item>
      <Form.Item {...tailLayout}>
        <Button type='primary' htmlType='submit'>
          {t('Submit')}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default CreateEvent;
