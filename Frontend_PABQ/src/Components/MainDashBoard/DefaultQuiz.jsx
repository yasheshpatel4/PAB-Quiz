import EnterNavbar from "../NavBar/EnterNavbar"
import Demofile from "./Demofile"
import {useEffect} from 'react'

function DefaultQuiz() {
    useEffect(() => {
        const handleBeforeUnload = () => {
            localStorage.clear()
        }

        window.addEventListener("beforeunload", handleBeforeUnload)
        
        return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload)
        }
    }, [])
    return (
        <>
            <EnterNavbar>
                <Demofile />
            </EnterNavbar>
        </>
    )
}

export default DefaultQuiz
