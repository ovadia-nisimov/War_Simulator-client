import { useEffect, useState } from 'react';
import { useAppSelector } from '../store/store';
import './Attack.css';

interface LaunchedRocket {
  name: string;
  timeToHit: string;
  status: string;
}

export default function Attack() {
  const { user } = useAppSelector((state) => state.user);

  const [launchedRockets, setLaunchedRockets] = useState<LaunchedRocket[]>([]);

  // דוגמא לנתוני התקפות מושקות (תוכל לשנות זאת בעתיד כדי לקבל נתונים מסוקטים)
  useEffect(() => {
    const initialRockets: LaunchedRocket[] = [
      { name: 'Grad', timeToHit: '2:42m', status: 'Launched' },
      { name: 'Grad', timeToHit: '0m', status: 'Hit' },
      { name: 'Kasam', timeToHit: '0m', status: 'Intercepted' },
    ];
    setLaunchedRockets(initialRockets);
  }, []);

  return (
    <div className="attack-container">
      <h2>Organization: {user?.organization}</h2>

      <div className="ammo-section">
        <h4>Available Ammo</h4>
        <div className="ammo-list">
          {user?.missiles.map((missile, index) => (
            <span key={index} className="ammo-item">
              {missile.type} x {missile.quantity}
            </span>
          ))}
        </div>
      </div>

      <h3>Launched Rockets</h3>
      <table className="rockets-table">
        <thead>
          <tr>
            <th>Rocket</th>
            <th>Time to Hit</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {launchedRockets.map((rocket, index) => (
            <tr key={index}>
              <td>{rocket.name}</td>
              <td>{rocket.timeToHit}</td>
              <td className={rocket.status.toLowerCase()}>{rocket.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
