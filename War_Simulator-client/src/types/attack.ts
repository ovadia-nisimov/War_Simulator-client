export interface IAttack {
  _id: string; 
  name: string; 
  timeToHit: number;
  regionAttacked: string; 
  attackerId: string; 
  interceptedId?: string;
  intercepted: boolean;
}