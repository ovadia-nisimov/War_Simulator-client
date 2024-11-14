export enum OrganizationsEnum {
  IDF = "IDF",
  Hezbollah = "Hezbollah",
  Hamas = "Hamas",
  IRGC = "IRGC",
  Houthis = "Houthis",
}

export enum IDFRegionsEnum {
  North = "North",
  South = "South",
  Center = "Center",
  WestBank = "West Bank",
}

export interface IOrganization {
  _id: string; 
  name: string; 
  resources: {
    name: string; 
    amount: number; 
  }[];
  budget: number; 
}