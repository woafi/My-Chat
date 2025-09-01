import { BrowserRouter as Router } from "react-router-dom";
import AppRoutes from "./Components/AppRoutes";
import { AuthProvider } from "./contexts/AuthContext";
import { SocketProvider } from "./contexts/SocketContext";
import { HelmetProvider } from "@dr.pogodin/react-helmet";

function App() {
  return (
    <HelmetProvider>
      <Router>
        <AuthProvider>
          <SocketProvider>
            <AppRoutes />
          </SocketProvider>
        </AuthProvider>
      </Router>
    </HelmetProvider>
  );
}

export default App;
