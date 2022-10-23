import * as React from "react"
import "./LoggedOut.css"
import LoginForm from "../LoginForm/LoginForm"
import bgImage from './coffee.jpg'
import { useState, useEffect } from "react"
import axios from "axios"


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