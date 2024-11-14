// src/components/Logout.tsx

import { useAppDispatch } from "../store/store";
import { logout } from "../store/slices/userSlice";
import { useNavigate } from "react-router-dom";
import "../index.css";

const Logout = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return <button className="logout-button" onClick={handleLogout}>Logout</button>;
};

export default Logout;