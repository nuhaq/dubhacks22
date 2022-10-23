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
                    <h2 className="text-header">Today's Trending Books:</h2>

                <h2 className="about-header">About Us: </h2>
                <div className="about-us">
                    <div className="about-text">
                            This website makes reading a full experience. 
                            With personalized playlists for any book you're reading, you always have 
                            something to listen to that lets you fully engage with your next read. 
                            Create lists, save books, and share your thoughts with friends!
                    </div>

                </div>
                </div>
           
        </div>
    )
}