import "./Payment.css"
import * as React from "react"
import { useState, useEffect } from "react"
import axios from "axios"
 
 
export default function Payment({sessionToken}) {
 
    const [userData, setUserData] = useState({})
    const [payment, setPayment] = useState("")
    const [rounded, setRounded] = useState(0)
    const [charity, setCharity] = useState("")
 

    async function getUserData() {
        const response = await axios.get(`http://localhost:3001/payment/${sessionToken}`)
        setUserData(response.data)
    }
   
    async function calculatePayment() {
        let totalRounded = Math.ceil (parseInt(payment) + (userData.monthlyGoal / userData.paymentsPerPeriod)) - payment
        setRounded(totalRounded)
        await axios.post(`http://localhost:3001/payment/send/${totalRounded}/${sessionToken}`)
    }
 
    async function getCharity() {
        let response = await axios.get(`http://localhost:3001/payment/charity/${sessionToken}`)
        setCharity(response.data)
       
    }
 
    useEffect(() => {
        getUserData();
        getCharity();
    }, [])
 
      return (
       <><input type="text" onChange={(e) => {setPayment(e.target.value)}}></input>
       <button onClick={calculatePayment}>Submit!</button>
       <h1>{rounded === 0 ? "" : `You donated $${rounded} to  ${charity}`}</h1></>
      )
 
}







