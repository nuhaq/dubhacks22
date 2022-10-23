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
 * get user's liked charities to display on profile
 */
router.get('/liked/:userId', async (req, res) => {
    try {
        let query = new Parse.Query("_Session")
        query.equalTo("sessionToken", req.params.sessionToken)
        let user = await query.first({useMasterKey : true})
        user = user.attributes.user.id
        let bookQuery = new Parse.Query("Books")
        bookQuery.equalTo("userId", user)
        bookQuery.descending("createdAt")
        let books = await bookQuery.find()
        res.status(200).send(books.slice(0, 5))
    } catch (err) {
        res.status(400).send({"error" : "couldn't get recent" + err })
    }
})

/**
 * add liked charity to list
 */
router.post('/like/:ein', async (req, res) => {
    const Charity = Parse.Object.extend("Charities")
    let charity = new Charity
    charity.set({
      "ein" : req.params.ein,
      "userId": req.body.userId,
      "name": req.body.name,
      "cause": req.body.cause,
      "causeId": req.body.causeId,
      "mission": req.body.mission,
      "tagline": req.body.tagline,
      "rating": req.body.rating,
      "websiteURL": req.body.URL,
      "accountabilityRating": req.body.accRating,
      "financialRating": req.body.finRating
    })
  })
  
/**
 * remove liked charity
 */
router.post('/remove/:ein', async (req, res) => {
    //if they paid the charity, they cant remove it from liked 
    try {
        let charity = new Parse.Query("Charities")
        charity.equalTo("bookId", req.params.ein)
        charity.equalTo("userId", req.body.userId)
        let response = await charity.first()
        if (response) {
            //if charity exists:
            await response.destroy()
        }
        res.status(200).send("removed")
    } catch (err) {
        res.status(400).send({"error" : "remove failed. " + err })
    }
})

module.exports = router