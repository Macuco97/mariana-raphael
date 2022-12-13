import nc from "next-connect"
import createServer from "next/dist/server/next"
const {MongoClient, ObjectId} = require('mongodb')
const mongodbURI = process.env.MONGODB_URI
const client = new MongoClient(mongodbURI)
const databaseName = 'places'
const collectionName = 'auth'

const readAuth = async (req, res) => {
    await client.connect()
    const database = await client.db(databaseName)
    const collection = await database.collection(collectionName)
    const findResponse = await collection.find({}).toArray()
    const { login, password } = findResponse[0]
    client.close()
    console.log(req.body)
    console.log(login)
    console.log(password)
    if(req.body.login === login && req.body.password === password) {
        res.json({permission: true})
    }
    else {
        res.json({permission: false})
    }

}

const auth = nc({
    onError: (err, req, res, next) => {
      console.error(err.stack);
      res.status(500).end(err.stack);
    },
    onNoMatch: (req, res) => {
      res.status(404).end("Page is not found");
    },
  })
  .get((req, res)  => {
    readAuth(req, res)
  })
export default auth