import * as React from "react"
import { useState, useEffect } from "react"
import axios from "axios"
import "./Stats.css"
 
export default function Stats({sessionToken}) {
    const [total, setTotal] = useState(0)
    const [charities, setCharities] = useState([])

    async function getStats() {
        const response = await axios.get(`http://localhost:3001/stats/${sessionToken}`)
        console.log(response)
        setTotal(parseFloat(response.data.total))

    }
    async function getCharities() {
        const response = await axios.get(`http://localhost:3001/charity/liked/${sessionToken}`)
        console.log("RESPONSE" , response.data)
        setCharities(response.data)
    }
    useEffect(() => {
        getStats();
        getCharities();
    }, [])
    return (
        <div className="stat-page">
            You have donated ${total.toFixed(2)} to charity!
            <h2>Liked charities:</h2>
            {charities?.map(c => {
                return (<div>
                    {c.name}
                </div>)
            })}
            
        </div>
    )

}