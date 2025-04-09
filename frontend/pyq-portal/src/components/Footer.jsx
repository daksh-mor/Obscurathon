import { Link } from 'react-router-dom';
import { 
  IoLogoGithub, 
  IoLogoLinkedin, 
  IoLogoTwitter,
  IoMdCloudUpload
} from 'react-icons/io';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-white border-t border-gray-200 mt-12">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <IoMdCloudUpload className="h-6 w-6 text-primary-600 mr-2" />
            <span className="font-medium text-gray-800">PYQ Portal</span>
          </div>
          
          <div className="flex items-center space-x-4 mb-4 md:mb-0">
            <a 
              href="https://github.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-gray-700 transition-colors"
              aria-label="GitHub"
            >
              <IoLogoGithub className="h-5 w-5" />
            </a>
            <a 
              href="https://linkedin.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-gray-700 transition-colors"
              aria-label="LinkedIn"
            >
              <IoLogoLinkedin className="h-5 w-5" />
            </a>
            <a 
              href="https://twitter.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-gray-700 transition-colors"
              aria-label="Twitter"
            >
              <IoLogoTwitter className="h-5 w-5" />
            </a>
          </div>
          
          <div className="text-sm text-gray-500">
            <div className="flex space-x-4 mb-2">
              <Link to="/" className="hover:text-primary-600 transition-colors">Home</Link>
              <Link to="/upload" className="hover:text-primary-600 transition-colors">Upload</Link>
              <Link to="/browse" className="hover:text-primary-600 transition-colors">Browse</Link>
              <Link to="/about" className="hover:text-primary-600 transition-colors">About</Link>
            </div>
            <p>© {currentYear} PYQ Portal. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;