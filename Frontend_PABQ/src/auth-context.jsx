"use client"

import { createContext, useContext, useState, useEffect } from "react"
import axios from "axios"

const AuthContext = createContext(undefined)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const adminEmail = localStorage.getItem("adminEmail")
    const studentEmail = localStorage.getItem("studentEmail")
    if (adminEmail) {
      setUser({ email: adminEmail, role: "admin" })
      setIsAuthenticated(true)
    } else if (studentEmail) {
      setUser({ email: studentEmail, role: "student" })
      setIsAuthenticated(true)
    }
  }, [])

  const login = async (email, password, role) => {
    try {
      const endpoint =
        role === "admin" ? "http://localhost:8080/auth/admin/login" : "http://localhost:8080/auth/student/login"

      const data = role === "admin" ? { email, password } : { email, studentID: password }

      const response = await axios.post(endpoint, data)

      if (response.data) {
        setUser({ email, role })
        setIsAuthenticated(true)
        localStorage.setItem(role === "admin" ? "adminEmail" : "studentEmail", email)
        if (role === "student") {
          localStorage.setItem("studentID", password)
        }
        return true
      }
    } catch (error) {
      console.error("Login failed:", error)
      return false
    }
  }

  const logout = async () => {
    try {
      const endpoint =
        user.role === "admin" ? "http://localhost:8080/auth/admin/logout" : "http://localhost:8080/api/students/logout"

      await axios.post(
        endpoint,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      )

      setUser(null)
      setIsAuthenticated(false)
      localStorage.removeItem("token")
      localStorage.removeItem("adminEmail")
      localStorage.removeItem("studentEmail")
      localStorage.removeItem("studentID")
      if (user.role === "admin") {
        localStorage.removeItem("question")
        localStorage.removeItem("quizid")
      }
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }

  return <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

