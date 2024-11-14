import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./index.css";
import { RootState, useAppSelector } from "./store/store";
import Register from "./pages/auth/Register";
import Login from "./pages/auth/Login";
import AttackDashboard from "./pages/attackSide/AttackDashboard";
import DefenceSide from "./pages/defenceSide/Defence";


export default function App() {
  const { user } = useAppSelector((state: RootState) => state.user);
 
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