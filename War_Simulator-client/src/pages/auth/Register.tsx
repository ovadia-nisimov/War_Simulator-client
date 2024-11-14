import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  OrganizationsEnum,
  IDFRegionsEnum,
} from "../../types/organizationsEnum";
import { Link } from "react-router-dom";
import "../../index.css";

export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [organization, setOrganization] = useState("");
  const [region, setRegion] = useState("");
  const [organizations, setOrganizations] = useState<string[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrganizations = async () => {
      try {
        const response = await fetch(
          "http://localhost:3500/api/organizations/names"
        );
        const data = await response.json();
        setOrganizations(data);
      } catch (error) {
        console.error("Error fetching organizations:", error);
      }
    };
    fetchOrganizations();
  }, []);

  const handleRegister = async () => {
    try {
      const response = await fetch("http://localhost:3500/api/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password, organization, region }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      navigate("/login");
    } catch (error) {
      console.error("Error registering user:", error);
    }
  };

  return (
    <div>
      <h2>Register</h2>
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
        <div>
          <label>Organization:</label>
          <select
            value={organization}
            onChange={(e) => setOrganization(e.target.value)}
          >
            <option value="">Select Organization</option>
            {organizations.map((org) => (
              <option key={org} value={org}>
                {org}
              </option>
            ))}
          </select>
        </div>
        {organization === OrganizationsEnum.IDF && (
          <div>
            <label>Region:</label>
            <select value={region} onChange={(e) => setRegion(e.target.value)}>
              <option value="">Select Region</option>
              {Object.values(IDFRegionsEnum).map((region) => (
                <option key={region} value={region}>
                  {region}
                </option>
              ))}
            </select>
          </div>
        )}
        <button type="button" onClick={handleRegister}>
          Register
        </button>
        <p>
        Are you registered? Log in<Link to="/login">here</Link>
        </p>
      </form>
    </div>
  );
}