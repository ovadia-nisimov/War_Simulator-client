import { Navigate, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Attack from "./pages/Attack";

export default function App() {

  

  return (
    <div>
      
      <Routes>
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="/" element={<Navigate to={"/login"} />} />
        <Route path="attack" element={<Attack />}></Route>
      </Routes>
    </div>
  );
}
