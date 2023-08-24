"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const constant_1 = require("./utils/constant");
const connectDB_1 = __importDefault(require("./connectDB"));
const Students_1 = __importDefault(require("./model/Students"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const multer_1 = __importDefault(require("multer"));
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
const pdf_parse_1 = __importDefault(require("pdf-parse"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
const port = 5000;
const storage = multer_1.default.diskStorage({
    destination: 'uploads/',
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});
const tempStorage = multer_1.default.diskStorage({
    destination: 'uploads/',
    filename: (req, file, cb) => {
        cb(null, `temp.pdf`);
    }
});
app.get('/', (req, res) => {
    res.send('Hello, Node.js server!');
});
app.post('/api/addStudent', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield Students_1.default.insertMany(constant_1.studentDataArray);
        res.status(200).json({
            success: true,
            data
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "adding student failed"
        });
    }
}));
app.get('/api/getStudent/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        console.log(id);
        const data = yield Students_1.default.findOne({ studentID: id });
        res.status(200).json({
            success: true,
            data
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "adding student failed"
        });
    }
}));
app.get('/api/getStudents', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield Students_1.default.find();
        res.status(200).json({
            success: true,
            data
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "adding student failed"
        });
    }
}));
app.patch('/api/adduuid/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        console.log(req.body, req.params);
        const data = yield Students_1.default.findOneAndUpdate({ studentID: id }, req.body);
        res.status(200).json({
            success: true,
            data
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "adding student failed"
        });
    }
}));
const upload = (0, multer_1.default)({ storage });
const temp = (0, multer_1.default)({ storage: tempStorage });
app.post('/api/upload', upload.single('pdf'), (req, res) => {
    var _a;
    console.log('PDF saved:', (_a = req === null || req === void 0 ? void 0 : req.file) === null || _a === void 0 ? void 0 : _a.originalname);
    res.json({ message: 'PDF saved successfully' });
});
const pdfDirectory = path_1.default.join(__dirname, '../uploads');
app.get('/api/downloadPdf/:uuid', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const requestedUUID = req.params.uuid;
    console.log(requestedUUID, pdfDirectory);
    try {
        const files = yield promises_1.default.readdir(pdfDirectory);
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
        const readFile = () => __awaiter(void 0, void 0, void 0, function* () {
            for (const file of files) {
                const filePath = path_1.default.join(pdfDirectory, file);
                const pdfBuffer = yield promises_1.default.readFile(filePath);
                const data = yield (0, pdf_parse_1.default)(pdfBuffer);
                const metadata = data.info;
                console.log('Title:', metadata.Title);
                console.log('Subject:', metadata.Subject);
                if (metadata.Subject === requestedUUID) {
                    return file; // Return the file if it matches
                }
            }
            return null; // Return null if no matching file is found
        });
        console.log("->3");
        const matchingFile = yield readFile();
        if (!matchingFile) {
            return res.status(404).send('File does not exist.');
        }
        // return res.status(404).send(matchingFile)
        // If the file exists, set the response headers for downloading
        res.setHeader('Content-Disposition', `attachment; filename=${matchingFile}`);
        res.setHeader('Content-Type', 'application/pdf');
        // Stream the file to the response
        const filePath = path_1.default.join(pdfDirectory, matchingFile);
        // const fileStream = createReadStream(filePath);
        // fileStream.pipe(res);
        res.download(filePath, matchingFile);
    }
    catch (error) {
        return res.status(500).send(error);
    }
}));
app.post('/api/getUuid', temp.single('pdfFile'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const filePath = pdfDirectory + '/temp.pdf';
        const pdfBuffer = yield promises_1.default.readFile(filePath);
        const data = yield (0, pdf_parse_1.default)(pdfBuffer);
        const metadata = data.info;
        const student = yield Students_1.default.findOne({ uuid: metadata.Subject });
        yield promises_1.default.unlink(filePath);
        console.log({ uuid: metadata.Subject, transactionHash: "", Author: metadata.Author, CreationDate: metadata.CreationDate });
        return res.json({ uuid: metadata.Subject, transactionHash: student === null || student === void 0 ? void 0 : student.transactionHash, Author: metadata.Author, CreationDate: metadata.CreationDate });
    }
    catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
}));
const start = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, connectDB_1.default)();
        app.listen(port, () => console.log(`⚡️[server]: Server iS running at http://localhost:${port} && Database is connected`));
    }
    catch (error) {
        console.log(error);
    }
});
start();
