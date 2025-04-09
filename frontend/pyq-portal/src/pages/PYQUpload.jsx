import { useState } from 'react';
import { motion } from 'framer-motion';
import { IoMdCloudUpload, IoMdCheckmarkCircle } from 'react-icons/io';
import { useNotification } from '../context/NotificationContext';
import { pyqService } from '../services/api';
import FileInput from '../components/ui/FileInput';
import Button from '../components/ui/Button';

const PYQUpload = () => {
  const [formData, setFormData] = useState({
    year: '',
    semester: '',
    subject: '',
    examType: '',
    courseCode: '',
  });
  
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const { addNotification } = useNotification();
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleFileChange = (selectedFile) => {
    setFile(selectedFile);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!file) {
      addNotification('Please select a PDF file to upload', 'error');
      return;
    }
    
    // Validate required fields
    const requiredFields = ['year', 'semester', 'subject'];
    const missingFields = requiredFields.filter(field => !formData[field]);
    
    if (missingFields.length > 0) {
      addNotification(`Please fill in all required fields: ${missingFields.join(', ')}`, 'error');
      return;
    }
    
    setIsUploading(true);
    setUploadProgress(0);
    
    const data = new FormData();
    data.append('pdf', file);
    
    // Append all form data
    Object.entries(formData).forEach(([key, value]) => {
      if (value) data.append(key, value);
    });
    
    try {
      await pyqService.uploadPYQ(data, (progressEvent) => {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        setUploadProgress(percentCompleted);
      });
      
      setIsSuccess(true);
      addNotification('PYQ uploaded successfully!', 'success');
      
      // Reset form after successful upload
      setTimeout(() => {
        setFormData({
          year: '',
          semester: '',
          subject: '',
          examType: '',
          courseCode: '',
        });
        setFile(null);
        setIsSuccess(false);
        setUploadProgress(0);
      }, 2000);
      
    } catch (error) {
      console.error('Upload error:', error);
      addNotification(
        error.response?.data?.message || 'Failed to upload PYQ. Please try again.',
        'error'
      );
    } finally {
      setIsUploading(false);
    }
  };
  
  return (
    <div>
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Upload Previous Year Questions</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Help your fellow students by sharing previous year question papers. Upload PDF files
          with proper academic details to maintain an organized repository.
        </p>
      </div>
      
      <div className="max-w-2xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card glass p-8"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-1">
                  Academic Year <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="year"
                  name="year"
                  value={formData.year}
                  onChange={handleInputChange}
                  placeholder="e.g. 2023-2024"
                  className="form-input"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="semester" className="block text-sm font-medium text-gray-700 mb-1">
                  Semester <span className="text-red-500">*</span>
                </label>
                <select
                  id="semester"
                  name="semester"
                  value={formData.semester}
                  onChange={handleInputChange}
                  className="form-input"
                  required
                >
                  <option value="">Select Semester</option>
                  <option value="Semester1">Semester 1</option>
                  <option value="Semester2">Semester 2</option>
                  <option value="Semester3">Semester 3</option>
                  <option value="Semester4">Semester 4</option>
                  <option value="Semester5">Semester 5</option>
                  <option value="Semester6">Semester 6</option>
                  <option value="Semester7">Semester 7</option>
                  <option value="Semester8">Semester 8</option>
                  <option value="Summer">Summer</option>
                </select>
              </div>
            </div>
            
            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                Subject <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                placeholder="e.g. Data Structures and Algorithms"
                className="form-input"
                required
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="examType" className="block text-sm font-medium text-gray-700 mb-1">
                  Exam Type
                </label>
                <select
                  id="examType"
                  name="examType"
                  value={formData.examType}
                  onChange={handleInputChange}
                  className="form-input"
                >
                  <option value="">Select Type</option>
                  <option value="MidTerm">Mid Term</option>
                  <option value="EndTerm">End Term</option>
                  <option value="Quiz">Quiz</option>
                  <option value="Assignment">Assignment</option>
                  <option value="Supplementary">Supplementary</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="courseCode" className="block text-sm font-medium text-gray-700 mb-1">
                  Course Code
                </label>
                <input
                  type="text"
                  id="courseCode"
                  name="courseCode"
                  value={formData.courseCode}
                  onChange={handleInputChange}
                  placeholder="e.g. CS101"
                  className="form-input"
                />
              </div>
            </div>
            
            {/* File Upload Section */}
            <FileInput
              accept="application/pdf"
              label="Upload PDF File"
              maxSize={10}
              dropzoneText="Drag and drop your PDF here, or click to browse"
              icon={isSuccess ? 
                <IoMdCheckmarkCircle className="w-12 h-12 text-green-500" /> : 
                <IoMdCloudUpload className="w-12 h-12 text-gray-400" />
              }
              onChange={handleFileChange}
              helperText="PDF files only, up to 10MB"
            />
            
            {/* Upload Progress Bar */}
            {(isUploading || uploadProgress > 0) && (
              <div className="mt-4">
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <motion.div
                    className="bg-primary-600 h-2.5 rounded-full"
                    initial={{ width: '0%' }}
                    animate={{ width: `${uploadProgress}%` }}
                    transition={{ duration: 0.3 }}
                  ></motion.div>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {isUploading ? `Uploading: ${uploadProgress}%` : ''}
                </p>
              </div>
            )}
            
            <div className="mt-6">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full bg-blue-500"
                disabled={isUploading}
                isLoading={isUploading}
                icon={<IoMdCloudUpload className="w-5 h-5" />}
                iconPosition="left"
              >
                Upload PYQ
              </Button>
            </div>
          </form>
        </motion.div>
        
        <div className="mt-10 p-5 card glass">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Upload Guidelines</h2>
          <ul className="space-y-2 text-gray-600 list-disc pl-5">
            <li>Please ensure the PDF is clear and readable</li>
            <li>Include relevant details like exam date, department, etc.</li>
            <li>Name the file appropriately before uploading</li>
            <li>Double-check all information for accuracy</li>
            <li>Make sure the PDF size is under 10MB</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PYQUpload;