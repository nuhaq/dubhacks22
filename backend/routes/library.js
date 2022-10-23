const Parse = require('parse/node');
const express = require("express")
const router = express.Router()
var cors = require('cors');

router.use(cors())

async function getUserHelper(sessionToken) {
    // return user from session token
    let query = new Parse.Query("_Session")
    query.equalTo("sessionToken", sessionToken)
    const session = await query.first({useMasterKey : true})
    let userQuery = new Parse.Query("_User")
    userQuery.equalTo("objectId", session.attributes.user.id)
    return await userQuery.first({useMasterKey : true})
}

/**
 * add list to user's library
 */
router.post('/add/:list', async (req, res) => {
    try {
        let user = await getUserHelper(req.body.sessionToken)
        user.add("lists", req.params.list)
        await user.save(null, { useMasterKey: true });
        res.send(user)
    } catch (err) {
        res.status(400).send({"error" : "list creation failed. " + err })
    }
})

/**
 * delete list from user's library
 */
router.post('/delete/:list', async (req, res) => {
    try {
        let user = await getUserHelper(req.body.sessionToken)
        user.remove("lists", req.params.list)
        await user.save(null, { useMasterKey: true });
        res.send(user)
    } catch (err) {
        res.status(400).send({"error" : "list deletion failed. " + err })
    }
})


/**
 * get all of user's lists and saved books
 */
router.get('/:sessionToken', async (req, res) => {
    try {
        let user = await getUserHelper(req.params.sessionToken)
        let temp = {}
        for (let i=0; i<user.attributes.lists.length; i++) {
            let l = user.attributes.lists[i]
            let bookQuery = new Parse.Query("Books")
            bookQuery.equalTo("userId", user.id)
            bookQuery.equalTo("list", l)
            const books = await bookQuery.find()
            temp[l] = books
        }
        res.send(temp)
    } catch (err) {
        res.status(400).send({"error": `lists could not be retrieved. ${err}`})
    }
})

module.exports = router