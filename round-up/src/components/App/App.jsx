import * as React from "react"
import axios from "axios"
import {BrowserRouter, Routes, Route} from "react-router-dom"
import { useState, useEffect } from "react"
import NavBar from "../NavBar/NavBar"


import NotFound from "../NotFound/NotFound"
import Browse from "../Browse/Browse"

export default function App() {
    const [sessionToken, setSessionToken] = useState(localStorage.getItem('sessionToken'))
    const [spotifyToken, setSpotifyToken] = useState(localStorage.getItem("token"))
 





    /**
     * get trending books for landing page
     */
    // async function getTrending() {
    //     setFetching(true)
    //     const response = await axios.get(`https://openlibrary.org/trending/daily.json`)
    //     setTrends(response.data.works.slice(0, 7))
    //     setFetching(false)
    // }


    return (
        <div className="app">
            <BrowserRouter>
            <NavBar sessionToken={sessionToken} setSessionToken={setSessionToken} spotifyToken={spotifyToken} setSpotifyToken={setSpotifyToken}/>
            <Routes>
                {/* <Route path="/" element={<Home sessionToken={sessionToken} />}/> */}
                <Route path="/profile" />
                <Route path="/browse" element={<Browse />}/>
                <Route path="*" element={<NotFound/>}/>
            </Routes>
            </BrowserRouter>
        </div>
    )
}