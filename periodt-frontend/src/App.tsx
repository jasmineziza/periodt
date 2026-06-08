import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Cycle from "./pages/Cycle";
import Wellness from "./pages/Wellness";
import Reminders from "./pages/Reminders";
import Profile from "./pages/Profile";
import ProtectedLayout from "./pages/ProtectedLayout";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />


      <Route element={<ProtectedLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/cycle" element={<Cycle />} />
        <Route path="/wellness" element={<Wellness />} />
        <Route path="/reminders" element={<Reminders />} />
        <Route path="/profile" element={<Profile />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
