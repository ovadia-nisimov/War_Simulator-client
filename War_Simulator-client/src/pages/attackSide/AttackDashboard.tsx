// src/pages/AttackDashboard.tsx

import Logout from "../../components/Logout";
import Attack from "./Attack";
import AttackLaunchs from "./AttackLaunchs";
import "../../index.css"

export default function AttackDashboard() {
  return (
    <div>
      <h1>Attack Dashboard</h1>
      <Logout />
      <section>
        <Attack />
      </section>

      <hr />

      <section>
        <AttackLaunchs />
      </section>
    </div>
  );
}