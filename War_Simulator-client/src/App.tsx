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

  useEffect(() => {
    socket.on("attackLaunched", (newAttack: IAttack) => {
      dispatch(addAttack(newAttack));
    });

    return () => {
      socket.off("attackLaunched");
    };
  }, [dispatch]);

 
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