export interface IAttack {
  _id: string; 
  name: string; 
  tymeToHit: number; 
  intercepts: string[];
  id_attacker: string; 
  id_intercepted?: string; 
  AttackArea: string;
  status: string
}
