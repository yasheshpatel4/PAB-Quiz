"use client"

import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"

function Logout() {
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      const response = await axios.post(
        "http://13.232.135.2:8080/api/students/logout",
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      )
      console.log(response.data) // Log instead of alert for better UX
      localStorage.removeItem("token")
      localStorage.removeItem("studentEmail")
      localStorage.removeItem("studentID")
      navigate("/studentlogin")
    } catch (error) {
      console.error("Logout failed", error)
      alert("Logout failed, please try again.")
    }
  }

  useEffect(() => {
    handleLogout()
  }, [handleLogout]) // Added handleLogout to dependencies

  return null // This component doesn't render anything
}

export default Logout

