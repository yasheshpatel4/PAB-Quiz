import { Navigate, useLocation } from "react-router-dom"
import { useAuth } from "./auth-context"

export function ProtectedRoute({ children, requiredRole }) {
  const { user, isAuthenticated } = useAuth()
  const location = useLocation()

  if (!isAuthenticated) {
    return (
      <Navigate to={requiredRole === "admin" ? "/adminlogin" : "/studentlogin"} state={{ from: location }} replace />
    )
  }

  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to={user?.role === "admin" ? "/admin" : "/student"} replace />
  }

  return <>{children}</>
}

