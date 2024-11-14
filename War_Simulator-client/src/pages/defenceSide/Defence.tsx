import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../store/store";
import { fetchAttacksByRegion } from "../../store/slices/AttacksSlice";
import { IUser } from "../../types/user";
import { IAttack } from "../../types/attack";
import { socket } from "../../main";
import "../../index.css";

export default function Defence() {
  const user = useAppSelector((state) => state.user.user) as IUser;
  const [activeMissiles, setActiveMissiles] = useState<{ name: string; amount: number }[]>([]);
  const regionAttacks = useAppSelector((state) => state.attacks.attacks);
  const [selectedMissile, setSelectedMissile] = useState<{ [attackId: string]: string }>({});
  const dispatch = useAppDispatch();

  useEffect(() => {
    setActiveMissiles(user.userMissiles.filter((missile) => missile.amount > 0) || []);
  }, [user.userMissiles]);

  useEffect(() => {
    if (regionAttacks.length === 0) {
      dispatch(fetchAttacksByRegion());
    }

    socket.on("attackIntercepted", (updatedAttack: IAttack) => {
      dispatch(fetchAttacksByRegion());
    });

    return () => {
      socket.off("attackIntercepted");
    };
  }, [dispatch, regionAttacks.length]);

  const handleSelectMissile = (attackId: string, missileName: string) => {
    setSelectedMissile((prev) => ({ ...prev, [attackId]: missileName }));
  };

  const handleIntercept = (attackId: string) => {
    const missileName = selectedMissile[attackId];
    const interceptorId = user._id;
    
    if (!missileName) {
      alert("Please select a missile first.");
      return;
    }

    socket.emit("interceptAttack", { attackId, missileName, interceptorId });
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
                
                <select onChange={(e) => handleSelectMissile(attack._id, e.target.value)} value={selectedMissile[attack._id] || ""}>
                  <option value="">Select Missile</option>
                  {activeMissiles.map((missile) => (
                    <option key={missile.name} value={missile.name}>
                      {missile.name} x {missile.amount}
                    </option>
                  ))}
                </select>

                <button
                  onClick={() => handleIntercept(attack._id)}
                  disabled={!selectedMissile[attack._id]}
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