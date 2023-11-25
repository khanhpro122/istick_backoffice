import axios from 'axios';
import { BASE_URL, getQueryParams } from '..';

interface IGetListLevelRes {
  code: string;
  id: string;
  name?: string;
}

interface IGetListCurrencyRes {
    code: string;
    id: string;
    name?: string;
  }

const fetchLevels = () => {
  return axios
    .get(
      `${BASE_URL}/api/istick/v1/internal/sys/levels`
    )
    .then((res) => {
      const resData: IGetListLevelRes[] = res.data.list
      return resData;
    });
};

const fetchCurrencies = () => {
  return axios
    .get(
      `${BASE_URL}/api/istick/v1/internal/sys/currencies`
    )
    .then((res) => {
      const resData: IGetListLevelRes[] = res.data.list
      return resData;
    });
};

const fetchCountries = (params: any) => {
  return axios
    .get(
      `${BASE_URL}/api/istick/v1/internal/sys/countries?${getQueryParams({
        limit: params?.limit,
        page: params?.page,
      })}`
    )
    .then((res) => {
      const resData: any[] = res.data.list
      return resData;
    });
};

const fetchCities = (countryId: any) => {
  return axios
    .get(
      `${BASE_URL}/api/istick/v1/internal/sys/countries/${countryId}/cities`
    )
    .then((res) => {
      const resData: any[] = res.data.list
      return resData;
    });
};

export type { IGetListLevelRes, IGetListCurrencyRes };

export {
  fetchLevels,
  fetchCurrencies,
  fetchCountries,
  fetchCities
};
