const Parse = require('parse/node');
const express = require("express")
const router = express.Router()
var cors = require('cors');

router.use(cors())

/**
 * create review and rating
 */
router.post('/add/:id', async (req, res) => {
    let userId = ""
    let username = ""
    try {
        let query = new Parse.Query("_Session")
        query.equalTo("sessionToken", req.body.sessionToken)
        let session = await query.first({useMasterKey : true})
        //get user id using session
        userId = session.attributes.user.id
        //get username from user query
        let userQuery = new Parse.Query("_User")
        userQuery.equalTo("objectId", session.attributes.user.id)
        let user = await userQuery.first({useMasterKey : true})
        username = user.attributes.username
    } catch {
        res.status(400).send({"message" : "Session token query failed" })
    }
    try {
        //create Review
        const Review = Parse.Object.extend("Reviews")
        let review = new Review()
        review.set("bookId", req.params.id)
        review.set("userId", userId)
        review.set("rating", req.body.rating)
        review.set("review", req.body.review)
        review.set("username", username)
        await review.save()
        if (req.body.rating!==0) updateAvgRating(req.params.id, req.body.rating)
        res.status(200).send(review)
    } catch (err) {
        res.status(400).send({"message" : "Couldn't create Review Object" })
    }
})

async function updateAvgRating(bookId, rating) {
    const reviewQuery = new Parse.Query("Books").equalTo("bookId", bookId)
    let reviews = await reviewQuery.find()
    if (reviews[0].attributes.avgRating===undefined || reviews[0].attributes.ratingsCount===undefined) {
        await Promise.all(reviews.map(async (r) => {
            r.set("avgRating", rating)
            r.set("ratingsCount", 1)
            r.save()
        }))
    }
    await Promise.all(reviews.map(async (r) => {
        let avg = (r.attributes.avgRating * r.attributes.ratingsCount + rating)/(r.attributes.ratingsCount+1)
        console.log(avg)
        r.set("avgRating", parseFloat(avg.toFixed(2)))
        r.increment("ratingsCount")
        r.save()
    }))
}

router.get('/:id', async (req, res) => {
    try {
        let reviewQuery = new Parse.Query("Reviews")
        reviewQuery.equalTo("bookId", req.params.id)
        const review = await reviewQuery.find()
        res.status(200).send(review)
    } catch (err) {
        res.status(400).send({"error": err })
    }
})

module.exports = router 