import { BASE_URL } from '.';

export const baseURL = 'https://api.athena-sit.url2fs.com';

export const urlApiLogin = '/api/v1/internal/iam/users/login';

export const urlApiLogout = '/api/v1/internal/iam/users/logout';

export const urlApiInfo = '/api/v1/internal/iam/users/self-info';

export const roleURL = BASE_URL + '/api/istick/v1/internal/iam/roles';

export const categoryURL = '/api/v1/internal/catalog/categories';

export const subCategoryURL = '/api/v1/internal/catalog/categories/subs';

export const userURL = BASE_URL + '/api/istick/v1/internal/iam/users';

export const productURL = '/api/v1/internal/catalog/products';

export const SKILLS = [
    {
      label: 'Javascript',
      value: 'Javascript'
    },
    {
      label: 'Golang',
      value: 'Golang'
    },
    {
      label: 'AWS',
      value: 'AWS'
    },
    {
      value: 'React Native',
      label: 'React Native',
    },
    {
      value: 'NodeJs',
      label: 'NodeJs',
    },
    {
      label: 'ReactJS',
      value: 'ReactJS',
    },
    {
      value: 'Docker',
      label: 'Docker',
    },
  ]

  export const JOB_TYPES = [
    { label: "At Office", value: "OFFICE" },
    { label: "Remote", value: "REMOTE" },
    { label: "Hybrid", value: "HIBRID" },
    { label: "Contract", value: "CONTRACT" },
  ]

  export const COMPANY_TYPES =  [
    {label: 'Outsourcing', value: 'OUTSOURCE'},
    {label: 'Producting', value: 'PRODUCT'},
  ]