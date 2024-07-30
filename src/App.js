import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./redux/store";
import Login from "./pages/login";
import Dashboard from "./pages/dashboard";
import Users from "./pages/users";
import CreateBooking from "./pages/createbooking";
import RescheduleBooking from "./pages/reschedulebooking";
import Layout from "./components/layout";
import "./app/globals.css";

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard/*" element={<DashboardWithLayout />} />
          <Route path="/create-booking" element={<CreateBooking />} />
          <Route
            path="/bookings/:bookingId/reschedule"
            element={<RescheduleBooking />}
          />
          <Route path="/users" element={<Users />} />
        </Routes>
      </Router>
    </Provider>
  );
}

// Example of DashboardWithLayout component that wraps Dashboard in Layout
const DashboardWithLayout = () => (
  <Layout>
    <Routes>
      <Route index element={<Dashboard />} />
      {/* Other nested routes specific to Dashboard */}
    </Routes>
  </Layout>
);

export default App;
