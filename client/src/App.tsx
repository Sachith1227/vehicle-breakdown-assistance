import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";import WelcomePage from "./pages/WelcomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import VehiclesPage from "./pages/VehiclesPage";
import RequestsPage from "./pages/RequestsPage";
import NewRequestPage from "./pages/NewRequestPage";
import RequestDetailsPage from "./pages/RequestDetailsPage";
import MechanicDashboardPage from "./pages/MechanicDashboardPage";

import ProtectedRoute from "./components/ProtectedRoute";
import RoleRoute from "./components/RoleRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* =========================
            PUBLIC ROUTES
        ========================== */}

        <Route
          path="/"
          element={<WelcomePage />}
        />

        <Route
          path="/login"
          element={<LoginPage />}
        />

        <Route
          path="/register"
          element={<RegisterPage />}
        />


        {/* =========================
            DRIVER ROUTES
        ========================== */}

        <Route
          path="/dashboard"
          element={
            <RoleRoute allowedRoles={["DRIVER"]}>
              <DashboardPage />
            </RoleRoute>
          }
        />

        <Route
          path="/vehicles"
          element={
            <RoleRoute allowedRoles={["DRIVER"]}>
              <VehiclesPage />
            </RoleRoute>
          }
        />

        <Route
          path="/requests"
          element={
            <RoleRoute allowedRoles={["DRIVER"]}>
              <RequestsPage />
            </RoleRoute>
          }
        />

        <Route
          path="/requests/new"
          element={
            <RoleRoute allowedRoles={["DRIVER"]}>
              <NewRequestPage />
            </RoleRoute>
          }
        />

        <Route
          path="/requests/:id"
          element={
            <ProtectedRoute>
              <RequestDetailsPage />
            </ProtectedRoute>
          }
        />


        {/* =========================
            MECHANIC ROUTES
        ========================== */}

        <Route
          path="/mechanic"
          element={
            <RoleRoute allowedRoles={["SERVICE_PROVIDER"]}>
              <MechanicDashboardPage />
            </RoleRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;