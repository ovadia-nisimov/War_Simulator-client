export interface IUser {
  _id: string; 
  username: string; 
  organization: string; 
  area?: string; 
  missiles: {
    type: string;
    quantity: number; 
  }[];
  userBudget: number;
  isAttacker: boolean;
}
