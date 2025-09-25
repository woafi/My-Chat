import { BrowserRouter as Router } from "react-router-dom";
import AppRoutes from "./Components/AppRoutes";
import { AuthProvider } from "./contexts/AuthContext";
import { SocketProvider } from "./contexts/SocketContext";
import { NotificationProvider } from "./contexts/NotificationContext";
import { HelmetProvider } from "@dr.pogodin/react-helmet";

function App() {
  return (
    <HelmetProvider>
      <Router>
        <AuthProvider>
          <SocketProvider>
            <NotificationProvider>
              <AppRoutes />
            </NotificationProvider>
          </SocketProvider>
        </AuthProvider>
      </Router>
    </HelmetProvider>
  );
}

export default App;
