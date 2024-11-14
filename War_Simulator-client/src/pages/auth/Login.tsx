// src/pages/Login.tsx

import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../store/store";
import { useNavigate } from "react-router-dom";
import { fetchLogin } from "../../store/slices/userSlice";
import { Link } from "react-router-dom";
import "../../index.css";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.user.user);
  const error = useAppSelector((state) => state.user.error);
  const status = useAppSelector((state) => state.user.status);

  useEffect(() => {
    if (status === "SUCCESS" && user) {
      navigate("/home");
    }
  }, [status, user]);

  const handleLogin = async () => {
    await dispatch(fetchLogin({ username, password }));
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={(e) => e.preventDefault()}>
        <div>
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="button" onClick={handleLogin}>
          Login
        </button>
      </form>
      <p>
        Not registered? Register <Link to="/register">here</Link>
      </p>
      {error && <p style={{ color: "red" }}>Login failed: {error}</p>}
    </div>
  );
}