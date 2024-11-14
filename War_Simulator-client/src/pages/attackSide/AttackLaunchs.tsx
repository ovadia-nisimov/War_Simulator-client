// src/pages/AttackLaunchs.tsx

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../store/store";
import { fetchAttacks, addAttack } from "../../store/slices/AttacksSlice";
import { IAttack } from "../../types/attack";
import { socket } from "../../main";
import "../../index.css";

export default function AttackLaunchs() {
  const dispatch = useAppDispatch();
  const { attacks, status, error } = useAppSelector((state) => state.attacks);

  useEffect(() => {
    dispatch(fetchAttacks());

    socket.on("attackLaunched", (newAttack: IAttack) => {
      dispatch(addAttack(newAttack));
    });

    return () => {
      socket.off("attackLaunched");
    };
  }, [dispatch]);

  return (
    <div className="attack-launchs">
      <h2>User's Attacks</h2>

      {status === "LOADING" && <p>Loading attacks...</p>}
      {error && <p style={{ color: "red" }}>Error: {error}</p>}

      {status === "SUCCESS" && attacks.length === 0 && (
        <p>No attacks found for this user.</p>
      )}

      {status === "SUCCESS" && attacks.length > 0 && (
        <ul className="attack-list">
          {attacks.map((attack: IAttack) => (
            <li key={attack._id}>
              <strong>Missile Name:</strong> {attack.name}<br />
              <strong>Region Attacked:</strong> {attack.regionAttacked}<br />
              <strong>Time to Hit:</strong> {attack.timeToHit} seconds<br />
              <strong>Status:</strong> {attack.interceptedId ? "Intercepted" : "In Progress"}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}