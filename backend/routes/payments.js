const Parse = require('parse/node');
const express = require("express")
const router = express.Router()
var cors = require('cors');

router.use(cors())

//send payment
router.post('/send/:paid', async (req, res) => {
    const Payment = Parse.Object.extend("paidCharities")
    let payment = new Payment
    payment.set({
        charityId: req.body.ein,
        userId: req.body.userId,
        amountPaid: req.params.paid
    })
})

//in profile page, see list of payments in date order
router.get('/:userId', async (req, res) => {
    const query = new Parse.Query("paidCharities").equalTo("userId", req.params.userId)
    query.descending('createdAt')
    const payments = await query.find()
    res.status(200).send(payments)
})

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

