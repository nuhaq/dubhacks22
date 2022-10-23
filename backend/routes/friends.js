const Parse = require('parse/node');
const express = require("express")
const router = express.Router()
var cors = require('cors');

router.use(cors())

/**
 * find user based on username search and filter out people you're already friends with
 */
router.get('/users', async (req, res) => {
    //send notification option if friend is not there
    try {
        let userExistsCheck = await new Parse.Query(Parse.User).equalTo("username", req.query.name).first()
        if (!userExistsCheck) {
            res.status(200).send({})
        }
    } catch {
        res.status(400).send({"message": "Parse Query failed"})
    }
    let userId = ""
    let query = ""
    try {
        let sessionQuery = new Parse.Query("_Session").equalTo("sessionToken", req.query.sessionToken)
        userId = await sessionQuery.first({useMasterKey : true})
        userId = userId.attributes.user.id
        query = new Parse.Query("_User")
        query.equalTo("username", req.query.name)
        query.notEqualTo("objectId", userId)
    }
    catch {
        res.status(400).send({"message": "Session token query failed"})
    }
    try {
        //to exclude existing friends or already sent friend requests
        let query1 = new Parse.Query("Friends").equalTo("fromName", req.query.name).equalTo("toUser", userId)
        let query2 = new Parse.Query("Friends").equalTo("toName", req.query.name).equalTo("fromUser", userId)
        const existingFriendsQuery = Parse.Query.or(query1, query2)
        let existingFriends = await existingFriendsQuery.first()
        if (existingFriends) {
            //if there already is a friendship:
            query.notContainedIn("objectId", [existingFriends.get("fromUser"), existingFriends.get("toUser")])
        }
        const user = await query.first({useMasterKey : true})
        res.status(200).send(user)
    } catch {
        res.status(400).send({"message": "Couldn't query for existing friends."})
    }
    
})

/**
 * get list of all pending friend requests that have been sent to a user
 */
router.get('/seeReqs/:sessionToken', async(req, res) => {
    try {
        let query = new Parse.Query("_Session")
        query.equalTo("sessionToken", req.params.sessionToken)
        let user = await query.first({useMasterKey : true})
        user = user.attributes.user.id
        let friendQuery = new Parse.Query("Friends")
        friendQuery.equalTo("status", "pending")
        friendQuery.equalTo("toUser", user)
        let requests = await friendQuery.find()
        res.status(200).send(requests)
    } catch (err) {
        res.status(400).send({"message" : err })
    }
})

/**
 * creates a new friend request
 */
router.post('/send/:sessionToken', async (req, res) => {
    let user = ""
    let session = ""
    try {
        let query = new Parse.Query("_Session")
        query.equalTo("sessionToken", req.params.sessionToken)
        session = await query.first({useMasterKey : true})
        let userQuery = new Parse.Query("_User").equalTo("objectId", session.attributes.user.id)
        user = await userQuery.first({useMasterKey : true})
    } catch {
        res.status(400).send({"message" : "Parse Query failed" })
    }
    try {   
        const Friend = Parse.Object.extend("Friends")
        let friend = new Friend()
        friend.set("fromUser", session.attributes.user.id)
        friend.set("toUser", req.body.friend.objectId)
        friend.set("fromName", user.attributes.username)
        friend.set("toName", req.body.friend.username)
        friend.set("status", "pending")
        await friend.save()
        res.status(200).send(friend)
    } catch {
        res.status(400).send({"message" : "Couldn't create new friend object" })
    }

})

/**
 * accepts a friend request 
 */
router.post('/accept/:name', async(req, res) => {
    try {
        let query = new Parse.Query("_Session")
        query.equalTo("sessionToken", req.body.sessionToken)
        let user = await query.first({useMasterKey : true})
        user = user.attributes.user.id
        let friendQuery = new Parse.Query("Friends")
        friendQuery.equalTo("fromName", req.params.name)
        friendQuery.equalTo("toUser", user) 
        friendQuery.equalTo("status", "pending")
        let request = await friendQuery.first()
        request.set("status", "current")
        await request.save()
        res.status(200).send(request)
    } catch (err) {
        res.status(400).send({"error" : err })
    }
})

/**
 * denies a friend request
 */
router.post('/deny/:name', async(req, res) => {
    try {
        let query = new Parse.Query("_Session")
        query.equalTo("sessionToken", req.body.sessionToken)
        let user = await query.first({useMasterKey : true})
        user = user.attributes.user.id
        let friendQuery = new Parse.Query("Friends")
        friendQuery.equalTo("fromName", req.params.name)
        friendQuery.equalTo("toUser", user)
        friendQuery.equalTo("status", "pending")
        let friend = await friendQuery.first()
        await friend.destroy()
        res.status(200).send("request denied")
    } catch (err) {
        res.status(400).send({"error" : err })
    }
})
/**
 * get list of user's current friends
 */
router.get('/list/:sessionToken', async (req, res) => {
    let user = {}
    try {
        let query = new Parse.Query("_Session")
        query.equalTo("sessionToken", req.params.sessionToken)
        user = await query.first({useMasterKey : true})
        user = user.attributes.user.id
    } catch {
        res.status(400).send({"message" : "Session token query failed" })
    }
    try {
        console.log(user)
        let fromQuery = new Parse.Query("Friends")
        let toQuery = new Parse.Query("Friends")
        fromQuery.equalTo("fromUser", user)
        toQuery.equalTo("toUser", user)
        fromQuery.equalTo("status", "current")
        toQuery.equalTo("status", "current")
        let fromFriends = await fromQuery.find()
        let toFriends = await toQuery.find()
        res.status(200).send({"from": fromFriends, "to": toFriends})
    } catch {
        res.status(400).send({"message" : "Friends query failed" })
    }
})
/**
 * get friend's books
 */
router.get('/books/:name', async (req, res) => {
    try {
        const query = new Parse.Query("_User").equalTo("username", req.params.name)
        const user = await query.first({useMasterKey : true})
        const userId = user.id
        let bookQuery = new Parse.Query("Books")
        bookQuery.equalTo("userId", userId)
        bookQuery.equalTo("list", "Reading")        
        const books = await bookQuery.find()
        res.send(books)
    } catch (err) {
        res.status(400).send({"error" : err })
    }
})


module.exports = router