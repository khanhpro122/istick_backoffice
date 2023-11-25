// Libraries
import {
  Form,
  Input,
  Button,
  notification,
  Select,
} from 'antd';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';

// Components
import Editor from '@/views/common-components/editor/Editor';
import { createACompany, fetchDetailsCompany } from '@/apis/companies';
import { ItemLocation } from './components/ItemLocation';
import { findMaxId } from '@/utils';
import { COMPANY_TYPES } from '@/apis/constants';

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


const CreateCompany = () => {
  const [form] = Form.useForm();
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const [companyID, setCompanyID] = useState(0);
  const [description, setDescription] = useState('');
  const [companyAddresses, setCompanyAddresses] = useState<any[]>([])
  const { TextArea } = Input;

  const { Option } = Select;

  const handleOnchangeTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    const slug = newTitle.toLowerCase()?.replace(/[^\w\s]/g, '')?.replace(/\s+/g, '_');
    form.setFieldsValue({ slug });
  }

  useEffect(() => {
    const companyId = searchParams.get('company_id') || '';
    if (companyId) {
      fetchDetailsCompany(companyId).then((res) => {
        setCompanyID(res.data.id);
        form.setFieldsValue({
          slug: res.data.slug,
          name: res.data.name,
          companyTypes: res.data.companyTypes,
          description: res.data.description,
          culture: res.data.culture,
          overview: res.data.overview,
          workingDays: res.data.workingDays,
          companySizeTo: res.data.companySizeTo,
          companySizeFrom: res.data.companySizeFrom,
          website: res.data.website
        });
        setDescription(res.data.description);
        setCompanyAddresses(res.data.companyAddresses)
      });
    }
  }, [searchParams]);

  const onFinish = (values: any) => {
    let title = 'Create Company';
    if (companyID) {
      values.id = companyID;
      title = 'Update Company';
    }
  
    createACompany({...values, 
        companySizeFrom: +values.companySizeFrom, 
        companySizeTo: +values.companySizeTo,
        companyAddresses: companyAddresses
      })
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

  const onChangeOptionLocation = (value: string, type:string , id: string) => {
    const cloneData = [...companyAddresses]
    const findOption:any = cloneData?.find((item:any) => item?.id === id)
    if(findOption && type) {
      findOption[type] = value
    }
    setCompanyAddresses(cloneData)
  }

  const handleClearOptionLocation = (id: string) => {
    const newOptions = companyAddresses?.filter((item) => item.id !== id)
    setCompanyAddresses(newOptions)
  }

  const handleAddMoreLocation = () => {
    const newId = findMaxId(companyAddresses)
    const newOptions = {
      id: newId + 1,
      address: '',
      mapAddress: '',
      cityId: 1,
      countryId: 1
    }
    setCompanyAddresses([...companyAddresses, newOptions])
  }

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
        label={t('Name')}
        name='Name'
        rules={[
          {
            required: true,
            message: t('Please input name'),
          },
        ]}
      >
        <Input onChange={handleOnchangeTitle}/>
      </Form.Item>

      <Form.Item
        label={t('Website')}
        name='website'
        rules={[{ required: true, message: t('Please input website') }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label={t('Working day')}
        name='workingDays'
        rules={[{ required: true, message: t('Please input working day') }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="location"
        label="Location"
        rules={[{ required: true, message: 'Please select currency' }]}
      >
       <div className="w-full mb-6">
        <div style={{display: "flex", flexDirection: "column", gap: "20px"}}>
          {companyAddresses?.map((item:any, index:number) => {
            return (
              <ItemLocation item={item} companyAddresses={companyAddresses} key={item?.id} onChangeOptionLocation={onChangeOptionLocation} handleClearOptionLocation={handleClearOptionLocation} />
            )
          })}
        </div>
        <Button type='primary' style={{marginTop: "10px"}} onClick={handleAddMoreLocation}>{t("Add new location")}</Button>
      </div>
      </Form.Item>

      <Form.Item
        label={t('Company type')}
        name='companyTypes'
        rules={[{ required: true, message: t('Please input company type') }]}
      >
        <Select placeholder="select currency" mode="multiple" options={COMPANY_TYPES} />
      </Form.Item>

      <Form.Item
        label={t('Company size from')}
        name='companySizeFrom'
        rules={[{ required: true, message: t('Please input company size from') }]}
      >
        <Input type="number" />
      </Form.Item>

      <Form.Item
        label={t('Company size to')}
        name='companySizeTo'
        rules={[{ required: true, message: t('Please input company size to') }]}
      >
        <Input type="number" />
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

      <Form.Item
        label={t('Culture')}
        name='culture'
        rules={[{ required: true, message: t('Please input culture') }]}
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

export default CreateCompany;
