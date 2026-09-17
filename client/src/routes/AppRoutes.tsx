import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Home from "../pages/Home";
import Results from "../pages/Results";
import Listing from "../pages/Listing";
import Booking from "../pages/Booking";
import Register from "../pages/Register";
import Login from "../pages/Login";
import MyBookings from "../pages/MyBookings";
import ConfirmationPage from "../pages/Confirmation";

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/results" element={<Results />} />

      <Route path="/listing/:id" element={<Listing />} />

      <Route path="/booking/:id" element={<Booking />} />
      <Route path="/confirmation/:bookingId" element={<ConfirmationPage />} />

      <Route path="/auth/register" element={<Register />} />
      <Route path="/auth/login" element={<Login />} />

      <Route path="/mybookings" element={<MyBookings />} />
      <Route path="/bookings/me" element={<Navigate to="/mybookings" replace />} />
    </Routes>
  );
};

export default AppRoutes;