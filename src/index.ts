import express, { Request, Response } from 'express';
import { studentDataArray } from './utils/constant';
import connectMongoDB from './connectDB';
import Student from './model/Students';
import dotenv from "dotenv"
import cors from 'cors'
import multer from 'multer'
import fs from 'fs/promises';
import path from 'path';
import pdf from 'pdf-parse'
import { createReadStream } from 'fs';


dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
const port = 5000;
const storage = multer.diskStorage({
  destination: 'uploads/', // Change this to your desired directory
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});

app.get('/', (req: Request, res: Response) => {
  res.send('Hello, Node.js server!');
});
app.post('/api/addStudent', async(req: Request, res: Response) => {
  try {
   const data= await Student.insertMany(studentDataArray);
    res.status(200).json({
      success: true,
      data
    }); 
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message:"adding student failed"
    });
  }
});
app.get('/api/getStudent/:id', async(req: Request, res: Response) => {
  try {
  const {id}=req.params;
  console.log(id)

   const data= await Student.findOne({studentID:id});
    res.status(200).json({
      success: true,
      data
    }); 
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message:"adding student failed"
    });
  }
});
app.get('/api/getStudents', async(req: Request, res: Response) => {
  try {
  

   const data= await Student.find();
    res.status(200).json({
      success: true,
      data
    }); 
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message:"adding student failed"
    });
  }
});

app.patch('/api/adduuid/:id', async(req: Request, res: Response) => {
  try {
    
    const {id}=req.params;
    console.log(req.body,req.params)

   const data= await Student.findOneAndUpdate({studentID:id},req.body);
    res.status(200).json({
      success: true,
      data
    }); 
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message:"adding student failed"
    });
  }
});

const upload = multer({ storage });

app.post('/api/upload', upload.single('pdf'), (req, res) => {
  console.log('PDF saved:', req?.file?.originalname);
  res.json({ message: 'PDF saved successfully' });
});

const pdfDirectory = path.join(__dirname, '../uploads');

app.get('/api/downloadPdf/:uuid', async (req, res) => {
  const requestedUUID = req.params.uuid;

  console.log(requestedUUID,pdfDirectory);

  try {
    // Read the directory to get a list of files
    const files = await fs.readdir(pdfDirectory);
    // console.log(files);

    // Find the file with the matching UUID in the metadata
    // const matchingFile = files.find(async (file) => {

    //   const filePath = path.join(pdfDirectory, file);
    //   const pdfBuffer = await fs.readFile(filePath);
    //   const data = await pdf(pdfBuffer);
    //   const metadata = data.info;
    //   console.log('Title:', metadata.Title);
    //   console.log('Subject:', metadata.Subject);
    //   console.log( metadata.Subject===requestedUUID);
      
    //   return metadata.Subject===requestedUUID
    //   // try {
    //   //   console.log("->2")
    //   //   const metadata = JSON.parse(fileData);
    //   //   console.log(metadata.subject)
    //   //   return metadata.uuid === requestedUUID;
    //   // } catch (error) {
    //   //   return false; // Invalid metadata or file format
    //   // }
    // });
    const readFile = async () => {
      for (const file of files) {
        const filePath = path.join(pdfDirectory, file);
        const pdfBuffer = await fs.readFile(filePath);
        const data = await pdf(pdfBuffer);
        const metadata = data.info;
    
        console.log('Title:', metadata.Title);
        console.log('Subject:', metadata.Subject);
    
        if (metadata.Subject === requestedUUID) {
          return file; // Return the file if it matches
        }
      }
    
      return null; // Return null if no matching file is found
    };
    console.log("->3")
    const matchingFile= await readFile();

    if (!matchingFile) {
      return res.status(404).send('File does not exist.');
    }
    // return res.status(404).send(matchingFile)
    // If the file exists, set the response headers for downloading
    res.setHeader('Content-Disposition', `attachment; filename=${matchingFile}`);
    res.setHeader('Content-Type', 'application/pdf');

    // Stream the file to the response
    const filePath = path.join(pdfDirectory, matchingFile);
    const fileStream = createReadStream(filePath);
    fileStream.pipe(res);

  } catch (error) {
    return res.status(500).send(error);
  }
});






const start = async () => {
  try {
    await connectMongoDB();
    app.listen(port, () =>
      console.log(
        `⚡️[server]: Server iS running at http://localhost:${port} && Database is connected`
      )
    );
  } catch (error) {
    console.log(error);
  }
};
start();
