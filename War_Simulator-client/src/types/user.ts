export interface IUser {
  _id: string; 
  username: string; 
  password: string; 
  organization: string; 
  region?: string; 
  userMissiles: {
    name: string;
    amount: number; 
  }[];
  userBudget: number; 
  isAttacker: boolean; 
}