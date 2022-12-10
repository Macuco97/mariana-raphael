import nc from "next-connect"
import multer from 'multer'
import fs from 'fs'
const {MongoClient} = require('mongodb')
const mongodbURI = process.env.MONGODB_URI
const client = new MongoClient(mongodbURI)
const databaseName = 'product-list'
const collectionName = 'products'


const uploadPath = __dirname
console.log(uploadPath)
const upload = multer({
  storage: multer.diskStorage({
    destination: './public/uploads',
    filename: (req, file, cb) => cb(null, file.originalname),
  }),
});

const createItem = async (req, res) => {
  let { body, method, file } = req
  const image = fs.readFileSync(file.path)
  await client.connect()
  const database = await client.db(databaseName)
  const collection = await database.collection(collectionName)
  const { place, price } = body
  const insertedObject = {
    place: place, 
    price: price, 
    image: image
  }
  const insertResponse = await collection.insertOne(insertedObject)
  let findResponse = await collection.find({}).toArray()
  res.json({
            insert: insertResponse,
            find: findResponse
          })
  fs.unlinkSync(file.path)
}

const readItem = async (req, res) => {
  await client.connect()
  const database = await client.db(databaseName)
  const collection = await database.collection(collectionName)
  const findResponse = await collection.find({}).toArray()
  res.json({
    find: findResponse
  })
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
  .use(upload.single('image'))
  .get((req, res) => {
    readItem(req, res)
  })
  .post((req, res) => { 
    createItem(req, res)
  })
  .put(async (req, res) => {
    res.end("async/await is also supported!");
  })
  .patch(async (req, res) => {
    throw new Error("Throws me around! Error can be caught and handled.");
  });

export default database

export const config = {
  api: {
    bodyParser: false, // Disallow body parsing, consume as stream
  },
}