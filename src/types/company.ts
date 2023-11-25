interface TCompanyAddress {
  address: string,
  city: {
    code: string,
    city: {
      code: string,
      countryId: number,
      id: number,
    },
    cityId: number,
    companyId: number,
    country: {
      code: string,
      flagUrl: string,
      id: number,
      name: string
    },
    countryId: number,
    id: number,
    isMain: boolean,
    mapAddress: string
  }
}

interface TCompany {
  companyTypes: string[],
  companySizeTo: number,
  companySizeFrom: number,
  avatar: string,
  owner: boolean,
  deadline: string,
  description: string,
  id: number,
  companyAddresses: TCompanyAddress[],
  name: string,
  overview: string,
  qualification: string,
  culture: number,
  slug: string,
  website: string,
  workingDays: string
}

type ListCompany = TCompany[];

export type { TCompany, ListCompany };
