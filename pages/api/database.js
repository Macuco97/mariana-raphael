import { RESPONSE_LIMIT_DEFAULT } from 'next/dist/server/api-utils'

const { MongoClient } = require('mongodb')
const uri = process.env.MONGODB_URI
const client = new MongoClient(uri)

const database = async (req, res) => {
  const { method } = req

  switch(method) {
    case "GET":
      res.status(200).json({method: "GET"})
      break;
    case "POST": 
      res.status(200).json({method: "POST"})
      break;
    case "PUT":
      res.status(200).json({method: "PUT"})
      break;
    case "DELETE":
      res.status(200).json({method: "DELETE"})
  }
}

export default database
