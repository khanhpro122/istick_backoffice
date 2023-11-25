export const partitionArray = (arr: any, property: string) => {
  return arr?.sort((a: any, b: any) => a.id - b.id).reduce((acc: any, cur: any) => {
    acc[cur[property]] = [...acc[cur[property]] || [], cur];
    return acc;
  }, {});
}