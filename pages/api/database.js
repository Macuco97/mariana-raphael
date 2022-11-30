import nc from "next-connect"
import multer from 'multer'

const uploadPath = __dirname
console.log(uploadPath)
const upload = multer({
  storage: multer.diskStorage({
    destination: './public/uploads',
    filename: (req, file, cb) => cb(null, file.originalname),
  }),
});


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
    const file  = req.file
    res.send('Upload sucess');
  })
  .post((req, res) => {
    res.json({ hello: "world" });
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