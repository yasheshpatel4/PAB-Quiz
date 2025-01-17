import React from 'react'
import EnterNavbar from "../navbar/EnterNavbar"
import Demofile from "./Demofile"

function DefaultQuiz() {
    return (
        <EnterNavbar>
            <div className="h-full">
                <Demofile />
            </div>
        </EnterNavbar>
    )
}

export default DefaultQuiz

