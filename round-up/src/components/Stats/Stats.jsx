import * as React from "react"
import { useState, useEffect } from "react"
import axios from "axios"
 
export default function Stats({sessionToken}) {
    const [total, setTotal] = useState(0)
    const [charities, setCharities] = useState([])
    console.log(total)

    async function getStats() {
        const response = await axios.get(`http://localhost:3001/stats/${sessionToken}`)
        console.log(response)
        setTotal(parseInt(response.data.total))

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
        <div>
            You have donated ${total} to charity!
            <h1>Liked charities:</h1>
            {charities?.map(c => {
                return (<div>
                    {c.name}
                </div>)
            })}
            
        </div>
    )

}