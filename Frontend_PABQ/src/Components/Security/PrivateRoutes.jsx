import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext"; // Update path if needed


const PrivateRoutes = ({ children }) => {
    const { isAuthenticated } = useAuth();

    return isAuthenticated ? children : <Navigate to="/" />;
};

export default PrivateRoutes;
