import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { IoMdCloudUpload, IoMdDocument, IoMdClose } from 'react-icons/io';

const FileInput = ({
  accept = '.pdf',
  maxSize = 10, // in MB
  label = 'Upload File',
  onChange,
  error,
  helperText,
  dropzoneText = 'Drag and drop your file here, or click to browse',
  icon = <IoMdCloudUpload className="w-10 h-10 text-gray-400" />,
  className = '',
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState(null);
  const [fileError, setFileError] = useState('');
  const fileInputRef = useRef(null);

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const validateFile = (file) => {
    const fileType = file.type;
    const fileExtension = file.name.split('.').pop().toLowerCase();
    
    const acceptedTypes = accept.split(',').map(type => type.trim());
    const isAcceptedType = acceptedTypes.some(type => {
      if (type.startsWith('.')) {
        return `.${fileExtension}` === type;
      }
      return fileType === type;
    });

    if (!isAcceptedType) {
      return `File type not supported. Please upload ${accept} files only.`;
    }

    const fileSize = file.size / 1024 / 1024; // in MB
    if (fileSize > maxSize) {
      return `File is too large. Maximum size is ${maxSize}MB.`;
    }

    return '';
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const droppedFile = e.dataTransfer.files[0];
    if (!droppedFile) return;

    const error = validateFile(droppedFile);
    if (error) {
      setFileError(error);
      setFile(null);
      if (onChange) onChange(null);
      return;
    }

    setFileError('');
    setFile(droppedFile);
    if (onChange) onChange(droppedFile);
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    const error = validateFile(selectedFile);
    if (error) {
      setFileError(error);
      setFile(null);
      if (onChange) onChange(null);
      return;
    }

    setFileError('');
    setFile(selectedFile);
    if (onChange) onChange(selectedFile);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const removeFile = (e) => {
    e.stopPropagation();
    setFile(null);
    setFileError('');
    if (onChange) onChange(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const displayError = error || fileError;

  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}

      <motion.div
        whileHover={{ scale: 1.01 }}
        onClick={handleClick}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={`
          border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center transition-all duration-300 cursor-pointer
          ${isDragging ? 'border-primary-500 bg-primary-50' : 'border-gray-300 hover:border-primary-400 bg-gray-50 hover:bg-gray-100'}
          ${displayError ? 'border-red-300 bg-red-50' : ''}
          ${file ? 'border-green-300 bg-green-50' : ''}
        `}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept={accept}
          className="hidden"
        />

        <div className="text-center">
          {file ? (
            <div className="flex flex-col items-center">
              <div className="relative">
                <IoMdDocument className="w-10 h-10 text-primary-500 mb-2" />
                <button
                  type="button"
                  onClick={removeFile}
                  className="absolute -top-2 -right-2 p-1 bg-white rounded-full border border-gray-300 hover:bg-gray-100"
                >
                  <IoMdClose className="w-4 h-4 text-gray-500" />
                </button>
              </div>
              <span className="text-sm font-medium text-gray-900">{file.name}</span>
              <span className="text-xs text-gray-500 mt-1">
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </span>
            </div>
          ) : (
            <>
              {icon}
              <p className="mt-2 text-sm text-gray-600">{dropzoneText}</p>
              <p className="text-xs text-gray-500 mt-1">
                {accept} files up to {maxSize}MB
              </p>
            </>
          )}
        </div>
      </motion.div>

      {(displayError || helperText) && (
        <p
          className={`mt-2 text-sm ${
            displayError ? 'text-red-600' : 'text-gray-500'
          }`}
        >
          {displayError || helperText}
        </p>
      )}
    </div>
  );
};

export default FileInput;