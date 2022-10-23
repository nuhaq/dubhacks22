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
        console.log(response.data)
        //on like, add to charity list in backend
        //check whether to update ML 
        // const res2 = axios.get(`http://localhost:3001/cause/${causeID}/${sessionToken}`)
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
                    <div>{c?.charityName} <button onClick={() => addLiked(c.cause.causeName, c.ein, c.charityName, c.cause.causeId, c.mission,
                        c.tagline, c.currentRating.score, c.websiteURL, c.currentRating.accountabilityRating, 
                        c.currentRating.financialRating)}> like</button></div>
                )
            })}
            </div>}
        </div>
      )

}