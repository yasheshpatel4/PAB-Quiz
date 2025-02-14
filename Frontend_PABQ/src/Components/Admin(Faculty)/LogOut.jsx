"use client"

import { useEffect, useCallback } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"

function LogOut() {
  const navigate = useNavigate()

  const handleLogout = useCallback(async () => {
    if (window.confirm("Are you sure to logout ???")) {
      try {
        const response = await axios.post(
          "http://localhost:8080/auth/admin/logout",
          {},
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          },
        )
        console.log(response.data)
        localStorage.removeItem("token")
        localStorage.removeItem("adminEmail")
        localStorage.removeItem("question")
        localStorage.removeItem("quizid")
        navigate("/adminlogin")
      } catch (error) {
        console.error("Logout failed", error)
        alert("Logout failed, please try again.")
      }
    } else {
      navigate('/admin')
    }
  }, [navigate]) // Memoizing the function

  useEffect(() => {
    handleLogout()
  }, []) // Removed handleLogout from dependencies to avoid multiple calls

  return null // This component doesn't render anything
}

export default LogOut
