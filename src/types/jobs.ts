interface TCompanyAddress {
  address: string,
  city: {
    code: string,
    city: {
      code: string,
      countryId: number,
      id: number,
      name: string
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

interface TLevelJob {
  id: number,
  jobId: number,
  level: {
    code: string,
    id: number,
    name: string
  },
  levelId: number,
}

interface TJobTab {
  id: number,
  jobId: number,
  tag: {
    id: number,
    merchantId: number,
    name: string
  },
  tagId: number,
  tagType: string
}

interface TJob {
  approveStatus: string,
      companyAddress: TCompanyAddress
      companyAddressId: number,
      companyAvatar: string,
      companyId: number,
      createdAt: string,
      currency: {
        code: string,
        id: number,
        name: string
      },
      currencyId: number,
      deadline: string,
      description: string,
      id: number,
      jobLevels: TLevelJob[],
      jobTags: TJobTab[],
      jobTypes: string[],
      location: string,
      mapLocation: string,
      name: string,
      openStatus: string,
      overview: string,
      position: string,
      qualification: string,
      salaryFrom: number,
      salaryTitle: string,
      salaryTo: number,
      slug: string,
      userId: number,
      website: string,
      workingDays: string
}

type ListJob = TJob[];

export type { TJob, ListJob };
