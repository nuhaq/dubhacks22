import "./Browse.css"
import * as React from "react"
import { useState, useEffect } from "react"
import axios from "axios"


export default function Browse({sessionToken}) {
    const [charities, setCharities] = useState([])
    const [isFetching, setIsFetching] = useState(false)
    console.log("CHARITIES" , charities)

    async function addLiked(cause, ein, name, causeID, mission, tagline, rating, websiteURL, accountabilityRating, financialRating) {
        const response = axios.post(`http://localhost:3001/charity/add/${ein}`, {
            "sessionToken": sessionToken,
            "name": name,
            "cause": cause,
            "causeID": causeID,
            "mission": mission,
            "tagline": tagline,
            "rating": rating,
            "websiteURL": websiteURL,
            "accountabilityRating": accountabilityRating,
            "financialRating": financialRating
        })
        //on like, add to charity list in backend
        //check whether to update ML 
        // const res2 = axios.get(`http://localhost:3001/cause/${causeID}/${sessionToken}`)
    }



    async function getCharities() {
        setIsFetching(true)
        const response = await axios.get(`http://localhost:3001/payment/charity/${sessionToken}`)
        let causeID = response.data.cause.causeID
        const response2 = await axios.get(`http://localhost:3001/cause/${causeID}/${sessionToken}`)
        setCharities(response2.data)
        setIsFetching(false)

    }
    useEffect(() => {
        getCharities()
      },[])

      return (
        <div>
        {isFetching ? <div>LOADING</div>: 
        <div className="grid">
            {charities?.map(c => {
                return (
                    <div className="charity">
                        <h2>{c?.charityName}</h2>
                        <div className="tag">{c.tagLine}</div>
                        <div className="mission">{c.mission}</div>
                    <button onClick={() => addLiked(c.cause.causeName, c.ein, c.charityName, c.cause.causeId, c.mission,
                        c.tagline, c.currentRating.score, c.websiteURL, c.currentRating.accountabilityRating, 
                        c.currentRating.financialRating)}> Like This Charity!
                    </button>
                    </div>
                )
            })}
            </div>}
        </div>
      )

}