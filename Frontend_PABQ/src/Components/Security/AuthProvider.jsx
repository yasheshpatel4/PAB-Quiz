import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [role, setRole] = useState(null); // Added role state

    // Check authentication status
    const checkAuthStatus = async () => {
        try {
            const response = await fetch("/auth-status", { credentials: "include" });
            if (response.ok) {
                const data = await response.json();
                setIsLoggedIn(true);
                setRole(data.role); // Example: data.role = "admin" or "student"
                localStorage.setItem("userRole", data.role);
            } else {
                setIsLoggedIn(false);
                setRole(null);
                localStorage.removeItem("userRole");
            }
        } catch {
            setIsLoggedIn(false);
            setRole(null);
            localStorage.removeItem("userRole");
        }
    };

    // Automatically check auth status on app load
    useEffect(() => {
        checkAuthStatus();
    }, []);

    return (
        <AuthContext.Provider value={{ isLoggedIn, role, checkAuthStatus }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
