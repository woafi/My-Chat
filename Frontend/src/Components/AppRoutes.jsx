import { Routes, Route } from "react-router-dom";
import SignIn_SignUp from "./pages/SignIn_SignUp";
import Layout from "./Layout"
import Inbox from "./pages/Inbox";
import Users from "./pages/Users";
import Profile from "./pages/Profile";
import PrivateRoute from "./PrivateRoute";
import PublicRoute from "./PublicRoute";
import ResetPassword from './pages/ResetPassword';
import NotFound from "./pages/NotFoundPage";
import Notifications from "./pages/Notifications";

function AppRoutes() {
  return (
    <Routes>
      {/* Public Route */}
      <Route element={<PublicRoute />}>
        <Route path="/" element={<SignIn_SignUp />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
      </Route>

      {/* Grouped Protected Routes */}
      <Route element={<PrivateRoute />}>
        <Route element={<Layout />}>
          <Route path="/inbox" element={<Inbox />} />
          <Route path="/user" element={<Users />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/notifications" element={<Notifications />} />
        </Route>
      </Route>

      {/* Catch-all 404 Route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default AppRoutes;
