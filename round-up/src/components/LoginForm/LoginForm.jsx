import * as React from "react"
import "./LoginForm.css"
import { createRef } from "react"
import axios from "axios"
import { useState, useEffect } from "react"


export default function LoginForm(props) {
    const [log, setLog] = useState(true)
    const username = createRef();
    const password = createRef();
    const passwordConf = createRef();
    const [name, setName] = useState("")

    async function getName() {
        const response = await axios.get(`http://localhost:3001/name/${props.sessionToken}`)
        setName(response.data)
    }
    useEffect(() => {
        if (props.sessionToken!==null) getName()
      },[])

        const login = async () => {
            try {
                const res = await axios.post(`http://localhost:3001/login`, {
                    "username" : username.current.value,
                    "password" : password.current.value
                    })
                props.setSessionToken(res.data.sessionToken)
                localStorage.setItem('sessionToken', res.data.sessionToken);
                setName(username.current.value)
            } catch (err) {
                alert("Wrong username or password.")
            }
        }

        const register = async () => {
            if (password.current.value!==passwordConf.current.value) {
                alert("Passwords do not match");
                return;
            }
            try {
                const res = await axios.post(`http://localhost:3001/register`, {
                    "username" : username.current.value,
                    "password" : password.current.value
                    })
                props.setSessionToken(res.data.sessionToken)
                localStorage.setItem('sessionToken', res.data.sessionToken);
                setName(username.current.value)
            } catch (err) {
                alert(err.response.data)
            }
        }


    return (
        <div>
        {props.sessionToken!==null ? <div className="welcome">{`Welcome, ${name}`}!</div> :
        <div>
        <form onSubmit={(e) => {
            e.preventDefault();
            if (!(username.current.value && password.current.value)) return;
            {log ? login() : register()}
        }}>
        <div className="title">{ log ? "Login" : "Register"}</div>
        <label>
          <span>Username:</span>
          <input className="input" ref={username}></input>
        </label>
        <br></br>
        <label>
          <span>Password: </span>
          <input className="input" type={"password"} ref={password}></input>
        </label>
        {log ? "" :  
        <><br></br><label>
          <span>Confirm Password:</span>
          <input className="input" type={"password"} ref={passwordConf}></input>
        </label></>
        }
        <br></br>
        <button type="submit">{log ? "Login" : "Register"}</button>
        </form>
        <div className="bottom-link">{log ? "Don't have an account? " : "Already have an account? "} 
            <button className="link" 
            onClick={() => {
                setLog(!log)
            }}>Click here</button>
        </div>
    </div>}
    </div>
    )
}