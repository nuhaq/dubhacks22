import * as React from "react"
import axios from "axios"
import {BrowserRouter, Routes, Route} from "react-router-dom"
import { useState, useEffect } from "react"
import NavBar from "../NavBar/NavBar"
import LoggedOut from "../LoggedOut/LoggedOut"
import Payment from "../Payment/Payment"
import Stats from "../Stats/Stats"
import NotFound from "../NotFound/NotFound"
import Browse from "../Browse/Browse"

export default function App() {
    const [sessionToken, setSessionToken] = useState((localStorage.getItem('sessionToken')))
    const [spotifyToken, setSpotifyToken] = useState(localStorage.getItem("token"))


    return (
        <div className="app">
            <BrowserRouter>
            <NavBar sessionToken={sessionToken} setSessionToken={setSessionToken} spotifyToken={spotifyToken} setSpotifyToken={setSpotifyToken}/>
            <Routes>
            <Route path="/" element={<LoggedOut sessionToken={sessionToken} setSessionToken={setSessionToken}/>}/>
                <Route path="/profile" />
                <Route path="/browse" element={<Browse sessionToken={sessionToken} />}/>
                <Route path="/payment" element={<Payment sessionToken={sessionToken}/>}/>
                <Route path="/stats" element={<Stats sessionToken={sessionToken}/>}/>
                <Route path="*" element={<NotFound/>}/>
            </Routes>
            </BrowserRouter>
        </div>
    )
}