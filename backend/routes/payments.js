const Parse = require('parse/node');
const express = require("express")
const router = express.Router()
var cors = require('cors');
 
router.use(cors())
 
//send payment to backend
router.post('/send/:paid/:sessionToken', async (req, res) => {
    let query = new Parse.Query("_Session")
    query.equalTo("sessionToken", req.params.sessionToken)
    let user = await query.first({useMasterKey : true})
    user = user.attributes.user.id
    const Payment = Parse.Object.extend("paidCharities")
    let payment = new Payment()
    payment.set({
        "charityId": req.body.ein,
        "charityName": req.body.name,
        "userId": user,
        "amountPaid": req.params.paid
    })
    payment.save()
})
 
 //get charity to donate to
router.get('/charity/:sessionToken', async (req, res) => {
    let query = new Parse.Query("_Session")
    query.equalTo("sessionToken", req.params.sessionToken)
    let user = await query.first({useMasterKey : true})
    user = user.attributes.user.id
    let query2 = new Parse.Query("recs")
    query2.equalTo("userId", user)
    let recommendations = await query2.first()
    // res.send(recommendations.attributes.recommendations)
     let list2 = recommendations.attributes.recommendations
    res.send(list2[Math.floor(Math.random() * list2.length)])
 
})
 
//gets user profile
router.get('/:sessionToken', async (req, res) => {
    let query = new Parse.Query("_Session")
    query.equalTo("sessionToken", req.params.sessionToken)
    let user = await query.first({useMasterKey : true})
    let userId = user.attributes.user.id
    const query2 = new Parse.Query("userProfile").equalTo("userID", userId)
    const userProfile = await query2.first({useMasterKey : true})
    res.status(200).send(userProfile)
})


 
module.exports = router
