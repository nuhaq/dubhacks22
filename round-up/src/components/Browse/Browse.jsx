import "./Browse.css"
import * as React from "react"
import { useState, useEffect } from "react"
import axios from "axios"


export default function Browse() {
    const [charities, setCharities] = useState([])
    const [isFetching, setIsFetching] = useState(false)
    console.log("CHARITIES" , charities)

    async function rec(cause, ein, name, causeId, mission, tagline, rating, websiteURL, accountabilityRating, financialRating) {
        // const response = await axios.get('http://localhost:3001/rec')
        //on like, remove from 
    }



    async function getCharities() {
        setIsFetching(true)
        const response = await axios.get('http://localhost:3001/charity/orgs')
        setCharities(response.data)
        setIsFetching(false)

    }
    useEffect(() => {
        getCharities()
      },[])

      return (
        <div>
        {isFetching ? <div>LOADING</div>: 
        <div>
            {charities?.map(c => {
                return (
                    <div>{c?.charityName} <button onClick={() => rec(c.cause, c.ein, c.charityName, c.causeId, c.mission,
                        c.tagline, c.currentRating.score, c.websiteURL, c.currentRating.accountabilityRating, 
                        c.currentRating.financialRating)}> like</button></div>
                )
            })}
            </div>}
        </div>
      )

}