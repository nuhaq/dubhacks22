import "./Payment.css"
import * as React from "react"
import { useState, useEffect } from "react"
import axios from "axios"
 
 
export default function Payment({sessionToken}) {
 
    const [userData, setUserData] = useState({})
    const [payment, setPayment] = useState("")
    const [rounded, setRounded] = useState(0)
    const [charity, setCharity] = useState({})
 
    console.log(charity)

    async function getUserData() {
        const response = await axios.get(`http://localhost:3001/payment/${sessionToken}`)
        setUserData(response.data)
    }
   
    async function calculatePayment() {
        let totalRounded = (userData.monthlyGoal / userData.paymentsPerPeriod)
        setRounded(totalRounded)
        await axios.post(`http://localhost:3001/payment/send/${totalRounded}/${sessionToken}`,{
            "ein": charity.ein,
            "name": charity.charityName

        })
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
       <div className="payments"><input type="text" onChange={(e) => {setPayment(e.target.value)}}></input>
       <button onClick={calculatePayment}>Submit!</button>
       <h4>{rounded === 0 ? "" : `Rounded up to $${(parseFloat(rounded)+parseFloat(payment)).toFixed(2)}`}</h4>
       <h1>{rounded === 0 ? "" : `You donated $${rounded.toFixed(2)} to  ${charity.charityName}`}</h1></div>
      )
 
}







