import * as React from "react"
import "./LoggedOut.css"
import LoginForm from "../LoginForm/LoginForm"

export default function LoggedOut(props) {

    return (
        <div className="logged-out">
                <div className="parallax">
                        <div className="box">
                            <LoginForm setSessionToken={props.setSessionToken} sessionToken={props.sessionToken}/>
                        </div>
                </div>
           
        </div>
    )
}