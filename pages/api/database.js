import nc from "next-connect"
const {MongoClient, ObjectId} = require('mongodb')
const mongodbURI = process.env.MONGODB_URI
const client = new MongoClient(mongodbURI)
const databaseName = 'places'
const collectionName = 'places'

const createItem = async (req, res) => {
  await client.connect()
  const database = await client.db(databaseName)
  const collection = await database.collection(collectionName)
  const insertResponse = await collection.insertOne(req.body)
  let findResponse = await collection.find({}).toArray()
  res.json({
            insert: insertResponse,
            find: findResponse
          })
  client.close
}

const readItem = async (req, res) => {
  await client.connect()
  const database = await client.db(databaseName)
  const collection = await database.collection(collectionName)
  const findResponse = await collection.find({}).toArray()
  res.json({
    find: findResponse
  })
  client.close
}

const updateItem = async (req, res) => {
  await client.connect()
  const { id, collaboration, bought } = req.body
  const database = await client.db(databaseName)
  const collection = await database.collection(collectionName)
  const updateResponse = await collection.updateOne({_id: ObjectId(id)}, {$inc: {bought: bought}, $push: {collaboration: collaboration}})
  const findResponse = await collection.find({}).toArray()
  res.json({
    update: updateResponse, 
    find: findResponse
  })
  client.close()
}

const deleteItem = async (req, res) => {
  await client.connect()
  const { id } = req.body
  const database = await client.db(databaseName)
  const collection = await database.collection(collectionName)
  const deleteResponse = await collection.deleteOne({_id: ObjectId(id)})
  const findResponse = await collection.find({}).toArray()
  res.json({
    delete: deleteResponse, 
    find: findResponse
  })
  client.close()
}

const database = nc({
  onError: (err, req, res, next) => {
    console.error(err.stack);
    res.status(500).end(err.stack);
  },
  onNoMatch: (req, res) => {
    res.status(404).end("Page is not found");
  },
})
  .get((req, res) => {
    readItem(req, res)
  })
  .post((req, res) => { 
    createItem(req, res)
  })
  .put(async (req, res) => {
    updateItem(req, res)
  })
  .delete(async (req, res) => {
    deleteItem(req, res)
  });

export default database

