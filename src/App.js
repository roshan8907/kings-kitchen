import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import About from "./pages/About";
import Menu from "./pages/Menu";
import UserMenu from "./pages/UserMenu";
import Reservation from "./pages/Reservation";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";



function App() {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
 <Route path="/admin/menu" element={<Menu />} />
        <Route path="/menu" element={<UserMenu />} />
        <Route path="/reservation" element={<Reservation />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
    <Route path="/admin" element={<Dashboard />} />
      </Routes>
    </div>
  );
}

export default App;