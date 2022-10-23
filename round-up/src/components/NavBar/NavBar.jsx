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
      <Link to="/home"><p id="nav-button">Home</p></Link>
      <Link to="/search"><p id="nav-button">Search</p></Link>
      <Link to="/library"><p id="nav-button">My Library</p></Link>
      <Link to="/playlist"><p id="nav-button">Playlist Gen</p></Link>
      <p onClick={(e) => {logout(e)}} id="nav-button" >Logout</p>
      <div className={loggedOut ? "navbar-div" : "hidden"}>logged out!</div>
    </nav>
    )
}