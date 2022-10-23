const Parse = require('parse/node');
const express = require("express")
const router = express.Router()
var cors = require('cors');
 
router.use(cors())

router.get('/:sessionToken', async (req, res) => {
    let query = new Parse.Query("_Session")
    query.equalTo("sessionToken", req.params.sessionToken)
    let user = await query.first({useMasterKey : true})
    user = user.attributes.user.id

    const paidQuery = new Parse.Query("paidCharities").equalTo("userId", user)
    let paid = await paidQuery.find();
    let total = 0
    paid.forEach(e => {
        total += parseInt(e.attributes.amountPaid)
    })
    res.send({total})
})
 



module.exports = router
