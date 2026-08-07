import { LibrarianDashboard } from "./LibrarianDashboard";
import { ReceptionistDashboard } from "./ReceptionistDashboard";
import { AdminDashboard } from "./AdminDashboard";
import { DefaultDashboard } from "./DefaultDashboard";

export function DashboardDispatcher() {
  const userRole = sessionStorage.getItem("userRole");

  switch (userRole) {
    case "Admin":
      return <AdminDashboard />;
    case "Librarian":
      return <LibrarianDashboard />;
    case "Receptionist":
      return <ReceptionistDashboard />;
    default:
      return <DefaultDashboard />;
  }
}
