const { MongoClient } = require('mongodb')
const uri = process.env.MONGODB_URI
const client = new MongoClient(uri)

const database = async (req, res) => {
  if(method === "GET") (
    res.status(200).json({method: "GET"})
  )
}

export default database
