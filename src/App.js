import { Routes, Route, Navigate } from "react-router-dom";

// Application routing configuration for public, user, and admin pages.

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import About from "./pages/About";
import UserMenu from "./pages/UserMenu";
import Reservation from "./pages/Reservation";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ReservationMenu from "./pages/ReservationMenu";
import MyReservationStatus from "./pages/MyReservationStatus";
import Menu from "./pages/Menu";
import AdminReservation from "./pages/AdminReservation";
import AdminUsers from "./pages/AdminUsers";

function App() {
  return (
    <div>
      <Navbar />

      <Routes>
        {/* PUBLIC PAGES */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/menu" element={<UserMenu />} />
        <Route path="/reservation" element={<Reservation />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* ADMIN ENTRY */}
        <Route
          path="/admin"
          element={<Navigate to="/dashboard" replace />}
        />

        {/* LOGGED-IN USER ROUTES */}
        <Route
          path="/reservation-menu"
          element={
            <ProtectedRoute>
              <ReservationMenu />
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-reservations"
          element={
            <ProtectedRoute>
              <MyReservationStatus />
            </ProtectedRoute>
          }
        />

        {/* ADMIN DASHBOARD */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute adminOnly>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* ADMIN MENU */}
        <Route
          path="/admin/menu"
          element={
            <ProtectedRoute adminOnly>
              <Menu />
            </ProtectedRoute>
          }
        />

        {/* ADMIN RESERVATIONS */}
        <Route
          path="/admin/reservation"
          element={
            <ProtectedRoute adminOnly>
              <AdminReservation />
            </ProtectedRoute>
          }
        />

        {/* ADMIN USERS */}
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute adminOnly>
              <AdminUsers />
            </ProtectedRoute>
          }
        />
      </Routes>

      <Footer />
    </div>
  );
}

export default App;