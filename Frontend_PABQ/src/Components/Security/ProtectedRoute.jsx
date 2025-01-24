import { Navigate } from "react-router-dom";

import { useAuth } from "./AuthProvider";

const ProtectedRoute = ({ children, role }) => {
    const { isLoggedIn, role: userRole } = useAuth();

    if (!isLoggedIn) {
        // Redirect to login if not logged in
        return <Navigate to="/" replace />;
    }

    if (role && userRole !== role) {
        // Redirect if the role doesn't match
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;
