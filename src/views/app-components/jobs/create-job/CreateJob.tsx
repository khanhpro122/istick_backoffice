// Libraries
import {
  Form,
  Input,
  Button,
  notification,
  Select,
  InputNumber,
  DatePicker,
} from 'antd';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';

// Apis
import { fetchDetailsJob, createAJob } from '@/apis/jobs';

// Components
import Editor from '@/views/common-components/editor/Editor';
import dayjs from 'dayjs';
import { fetchCurrencies, fetchLevels } from '@/apis/systems';
import { JOB_TYPES, SKILLS } from '@/apis/constants';
import { checkAndConvertValue, convertArrayToTags, convertValues } from '@/utils';
import { fetchCompanies, fetchDetailsCompany } from '@/apis/companies';

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


const CreateJob = () => {
  const [form] = Form.useForm();
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const [description, setDescription] = useState('');
  const [jobID, setJobID] = useState('');
  const [optionLevels, setOptionLevels] = useState<{label: string, value: string}[] | any[]>([]);
  const [skillOptions, setSkillOptions] = useState<{label: string, value: string}[] | any[]>([]);
  const [companyOptions, setCompanyOptions] = useState<{label: string, value: string}[] | any[]>([]);
  const [optionCurrencies, setOptionCurrencies] = useState<{label: string, value: string}[] | any[]>([]);
  const [skills, setSkills] = useState<any[]>([])
  const [companySelected, setCompanySelected] = useState<number | string>("")
  const [addressOptions, setAddressOptions] = useState<{label: string, value: string}[]>([])

  const { TextArea } = Input;

  const { Option } = Select;

  const handleOnchangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    const slug = newTitle.toLowerCase()?.replace(/[^\w\s]/g, '')?.replace(/\s+/g, '_');
    form.setFieldsValue({ slug });
  }

  useEffect(() => {
    if(skills?.length) {
      const newOptions = checkAndConvertValue(skills, skillOptions)
      if(newOptions) {
        setSkillOptions([...newOptions])
      }
    }
  }, [skills, skillOptions])

  const fetchAllLevels = async () => {
    fetchLevels().then((res) => {
      setOptionLevels(res?.map((item) => {
        return {
          label: item.name,
          value: item.id,
        }
      }))
    })
  }

  const fetchAllCompanies = async () => {
    const res = await fetchCompanies({limit: 50, page: 1, searchKey: ""})
    setCompanyOptions(
      res?.list?.map((item: any) => ({
        label: item?.name,
        value: item?.id,
      }))
    );
  };

  const fetchAllCurrencies = async () => {
    fetchCurrencies().then((res) => {
      setOptionCurrencies(res?.map((item) => {
        return {
          label: item.name,
          value: item.id,
        }
      }))
    })
  }

  const getDetailCompany = async (companyId: string | number) => {
    const response = await fetchDetailsCompany(companyId);
    if(response?.data) {
      setAddressOptions(response?.data?.companyAddresses?.map((item: any) => {
        return {
          label: `${item?.address} (${item?.city?.name}, ${item?.country?.name})`,
          value: item?.id
        }
      }))
    }
  };

  const handleOnchangeCompany = (value:string | number) => {
    setCompanySelected(value)
  }

  useEffect(() => {
    const jobId = searchParams.get('job_id') || '';
    if (jobId) {
      fetchDetailsJob(jobId).then((res) => {
        form.setFieldsValue({
          slug: res.data.slug,
          name: res.data.name,
          position: res.data.position,
          description: res.data.description,
          salaryFrom: res.data.salaryFrom,
          salaryTo: res.data.salaryTo,
          overview: res.data.overview,
          workingDays: res.data.workingDays,
          website: res.data.website,
          jobLevels: res.data?.jobLevels?.map((level) => level.levelId),
          jobTags: convertValues(res?.data?.jobTags, "SKILL"),
          deadline: dayjs(res.data.deadline),
          currencyId: res.data.currencyId,
          jobTypes: res.data.jobTypes,
          companyId: res.data.companyId,
          companyAddressId: res.data.companyAddressId,
        });
        setSkills(convertValues(res?.data?.jobTags, "SKILL"))
        setDescription(res.data.description);
      });
    }
  }, [searchParams]);

  useEffect(() => {
    if(companySelected) {
      getDetailCompany(companySelected)
    }
  }, [companySelected])

  useEffect(() => {
    fetchAllLevels()
    fetchAllCurrencies()
    fetchAllCompanies()
  },[])

  const onFinish = (values: any) => {
    let title = 'Create job';
    if (jobID) {
      values.id = jobID;
      title = 'Update job';
    }

    createAJob(
      {...values, 
        salaryTo: +values.salaryTo, 
        salaryFrom: +values.salaryFrom, 
        jobTags: convertArrayToTags(values.jobTags)
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
        name='name'
        rules={[
          {
            required: true,
            message: t('Please input name'),
          },
        ]}
      >
        <Input onChange={handleOnchangeName}/>
      </Form.Item>

      <Form.Item
        label={t('Company')}
        name='companyId'
        rules={[{ required: true, message: t('Please select company') }]}
      >
        <Select options={companyOptions} onChange={handleOnchangeCompany}/>
      </Form.Item>

      <Form.Item
        label={t('Address')}
        name='companyAddressId'
        rules={[{ required: true, message: t('Please select address') }]}
      >
        <Select options={companyOptions} onChange={handleOnchangeCompany}/>
      </Form.Item>

      <Form.Item
        label={t('Position job')}
        name='position'
        rules={[{ required: true, message: t('Please input position') }]}
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
        name="currencyId"
        label="Currency"
        rules={[{ required: true, message: 'Please select currency' }]}
      >
        <Select placeholder="select currency" options={optionCurrencies} />
      </Form.Item>

      <Form.Item
        label={t('Salary from')}
        name='salaryFrom'
        rules={[{ required: true, message: t('Please input salary from') }]}
      >
        <Input type="number" />
      </Form.Item>

      <Form.Item
        label={t('Salary to')}
        name='salaryTo'
        rules={[{ required: true, message: t('Please input salary to') }]}
      >
        <Input type="number" />
      </Form.Item>

      <Form.Item
        label={t('Deadline')}
        name='deadline'
        rules={[{ required: true, message: t('Please deadline') }]}
      >
        <DatePicker format="YYYY-MM-DD" showTime={false} />
      </Form.Item>
      
      <Form.Item
        name="jobLevels"
        label="Levels"
        rules={[{ required: true, message: 'Please select levels' }]}
      >
        <Select placeholder="select level" mode="multiple" options={optionLevels} />
      </Form.Item>

      <Form.Item
        name="jobTypes"
        label="Job type"
        rules={[{ required: true, message: 'Please select job types' }]}
      >
        <Select placeholder="select job type" mode="multiple" options={JOB_TYPES} />
      </Form.Item>

      <Form.Item
        name="jobTags"
        label="Skills"
        rules={[{ required: true, message: 'Please select skills' }]}
      >
        <Select placeholder="select skills" mode="multiple" options={skillOptions} />
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

export default CreateJob;
