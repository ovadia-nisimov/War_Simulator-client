import { IAttack } from "./attack";
import { IUser } from "./user";

export enum DataStatus {
  LOADING = "LOADING", 
  SUCCESS = "SUCCESS", 
  FAILED = "FAILED", 
  IDLE = "IDLE", 
}

export interface userState {
  error: string | null; 
  status: DataStatus;
  user: null | IUser; 
}

export interface attacksState {
  error: string | null; 
  status: DataStatus;
  attacks: IAttack[]; 
}