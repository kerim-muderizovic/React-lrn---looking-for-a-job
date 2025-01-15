import { useState } from "react";
import { useLocation ,Navigate} from "react-router-dom";
import { useAuth } from "./AuthContext";
import { Outlet } from "react-router-dom";
const RequireAuth = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const location = useLocation();
    const {authUser}=useAuth();
 return (
    authUser ? <Outlet /> : <Navigate to="/login" state={{ from: location }} replace />
  );

}
export default RequireAuth;