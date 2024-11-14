// src/pages/Defence.tsx

import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../store/store";
import { fetchAttacksByRegion } from "../../store/slices/AttacksSlice";
import { IUser } from "../../types/user";
import { socket } from "../../main";
import "../../index.css";

export default function Defence() {
  const user = useAppSelector((state) => state.user.user) as IUser;
  const [activeMissiles, setActiveMissiles] = useState<{ name: string; amount: number }[]>([]);
  const regionAttacks = useAppSelector((state) => state.attacks.attacks);
  const dispatch = useAppDispatch();

  useEffect(() => {
    setActiveMissiles(user.userMissiles.filter((missile) => missile.amount > 0) || []);
  }, [user.userMissiles]);

  useEffect(() => {
    if (regionAttacks.length === 0) {
      dispatch(fetchAttacksByRegion());
    }
  }, [dispatch, regionAttacks.length]);

  const handleIntercept = (attackId: string, missileName: string) => {
    socket.emit("interceptAttack", { attackId, missileName });
    setActiveMissiles((prevMissiles) =>
      prevMissiles.map((missile) =>
        missile.name === missileName && missile.amount > 0
          ? { ...missile, amount: missile.amount - 1 }
          : missile
      )
    );
  };

  return (
    <div className="defense">
      <h2>Defense Page</h2>
      <h3>Organization: {user.organization}</h3>
      <h3>Location: {user.region}</h3>
      <h3>Available Ammo</h3>
      <div className="missile-list">
        {activeMissiles.map((missile) => (
          <button
            key={missile.name}
            disabled={missile.amount <= 0}
          >
            {missile.name} x {missile.amount}
          </button>
        ))}
      </div>
      <div className="attack-launchs">
        <h2>Attacks in Your Region</h2>

        {regionAttacks.length > 0 ? (
          <ul className="attack-list">
            {regionAttacks.map((attack) => (
              <li key={attack._id}>
                <strong>Missile Name:</strong> {attack.name}<br />
                <strong>Region Attacked:</strong> {attack.regionAttacked}<br />
                <strong>Time to Hit:</strong> {attack.timeToHit} seconds<br />
                <strong>Status:</strong> {attack.intercepted ? "Intercepted" : attack.timeToHit === 0 ? "Hit" : "In Progress"}<br />
                <button
                  disabled={!activeMissiles.some((missile) => missile.amount > 0 && missile.name === attack.name)}
                  onClick={() => handleIntercept(attack._id, attack.name)}
                >
                  Intercept
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p>No attacks found in your region.</p>
        )}
      </div>
    </div>
  );
}