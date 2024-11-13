import { useState, useEffect } from "react";
import "../index.css";
import { useNavigate } from "react-router-dom";

interface Organization {
  _id: string;
  name: string;
}

export default function Register() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [organization, setOrganization] = useState("");
  const [area, setArea] = useState("");
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [idfAreas, setIdfAreas] = useState<Organization[]>([]);

  useEffect(() => {
    const fetchOrganizations = async () => {
      try {
        const response = await fetch("http://localhost:3500/api/organizations");
        if (!response.ok) throw new Error("Failed to fetch organizations");
        const data = await response.json();

        const uniqueOrganizations = data.map((org: Organization) => ({
          ...org,
          name: org.name.split(" - ")[0], 
        }));

        setOrganizations(uniqueOrganizations);

        const idfOrganizations = data.filter((org: Organization) =>
          org.name.startsWith("IDF")
        );
        setIdfAreas(idfOrganizations);
      } catch (error) {
        console.log(error);
      }
    };

    fetchOrganizations();
  }, []);

  const handleRegister = async () => {
    try {
      const requestBody: any = {
        username,
        password,
        organization,
      };

      if (area) {
        requestBody.area = area; 
      }

      const response = await fetch("http://localhost:3500/api/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) throw new Error("Failed to register");
      else {
        console.log(await response.json());
        navigate("/login");
      }
    } catch (error) {
      console.log((error as Error).message);
    }
  };

  return (
    <div className="register">
      <input
        type="text"
        placeholder="User Name"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      <select
        value={organization}
        onChange={(e) => setOrganization(e.target.value)}
        required
      >
        <option value="">Select Organization</option>
        {Array.from(new Set(organizations.map(org => org.name))).map((orgName) => (
          <option key={orgName} value={orgName}>
            {orgName}
          </option>
        ))}
      </select>

      {organization === "IDF" && (
        <select
          value={area}
          onChange={(e) => setArea(e.target.value)}
          required
        >
          <option value="">Select Area</option>
          {idfAreas.map((idfArea) => (
            <option key={idfArea._id} value={idfArea.name.split(" - ")[1]}>
              {idfArea.name.split(" - ")[1]}
            </option>
          ))}
        </select>
      )}

      <button onClick={handleRegister}>Register</button>
    </div>
  );
}
