export enum organizationsEnum {
  IDF_North = "IDF - North", 
  IDF_South = "IDF - South", 
  IDF_Center = "IDF - Center", 
  IDF_West_Bank = "IDF - West Bank", 
  Hezbollah = "Hezbollah", 
  Hamas = "Hamas", 
  IRGC = "IRGC", 
  Houthis = "Houthis", 
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
