import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { Navigate } from "react-router-dom";

import Home from "./pages/Home";
import About from "./pages/About";
import Menu from "./pages/Menu";
import UserMenu from "./pages/UserMenu";
import Reservation from "./pages/Reservation";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ReservationMenu from "./pages/ReservationMenu";
import MyReservationStatus from "./pages/MyReservationStatus";
import AdminReservation from "./pages/AdminReservation";
import AdminUsers from "./pages/AdminUsers";

import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <div>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/menu" element={<UserMenu />} />
        <Route path="/reservation" element={<Reservation />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin" element={<Navigate to="/dashboard" replace />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

<Route
  path="/admin/menu"
  element={
    <ProtectedRoute>
      <Menu />
    </ProtectedRoute>
  }
/>

<Route
  path="/admin/reservation"
  element={
    <ProtectedRoute>
      <AdminReservation />
    </ProtectedRoute>
  }
/>
<Route
  path="/admin/users"
  element={
    <ProtectedRoute>
      <AdminUsers />
    </ProtectedRoute>
  }
/>


        <Route path="/reservation-menu" element={<ReservationMenu />} />
        <Route path="/my-reservations" element={<MyReservationStatus />} />
      </Routes>

      <Footer />
    </div>
  );
}



export default App;