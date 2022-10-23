
const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const Parse = require('parse/node');
const charRoute = require('./routes/charity')
const causeRoute = require('./routes/causes')
// const recRoute = require('./routes/recommendations')

const app = express()

app.use(cors())
app.use(morgan('tiny'))
app.use(express.json())
app.use('/charity', charRoute)
// app.use('rec', recRoute)
app.use('/cause', causeRoute)

app.get('/', async (req, res) => {
  res.send({"ping": "pong"})
})


const MASTERKEY = "qkJhcun01wceaFOdmN21s5LFoHUlKegBLC2qpD1D"
const APPKEY = "E26bmvoZWQbNaY6kVan2HcX73kcLTOgh1PmC5cst"
const JSKEY = "yv12nPoW7Q3IHH95cF3ExZ1kT1BrMJrWw1FTEN4c"
Parse.initialize(APPKEY, JSKEY, MASTERKEY);
Parse.serverURL = 'https://parseapi.back4app.com/'


app.post('/logout', async (req, res) => {
  try {
  let query = new Parse.Query("_Session")
  query.equalTo("sessionToken", req.body.sessionToken)
  query.first( { useMasterKey : true}).then(function (user) {
    if (user) {
      user
      .destroy({useMasterKey: true})
      .then (res.status(200).send("logged out"))
      .catch(function (err) {
        res.status(400).send({ Message: err.message, typeStatus: "danger"});
      })
    } else {
      res.send();
    }
  })
} catch (err) {

}
})


app.post('/login', async (req, res) => {
  try {
    const user = await Parse.User.logIn(req.body.username, req.body.password)
    res.send({"user": user, "sessionToken": await user.getSessionToken()})
  } catch (error) {
    res.status(400)
    res.send({"error" : "Login failed. " + error })
  }
})

app.post('/register', async(req, res) => {
    let user = new Parse.User(req.body);
      user.signUp().catch((e) => {res.status(400).send(e.message)})
      user.set("lists", ["Read", "Reading", "Want to Read"])
      await user.save(null, { useMasterKey: true })
      res.status(201).send({"user": user, "sessionToken": await user.getSessionToken()})
})




module.exports = app