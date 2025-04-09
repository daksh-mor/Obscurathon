import multer from "multer";
import path from "path";
import fs from "fs";

// Create a temporary storage or memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed!'), false);
    }
  }
});

// Create a middleware function that handles the file after body is parsed
const handleFileUpload = (fieldName) => {
  return (req, res, next) => {
    // First, use multer to get the file
    upload.single(fieldName)(req, res, (err) => {
      if (err) {
        return next(err);
      }

      // Now req.body is available and fully parsed
      const { year, semester, subject } = req.body;
      
      console.log("Body data:", req.body);

      // Validate required parameters
      if (!year || !semester || !subject) {
        return res.status(400).json({ 
          error: 'Missing required parameters: year, semester, and subject are required' 
        });
      }

      // If no file was uploaded
      if (!req.file) {
        return res.status(400).json({ error: 'No PDF file uploaded' });
      }

      try {
        // Create hierarchical path: uploads/year/semester/subject/
        const dir = path.join('./uploads', year, semester, subject);
        
        // Create directory structure if it doesn't exist
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
        }

        // Create unique filename
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const filename = fieldName + '-' + uniqueSuffix + path.extname(req.file.originalname);
        const filepath = path.join(dir, filename);

        // Write the file to disk
        fs.writeFileSync(filepath, req.file.buffer);

        // Add file path info to the request for later use
        req.savedFile = {
          filename,
          path: filepath,
          destination: dir,
          originalname: req.file.originalname,
          mimetype: req.file.mimetype,
          size: req.file.size
        };

        next();
      } catch (error) {
        return next(error);
      }
    });
  };
};

export { handleFileUpload };