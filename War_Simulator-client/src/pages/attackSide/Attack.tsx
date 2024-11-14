// src/pages/Attack.tsx

import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../store/store";
import { createAttack } from "../../store/slices/AttacksSlice";
import { IUser } from "../../types/user";
import "../../index.css";

export default function Attack() {
  const user = useAppSelector((state) => state.user.user) as IUser;
  const [activeMissiles, setActiveMissiles] = useState<{ name: string; amount: number }[]>([]);
  const [regionAttacked, setRegionAttacked] = useState<string>("");
  const dispatch = useAppDispatch();

  useEffect(() => {
    setActiveMissiles(() => user?.userMissiles.filter((missile) => missile.amount > 0) || []);
  }, [user?.userMissiles]);

  const handleLaunch = (missileName: string) => {
    if (!regionAttacked) {
      console.error("Please select a region to attack.");
      return;
    }

    dispatch(createAttack({ missileName, regionAttacked, attackerId: user._id }));
    setActiveMissiles((prevMissiles) =>
      prevMissiles.map((missile) =>
        missile.name === missileName && missile.amount > 0
          ? { ...missile, amount: missile.amount - 1 }
          : missile
      )
    );
  };

  return (
    <div className="attack">
      <h2>Attack Page</h2>
      <h3>Organization: {user.organization}</h3>
      <h3>Location:</h3>
      <select value={regionAttacked} onChange={(e) => setRegionAttacked(e.target.value)}>
        <option value="">Select Region</option>
        <option value="North">North</option>
        <option value="South">South</option>
        <option value="Center">Center</option>
        <option value="West Bank">West Bank</option>
      </select>
      <h3>Available Ammo</h3>
      <div className="missile-list">
        {activeMissiles.map((missile) => (
          <button
            key={missile.name}
            disabled={missile.amount <= 0 || !regionAttacked}
            onClick={() => handleLaunch(missile.name)}
          >
            {missile.name} x {missile.amount}
          </button>
        ))}
      </div>
    </div>
  );
}