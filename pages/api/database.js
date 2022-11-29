export default function handler(req, res) {
  res.status(200).json({ 
    username: process.env.DBUSERNAME, 
    password: process.env.DBPASSWORD
   })
}
