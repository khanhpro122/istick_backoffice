interface IAddress {
  province: string;
  street: string;
}

export const enum UserType {
  Talent = 'TALENT',
  Hr = 'HR',
  BackOffice = 'BACK_OFFICE',
}

interface IUserInfo {
  id: number;
  email: string;
  name: string;
  dateOfBirth: string;
  gender: string;
  address: IAddress;
  status: string;
  phoneNumber?: string;
  jobTitle?: string;
  company?: string
}

type ListUser = IUserInfo[];

export type { IUserInfo, ListUser, IAddress };
