import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  IoMdCloudUpload, 
  IoMdSearch, 
  IoMdSchool,
  IoMdPeople
} from 'react-icons/io';

const Home = () => {
  const features = [
    {
      icon: <IoMdCloudUpload className="w-8 h-8 text-primary-600" />,
      title: 'Easy Uploads',
      description: 'Quickly upload previous year question papers with a simple form structure.'
    },
    {
      icon: <IoMdSearch className="w-8 h-8 text-primary-600" />,
      title: 'Smart Search',
      description: 'Find exactly what you need with our powerful search and filtering system.'
    },
    {
      icon: <IoMdSchool className="w-8 h-8 text-primary-600" />,
      title: 'Academic Organization',
      description: 'Papers organized by year, semester, and subject for efficient studying.'
    },
    {
      icon: <IoMdPeople className="w-8 h-8 text-primary-600" />,
      title: 'Community Driven',
      description: 'Built by students, for students. Contribute to help your peers excel.'
    }
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="text-center py-12 md:py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto px-4"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Ace Your Exams with Previous Year Questions
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Access, upload, and share previous year question papers to help everyone prepare better.
            Your one-stop portal for exam preparation material.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/upload" className="btn btn-primary">
              <IoMdCloudUpload className="w-5 h-5" />
              Upload PYQs
            </Link>
            <Link to="/browse" className="btn bg-white text-primary-700 border border-primary-300 hover:bg-primary-50">
              <IoMdSearch className="w-5 h-5" />
              Browse Papers
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Feature Cards */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Why Use PYQ Portal?
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="card card-hover p-6"
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-primary-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-4xl font-bold mb-2">1000+</p>
              <p className="text-primary-200">Question Papers</p>
            </div>
            <div>
              <p className="text-4xl font-bold mb-2">25+</p>
              <p className="text-primary-200">Subjects</p>
            </div>
            <div>
              <p className="text-4xl font-bold mb-2">8</p>
              <p className="text-primary-200">Semesters</p>
            </div>
            <div>
              <p className="text-4xl font-bold mb-2">500+</p>
              <p className="text-primary-200">Active Users</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to contribute?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Help your fellow students by uploading previous year question papers.
            Every contribution makes our library more valuable for everyone.
          </p>
          <Link to="/upload" className="btn btn-primary px-8">
            Upload Your First PYQ
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;