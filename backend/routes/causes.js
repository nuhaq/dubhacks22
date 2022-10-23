const express = require('express')
const cors = require('cors')
const router = express.Router()
const Parse = require('parse/node');
const axios = require('axios')

require('@tensorflow/tfjs');
const use = require('@tensorflow-models/universal-sentence-encoder');

router.use(cors())

/**
 * 1. pick random charity from users liked charities
 * 2. call this to generate 2 similar causes
 * 3. create explore page with cause of (random charity) + 2 similar causes + shuffle 
 */
router.get('/:causeId/:sessionToken', async (req, res) => {
    //only update recs every 2 days
    const userQuery = new Parse.Query("_Session")
    userQuery.equalTo("sessionToken", req.params.sessionToken)
    let userID = await userQuery.first({useMasterKey : true})
    userID = userID.attributes.user.id

    const recQuery = new Parse.Query("recs").equalTo("userId", userID)
    let currRec = await recQuery.first()
    if (currRec) {
        let date = new Date(Date.parse(currRec.attributes.updatedAt)).getDate()
        if ((Math.abs(new Date().getDate() - date)) <= 2) {
            //updated within 2 days ago, just return that
            res.status(200).send(currRec.attributes.recommendations)
        }
    }
    
    const query = new Parse.Query("causes").notEqualTo("causeId", req.params.causeId)
    let list = await query.find()
    let list2 = list.map(e => {return e.attributes.causeName})
    let list3 = list.map(e => {return e.attributes.causeId})
    const query2 = new Parse.Query("causes").equalTo("causeId", req.params.causeId)
    let cause = await query2.first()
    cause = cause.attributes.causeName
    

        
    // Load the model.
    use.loadQnA().then(async model => {

        const input = {
        queries: [cause],
        responses: list2
        };
        
        var scores = [];
        const embeddings = model.embed(input);

        /*
        * The output of the embed method is an object with two keys:
        * {
        *   queryEmbedding: tf.Tensor;
        *   responseEmbedding: tf.Tensor;
        * }
        * queryEmbedding is a tensor containing embeddings for all queries.
        * responseEmbedding is a tensor containing embeddings for all answers.
        * You can call `arraySync()` to retrieve the values of the tensor.
        * In this example, embed_query[0] is the embedding for the query
        * 'How are you feeling today?'
        * And embed_responses[0] is the embedding for the answer
        * 'I\'m not feeling very well.'
        */
        const embed_query = embeddings['queryEmbedding'].arraySync();
        const embed_responses = embeddings['responseEmbedding'].arraySync();
        // compute the dotProduct of each query and response pair.
        for (let i = 0; i < input['queries'].length; i++) {
        for (let j = 0; j < input['responses'].length; j++) {
            scores.push(dotProduct(embed_query[i], embed_responses[j]));
        }
        }
        const zip = (a,b,c) => a.map((k,i) => [k, b[i], c[i]])
        let combined = zip(list2, scores, list3)
        combined.sort(function(a, b) {
            return b[1] - a[1];
        });
        let result = await explore(combined[0][2], combined[1][2], req.params.causeId)

        const rec = Parse.Object.extend("recs")
        let recOb = new rec()
        recOb.set("recommendations", result)
        recOb.set("userId", userID)
        recOb.save()

        res.send(result)
    });
    
    // Calculate the dot product of two vector arrays.
    const dotProduct = (xs, ys) => {
        const sum = xs => xs ? xs.reduce((a, b) => a + b, 0) : undefined;
    
        return xs.length === ys.length ?
        sum(zipWith((a, b) => a * b, xs, ys))
        : undefined;
    }
    
    // zipWith :: (a -> b -> c) -> [a] -> [b] -> [c]
    const zipWith =
        (f, xs, ys) => {
            const ny = ys.length;
            return (xs.length <= ny ? xs : xs.slice(0, ny))
                .map((x, i) => f(x, ys[i]));
        }

        
})


async function explore(cause1, cause2, randomCause) {
    console.log(cause1)
    const orgCall = `https://api.data.charitynavigator.org/v2/Organizations?app_key=9615959f668878693152d3105e078b35&app_id=4d609aa2&noGovSupport=false&sort=RATING%3ADESC&pageSize=5&causeID=`
    const response = await axios.get(orgCall+cause1)
    const response2 = await axios.get(orgCall+cause2)
    const response3 = await axios.get(orgCall+randomCause)
    // let results = await Promise.all([response.data, response2.data, response3.data])
    let result = response.data.concat(response2.data.concat(response3.data))
    let shuffled = result.map(value => ({value, sort: Math.random()})).sort((a,b) => a.sort - b.sort).map(({ value }) => value)
    return shuffled
}

module.exports = router






