"use client"

import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"

function LogOut() {
  const navigate = useNavigate()

  const handleLogout = async () => {
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
  }

  useEffect(() => {
    handleLogout()
  }, [handleLogout]) // Added handleLogout to the dependency array

  return null // This component doesn't render anything
}

export default LogOut

