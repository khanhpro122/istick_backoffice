interface IPackage {
    appQuantity: number,
    description: string,
    displayInSection: string,
    displayOrder: string,
    displayPosition: string,
    emailNotification: boolean,
    expirationPeriod: string,
    id: number,
    jobQuantity: number,
    name: string,
    price: number,
    priority: number,
    repostJob: string,
    repostJobDayPeriod: number,
    slug: string,
}
  
type ListPackage = IPackage[];
  
export type { IPackage, ListPackage };
  