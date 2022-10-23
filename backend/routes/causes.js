const express = require('express')
const cors = require('cors')
const router = express.Router()
const Parse = require('parse/node');
const { liveQueryServerURL } = require('parse/node');

// require('@tensorflow/tfjs');
// const use = require('@tensorflow-models/universal-sentence-encoder');

router.use(cors())


router.get('/:causeId', async (req, res) => {
    const query = new Parse.Query("causes").notEqualTo("causeId", req.params.causeId)
    let list = await query.find()
    let list2 = list.map(e => {return e.attributes.causeName})
    const query2 = new Parse.Query("causes").equalTo("causeId", req.params.causeId)
    let cause = await query2.first()
    cause = cause.attributes.causeName
    res.send(cause)
    

        
    // Load the model.
    use.loadQnA().then(model => {

        const input = {
        queries: [cause],
        responses: list
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


    res.send({zipWith})
        
})





module.exports = router






