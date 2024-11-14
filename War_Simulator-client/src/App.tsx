// src/App.tsx

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./index.css";
import { RootState, useAppDispatch, useAppSelector } from "./store/store";
import Register from "./pages/auth/Register";
import Login from "./pages/auth/Login";
import AttackDashboard from "./pages/attackSide/AttackDashboard";
import DefenceSide from "./pages/defenceSide/Defence";
import { useEffect } from "react";
import { socket } from "./main";
import { IAttack } from "./types/attack";
import { addAttack } from "./store/slices/AttacksSlice";

export default function App() {
  const { user } = useAppSelector((state: RootState) => state.user);
  const dispatch = useAppDispatch();
  const attacks = useAppSelector((state) => state.attacks.attacks);

  useEffect(() => {
    socket.on("attackLaunched", (newAttack: IAttack) => {
      dispatch(addAttack(newAttack));
    });

    return () => {
      socket.off("attackLaunched");
    };
  }, [dispatch]);

  //   socket.on("intercepted", (attack: IAttack) => {
  //     dispatch(cancelAttack(attack));
  //   });

  //   return () => {
  //     socket.off("launched");
  //     socket.off("cancelAttack");
  //     localStorage.removeItem("Atoken");
  //     localStorage.removeItem("Dtoken");
  //   };
  // }, []);

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     attacks
  //       .filter((attack) => !attack.intercepted)
  //       .forEach((attack) => {
  //         if (attack.tymeToHit && attack.tymeToHit > 0) {
  //           dispatch(
  //             updateTimeLeft({ id: attack._id, timeLeft: attack.tymeToHit - 1 })
  //           );
  //         }
  //       });
  //   }, 1000);
  //   return () => clearInterval(interval);
  // }, [attacks, dispatch]);
  return (
    <div className="app">
      <BrowserRouter>
        <Routes>
          <Route path="register" element={<Register />} />
          <Route path="login" element={<Login />} />
          <Route path="/" element={<Navigate to={"/login"} />} />
          {user && (
            <Route
              path="/home"
              element={user.isAttacker ? <AttackDashboard /> : <DefenceSide />}
            />
          )}
        </Routes>
      </BrowserRouter>
    </div>
  );
}