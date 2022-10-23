const Parse = require('parse/node');
const express = require("express")
const router = express.Router()
var cors = require('cors');
const axios = require('axios');

router.use(cors())

const orgCall = "https://api.data.charitynavigator.org/v2/Organizations?app_key=9615959f668878693152d3105e078b35&app_id=4d609aa2&noGovSupport=false&sort=RATING%3ADESC"

//app.get(orgs) for scrolling home page
router.get('/orgs', async (req, res) => {
    //if they have liked charities, put similar charities at the top
    const response = await axios.get(orgCall)
    res.status(200).send(response.data)
  })


/**
 * get user's liked charities to display on stat page
 */
router.get('/liked/:sessionToken', async (req, res) => {
    try {
        let query = new Parse.Query("_Session")
        query.equalTo("sessionToken", req.params.sessionToken)
        let user = await query.first({useMasterKey : true})
        user = user.attributes.user.id
        let charQuery = new Parse.Query("charities")
        charQuery.equalTo("userID", user)
        charQuery.descending("createdAt")
        let char = await charQuery.find()
        res.status(200).send(char)
    } catch (err) {
        res.status(400).send({"error" : "couldn't get recent" + err })
    }
})

/**
 * add liked charity to list
 */
router.post('/add/:ein', async (req, res) => {
    //check to see if charity is there
    const Charity = Parse.Object.extend("charities")

    let query = new Parse.Query("_Session")
    query.equalTo("sessionToken", req.body.sessionToken)
    let user = await query.first({useMasterKey : true})
    user = user.attributes.user.id

    let charity = new Charity()
    charity.set({
      "ein" : req.params.ein,
      "userID": user,
      "name": req.body.name,
      "cause": req.body.cause,
      "causeID": req.body.causeID,
      "mission": req.body.mission,
      "tagline": req.body.tagline,
      "rating": req.body.rating,
      "websiteURL": req.body.URL,
      "accountabilityRating": req.body.accRating,
      "financialRating": req.body.finRating
    })
    charity.save()
    res.send(charity)
  })
  


module.exports = router