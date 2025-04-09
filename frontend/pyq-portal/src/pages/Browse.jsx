import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { IoMdSearch, IoMdDownload, IoMdEye, IoMdDocument } from 'react-icons/io';

// Mock data for demonstration
const mockPapers = [
    {
      id: 1,
      title: 'Lorem Ipsum Dolor Sit Amet',
      subject: 'Consectetur Adipiscing',
      year: '2022-2023',
      semester: 'Semester3',
      uploadDate: '2023-01-15',
      fileSize: '2.4 MB',
      downloads: 128
    },
    {
      id: 2,
      title: 'Sed Do Eiusmod Tempor',
      subject: 'Incididunt Ut Labore',
      year: '2022-2023',
      semester: 'Semester4',
      uploadDate: '2023-05-20',
      fileSize: '3.1 MB',
      downloads: 215
    },
    {
      id: 3,
      title: 'Ut Enim Ad Minim Veniam',
      subject: 'Quis Nostrud Exercitation',
      year: '2021-2022',
      semester: 'Semester5',
      uploadDate: '2022-06-10',
      fileSize: '1.9 MB',
      downloads: 97
    },
    {
      id: 4,
      title: 'Duis Aute Irure Dolor',
      subject: 'In Reprehenderit',
      year: '2022-2023',
      semester: 'Semester3',
      uploadDate: '2023-05-18',
      fileSize: '2.6 MB',
      downloads: 156
    },
    {
      id: 5,
      title: 'Excepteur Sint Occaecat',
      subject: 'Cupidatat Non Proident',
      year: '2021-2022',
      semester: 'Semester4',
      uploadDate: '2022-11-05',
      fileSize: '1.8 MB',
      downloads: 203
    },
    {
      id: 6,
      title: 'Sunt In Culpa Qui Officia',
      subject: 'Deserunt Mollit Anim',
      year: '2022-2023',
      semester: 'Semester2',
      uploadDate: '2023-04-22',
      fileSize: '2.2 MB',
      downloads: 178
    }
  ];
  

const Browse = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedSemester, setSelectedSemester] = useState('');
  const [filteredPapers, setFilteredPapers] = useState(mockPapers);
  
  // Available years and semesters for filtering
  const years = [...new Set(mockPapers.map(paper => paper.year))];
  const semesters = [...new Set(mockPapers.map(paper => paper.semester))];
  
  // Apply filters whenever search term or dropdowns change
  useEffect(() => {
    let results = mockPapers;
    
    if (searchTerm) {
      results = results.filter(paper => 
        paper.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        paper.subject.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (selectedYear) {
      results = results.filter(paper => paper.year === selectedYear);
    }
    
    if (selectedSemester) {
      results = results.filter(paper => paper.semester === selectedSemester);
    }
    
    setFilteredPapers(results);
  }, [searchTerm, selectedYear, selectedSemester]);
  
  const resetFilters = () => {
    setSearchTerm('');
    setSelectedYear('');
    setSelectedSemester('');
  };
  
  const handleDownload = (id) => {
    // In a real application, this would trigger the download
    alert(`Downloading paper ID: ${id}`);
  };
  
  const handlePreview = (id) => {
    // In a real application, this would open a preview
    alert(`Previewing paper ID: ${id}`);
  };
  
  return (
    <div>
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Browse Question Papers</h1>
        <p className="text-gray-600 max-w-3xl mx-auto">
Lorem Ipsum
        </p>
      </div>
      
      {/* Search and Filter Section */}
      <div className="mb-10">
        <div className="card glass p-6">
          <div className="grid gap-6 md:grid-cols-4">
            <div className="md:col-span-2">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <IoMdSearch className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by title or subject..."
                  className="form-input pl-10"
                />
              </div>
            </div>
            
            <div>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="form-input"
              >
                <option value="">All Years</option>
                {years.map((year) => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
            
            <div>
              <select
                value={selectedSemester}
                onChange={(e) => setSelectedSemester(e.target.value)}
                className="form-input"
              >
                <option value="">All Semesters</option>
                {semesters.map((semester) => (
                  <option key={semester} value={semester}>
                    {semester.replace(/Semester/, 'Semester ')}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="mt-4 flex justify-end">
            <button
              onClick={resetFilters}
              className="text-sm text-primary-600 hover:text-primary-800"
            >
              Reset Filters
            </button>
          </div>
        </div>
      </div>
      
      {/* Results Section */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredPapers.length > 0 ? (
          filteredPapers.map((paper, index) => (
            <motion.div
              key={paper.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="card card-hover"
            >
              <div className="flex items-start mb-4">
                <div className="p-3 bg-primary-100 rounded-lg mr-4">
                  <IoMdDocument className="h-8 w-8 text-primary-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{paper.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{paper.subject}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mb-4">
                <div>
                  <span className="font-medium">Year:</span> {paper.year}
                </div>
                <div>
                  <span className="font-medium">Semester:</span>{' '}
                  {paper.semester.replace(/Semester/, 'Sem ')}
                </div>
                <div>
                  <span className="font-medium">Uploaded:</span>{' '}
                  {new Date(paper.uploadDate).toLocaleDateString()}
                </div>
                <div>
                  <span className="font-medium">Size:</span> {paper.fileSize}
                </div>
              </div>
              
              <div className="flex justify-between mt-4 pt-4 border-t border-gray-200">
                <span className="text-sm text-gray-500">
                  {paper.downloads} downloads
                </span>
                
                <div className="flex space-x-2">
                  <button
                    onClick={() => handlePreview(paper.id)}
                    className="p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-full"
                    title="Preview"
                  >
                    <IoMdEye className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDownload(paper.id)}
                    className="p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-full"
                    title="Download"
                  >
                    <IoMdDownload className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <IoMdSearch className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No results found</h3>
            <p className="text-gray-600 mb-4">
              We couldn't find any papers matching your search criteria.
            </p>
            <button
              onClick={resetFilters}
              className="text-primary-600 hover:text-primary-800 font-medium"
            >
              Reset all filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Browse;