import express from "express"
import fs from "fs"
import path from "path"
import cors from "cors"
import {handleFileUpload} from "./src/middlewares/multer.middleware.js"

const app = express();
const port = 3001;

// --- Configuration ---
// const pyqDataDir = path.join(__dirname, 'pyq_data'); // Directory where course folders are
// const validCourses = ['OS', 'OOPS', 'CA', 'TOC', 'ADA']; // Hardcoded courses

// --- Middleware ---
// Enable CORS for requests from your frontend (running on a different port)
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/upload',handleFileUpload('pdf'),(req,res)=>{
    const body = req.body;
    console.log(body);
    const file = req?.file;
    if(!file){
        console.log("No file Found")
        res.status(400).json({msg: "NO Data found"})
    }
    return res.json({msg: "File Uploaded"})
})

app.get('/',(req,res)=>{
    console.log("HI there")
    res.send("Working")
})

// Serve the static PDF files from the pyq_data directory
// Access files like: http://localhost:3001/static/OS/OS_2024_ProfA_PYQ.pdf
// app.use('/static', express.static(pyqDataDir));

// --- API Endpoint ---
// app.get('/api/pyqs', (req, res) => {
//     const { course, sortBy = 'year' } = req.query; // Default sort by year

//     if (!course || !validCourses.includes(course)) {
//         return res.status(400).json({ error: 'Invalid or missing course parameter' });
//     }

//     const courseDir = path.join(pyqDataDir, course);

//     fs.readdir(courseDir, (err, files) => {
//         if (err) {
//             console.error("Error reading directory:", err);
//             return res.status(500).json({ error: 'Error reading PYQ data directory' });
//         }

//         const pyqMap = {}; // To group PYQ and Solution

//         files.forEach(file => {
//             if (path.extname(file).toLowerCase() !== '.pdf') return; // Ignore non-pdfs

//             // Simple parsing based on naming convention: COURSE_YEAR_PROF_TYPE.pdf
//             const parts = file.replace('.pdf', '').split('_');
//             if (parts.length < 4) return; // Skip improperly named files

//             const fileCourse = parts[0];
//             const year = parseInt(parts[1], 10);
//             const type = parts[parts.length - 1]; // PYQ or Solution
//             const professor = parts.slice(2, -1).join('_'); // Handle multi-part prof names

//             if (fileCourse !== course || isNaN(year) || !professor || (type !== 'PYQ' && type !== 'Solution')) {
//                 console.warn(`Skipping improperly named file: ${file}`);
//                 return;
//             }

//             const key = `${year}_${professor}`;
//             if (!pyqMap[key]) {
//                 pyqMap[key] = { year, professor, course };
//             }

//             if (type === 'PYQ') {
//                 // Construct the URL path for the static file
//                 pyqMap[key].pyqFile = `static/${course}/${file}`;
//                 pyqMap[key].pyqFilename = file; // Keep original name if needed
//             } else if (type === 'Solution') {
//                 pyqMap[key].solutionFile = `static/${course}/${file}`;
//                 pyqMap[key].solutionFilename = file; // Keep original name if needed
//             }
//         });

//         // Convert map to array and filter out incomplete entries
//         let pyqList = Object.values(pyqMap).filter(item => item.pyqFile && item.solutionFile);

//         // Sorting
//         pyqList.sort((a, b) => {
//             if (sortBy === 'professor') {
//                 // Primary sort by professor, secondary by year (desc)
//                 if (a.professor < b.professor) return -1;
//                 if (a.professor > b.professor) return 1;
//                 return b.year - a.year; // Newer years first within same prof
//             } else { // Default sort by year (desc), secondary by professor
//                 if (a.year !== b.year) {
//                     return b.year - a.year; // Newer years first
//                 }
//                 // If years are same, sort by professor name alphabetically
//                 if (a.professor < b.professor) return -1;
//                 if (a.professor > b.professor) return 1;
//                 return 0;
//             }
//         });

//         res.json(pyqList);
//     });
// });

// --- Start Server ---
app.listen(port, () => {
    console.log(`Backend server listening at http://localhost:${port}`);
    // console.log(`Serving PYQ PDFs from: ${pyqDataDir}`);
    console.log(`API endpoint available at: http://localhost:${port}/api/pyqs`);
});