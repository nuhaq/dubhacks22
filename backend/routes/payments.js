const Parse = require('parse/node');
const express = require("express")
const router = express.Router()
var cors = require('cors');
 
router.use(cors())
 
//send payment
router.post('/send/:paid/:sessionToken', async (req, res) => {
    let query = new Parse.Query("_Session")
    query.equalTo("sessionToken", req.params.sessionToken)
    let user = await query.first({useMasterKey : true})
    user = user.attributes.user.id
    const Payment = Parse.Object.extend("paidCharities")
    let payment = new Payment
    payment.set({
        charityId: req.body.ein,
        userId: user,
        amountPaid: req.params.paid
    })
})
 
 
router.get('/charity/:sessionToken', async (req, res) => {
    let query = new Parse.Query("_Session")
    query.equalTo("sessionToken", req.params.sessionToken)
    let user = await query.first({useMasterKey : true})
    user = user.attributes.user.id
    console.log(user)
    let query2 = new Parse.Query("recs")
    query2.equalTo("userId", user)
    let recommendations = await query2.first()
    // res.send(recommendations.attributes.recommendations)
    let list2 = recommendations.attributes.recommendations.map(e => {return e.charityName})
    res.send(list2[Math.floor(Math.random() * list2.length)])
 
})
 
 
router.get('/:sessionToken', async (req, res) => {
    console.log("Im HERE")
    let query = new Parse.Query("_Session")
    query.equalTo("sessionToken", req.params.sessionToken)
    let user = await query.first({useMasterKey : true})
    let userId = user.attributes.user.id
    const query2 = new Parse.Query("userProfile").equalTo("userID", userId)
    const userProfile = await query2.first({useMasterKey : true})
    console.log("IM HERE", userProfile)
    res.status(200).send(userProfile)
})
 
//router.get('./userProfile/:sessionToken')
 
//get total payments for a user
// router.get('/total/:userId', async (req, res) => {
//     const query = new Parse.query("paidCharities").equalTo("userId", req.params.userId)
//     const payments = await query.find()
//     let total = 0;
//     payments.forEach(p => {
//         total += p.amountPaid
//     })
//     res.status(200).send({"total": total})
// })
 
module.exports = router
