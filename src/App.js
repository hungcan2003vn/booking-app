import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./redux/store";
import Login from "./pages/login";
import Dashboard from "./pages/dashboard";
import Users from "./pages/users";
import Layout from "./components/layout";
import "./app/globals.css";

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard/*" element={<DashboardWithLayout />} />
          <Route path="/users" element={<UsersWithLayout />} />
        </Routes>
      </Router>
    </Provider>
  );
}

const DashboardWithLayout = () => (
  <Layout>
    <Routes>
      <Route index element={<Dashboard />} />
      {/* Other nested routes specific to Dashboard */}
    </Routes>
  </Layout>
);

const UsersWithLayout = () => (
  <Layout>
    <Users />
  </Layout>
);

export default App;
