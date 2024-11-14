// src/pages/AttackLaunchs.tsx

import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../store/store";
import { fetchAttacks, addAttack } from "../../store/slices/AttacksSlice";
import { IAttack } from "../../types/attack";
import { socket } from "../../main";
import "../../index.css";

export default function AttackLaunchs() {
  const dispatch = useAppDispatch();
  const { attacks, status, error } = useAppSelector((state) => state.attacks);
  const [updatedAttacks, setUpdatedAttacks] = useState<IAttack[]>([]);
  const [activeAttackId, setActiveAttackId] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchAttacks());
  }, [dispatch]);

  useEffect(() => {
    setUpdatedAttacks(attacks);
  }, [attacks]);

  // Listen for a new attack launch and update active attack
  useEffect(() => {
    socket.on("attackLaunched", (newAttack: IAttack) => {
      dispatch(addAttack(newAttack));
      setActiveAttackId(newAttack._id); // Set the active attack ID for the launched attack
      setUpdatedAttacks((prevAttacks) => [...prevAttacks, newAttack]);
    });

    return () => {
      socket.off("attackLaunched");
    };
  }, [dispatch]);

  // Function to update attack status on the server
  const updateAttackStatus = async (attackId: string, status: string) => {
    try {
      const response = await fetch("http://localhost:3500/api/attacks/update-status", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ attackId, status }),
      });
      if (!response.ok) throw new Error("Failed to update attack status");
      const updatedAttack = await response.json();

      setUpdatedAttacks((prevAttacks) =>
        prevAttacks.map((attack) => (attack._id === updatedAttack._id ? updatedAttack : attack))
      );
    } catch (error) {
      console.error("Error updating attack status:", error);
    }
  };

  // Timer for the active attack
  useEffect(() => {
    if (!activeAttackId) return;

    const interval = setInterval(() => {
      setUpdatedAttacks((prevAttacks) =>
        prevAttacks.map((attack) => {
          if (attack._id !== activeAttackId || attack.intercepted || attack.timeToHit <= 0) {
            return attack;
          }

          const updatedTime = attack.timeToHit - 1;
          if (updatedTime === 0) {
            updateAttackStatus(attack._id, "Hit"); // Call the update status function when time reaches 0
            setActiveAttackId(null); // Reset activeAttackId so the timer stops running
          }
          return {
            ...attack,
            timeToHit: updatedTime,
            status: updatedTime === 0 ? "Hit" : "Launched",
          };
        })
      );
    }, 1000);

    return () => clearInterval(interval);
  }, [activeAttackId]);

  return (
    <div className="attack-launchs">
      <h2>User's Attacks</h2>

      {status === "LOADING" && <p>Loading attacks...</p>}
      {error && <p style={{ color: "red" }}>Error: {error}</p>}

      {status === "SUCCESS" && updatedAttacks.length === 0 && (
        <p>No attacks found for this user.</p>
      )}

      {status === "SUCCESS" && updatedAttacks.length > 0 && (
        <ul className="attack-list">
          {updatedAttacks.map((attack) => (
            <li key={attack._id}>
              <strong>Missile Name:</strong> {attack.name}<br />
              <strong>Region Attacked:</strong> {attack.regionAttacked}<br />
              <strong>Time to Hit:</strong> {attack.timeToHit} seconds<br />
              <strong>Status:</strong> {attack.status}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}