import * as React from "react"
import {Link} from "react-router-dom"
import "./NavBar.css"
import axios from "axios"
import logo from './logo.png'
import { useState } from "react"

export default function NavBar(props) {
  const [loggedOut, setLoggedOut] = useState(false)

  async function logout(event) {
    if (!props.sessionToken) return
    event.preventDefault()
    await axios.post(`http://localhost:3001/logout`, {
      "sessionToken" : props.sessionToken
      })
    setLoggedOut(true)
    setTimeout(() => {setLoggedOut(false)}, 700)
    props.setSessionToken(null)
    localStorage.removeItem("sessionToken")
    if (props.spotifyToken) {
      props.setSpotifyToken("")
      localStorage.removeItem("token")
    }
  }
    return (
    <nav className="navbar">
      <Link to="/"><img id="nav-pic" src={logo}/></Link>
      <Link to="/browse"><p id="nav-button">Browse</p></Link>
      <Link to="/payment"><p id="nav-button">Payments</p></Link>
      <Link to="/stats"><p id="nav-button">Stats</p></Link>
      <p onClick={(e) => {logout(e)}} id="nav-button" >Logout</p>
      <div className={loggedOut ? "navbar-div" : "hidden"}>logged out!</div>
    </nav>
    )
}