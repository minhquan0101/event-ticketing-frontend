import {  Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Events from "../pages/Events";
import VerifyEmail from "../pages/VerifyEmail";
import OrderHistory from "../pages/OrderHistory";
import OrderForm from "../pages/OrderForm";
import AdminEventForm from "../pages/AdminEventForm";

export default function AppRoutes() {
  return (
    
      <Routes>
        <Route path="/" element={<Events />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/orders" element={<OrderHistory />} />
        <Route path="/order/:eventId" element={<OrderForm />} />
        <Route path="/admin/events" element={<AdminEventForm />} />

      </Routes>
    
  );
}
