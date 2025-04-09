import { motion } from 'framer-motion';
import { IoMdSchool, IoMdPeople, IoMdRocket, IoMdHeart } from 'react-icons/io';

const About = () => {
  return (
    <div>
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">About PYQ Portal</h1>
        <p className="text-gray-600 max-w-3xl mx-auto">
          Learn more about our mission to help students prepare better for their examinations
          through collaboration and resource sharing.
        </p>
      </div>
      
      {/* Mission Section */}
      <section className="mb-16">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card glass p-8"
        >
          <div className="flex flex-col md:flex-row gap-8 items-center">
            <div className="md:w-1/3 flex justify-center">
              <div className="w-48 h-48 rounded-full bg-primary-100 flex items-center justify-center">
                <IoMdSchool className="w-24 h-24 text-primary-600" />
              </div>
            </div>
            <div className="md:w-2/3">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
              <p className="text-gray-600 mb-4">
                PYQ Portal was created with a simple but powerful mission: to help students prepare 
                better for their examinations by providing easy access to previous year question papers.
              </p>
              <p className="text-gray-600">
                We believe that practicing with real exam questions is one of the most effective ways 
                to prepare. By creating a centralized repository of previous year questions, organized 
                by year, semester, and subject, we aim to make exam preparation more efficient and 
                effective for students everywhere.
              </p>
            </div>
          </div>
        </motion.div>
      </section>
      
      {/* How it Works Section */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">How It Works</h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="card card-hover p-6 text-center"
          >
            <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center mx-auto mb-4">
              <IoMdPeople className="w-8 h-8 text-primary-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Community Contributions</h3>
            <p className="text-gray-600">
              Students upload previous year question papers, contributing to a growing library of 
              resources that helps everyone prepare better.
            </p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card card-hover p-6 text-center"
          >
            <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center mx-auto mb-4">
              <IoMdRocket className="w-8 h-8 text-primary-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Organized Learning</h3>
            <p className="text-gray-600">
              Papers are systematically organized by academic year, semester, and subject, 
              making it easy to find relevant material for your specific needs.
            </p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="card card-hover p-6 text-center"
          >
            <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center mx-auto mb-4">
              <IoMdHeart className="w-8 h-8 text-primary-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Better Preparation</h3>
            <p className="text-gray-600">
              Students benefit from practicing with real questions from previous exams, 
              gaining confidence and improving their performance.
            </p>
          </motion.div>
        </div>
      </section>
      
      {/* FAQ Section */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Frequently Asked Questions</h2>
        
        <div className="space-y-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="card p-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Who can upload question papers?
            </h3>
            <p className="text-gray-600">
              Any registered student can upload previous year question papers. We encourage everyone to 
              contribute to help build a comprehensive repository.
            </p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card p-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Are the papers verified before being published?
            </h3>
            <p className="text-gray-600">
              We have a moderation process to ensure that uploaded papers are legitimate and correctly 
              categorized. However, we rely on the community to report any issues with the content.
            </p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="card p-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Is there a limit to how many papers I can download?
            </h3>
            <p className="text-gray-600">
              No, there are no download limits. We want to encourage learning and preparation, 
              so all resources are freely available to registered users.
            </p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="card p-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              How can I contribute beyond uploading papers?
            </h3>
            <p className="text-gray-600">
              Besides uploading papers, you can help by reporting any incorrectly categorized papers, 
              suggesting improvements to the platform, or sharing the portal with your classmates and friends.
            </p>
          </motion.div>
        </div>
      </section>
      
      {/* Contact Section */}
      <section className="mb-16">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card glass p-8 text-center"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Get in Touch</h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Have questions, suggestions, or want to report an issue? We'd love to hear from you.
            You can reach us through any of the following channels:
          </p>
          
          <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <div className="p-4">
              <h3 className="font-semibold text-gray-900 mb-2">Email</h3>
              <p className="text-gray-600">contact@pyqportal.edu</p>
            </div>
            
            <div className="p-4">
              <h3 className="font-semibold text-gray-900 mb-2">Social Media</h3>
              <p className="text-gray-600">@pyqportal</p>
            </div>
            
            <div className="p-4">
              <h3 className="font-semibold text-gray-900 mb-2">Help Desk</h3>
              <p className="text-gray-600">Main Library, Campus Center</p>
            </div>
          </div>
        </motion.div>
      </section>
      
      {/* Team Section */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Our Team</h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="card card-hover p-6 text-center"
          >
            <div className="w-24 h-24 rounded-full bg-gray-300 mx-auto mb-4 overflow-hidden">
              <img 
                src="/api/placeholder/200/200" 
                alt="Team member" 
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-1">Alex Johnson</h3>
            <p className="text-gray-500 mb-3">Founder & Developer</p>
            <p className="text-gray-600 text-sm">
              Computer Science graduate with a passion for making education accessible to all.
            </p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card card-hover p-6 text-center"
          >
            <div className="w-24 h-24 rounded-full bg-gray-300 mx-auto mb-4 overflow-hidden">
              <img 
                src="/api/placeholder/200/200" 
                alt="Team member" 
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-1">Priya Sharma</h3>
            <p className="text-gray-500 mb-3">Content Manager</p>
            <p className="text-gray-600 text-sm">
              Education enthusiast focused on quality control and content organization.
            </p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="card card-hover p-6 text-center"
          >
            <div className="w-24 h-24 rounded-full bg-gray-300 mx-auto mb-4 overflow-hidden">
              <img 
                src="/api/placeholder/200/200" 
                alt="Team member" 
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-1">Michael Chen</h3>
            <p className="text-gray-500 mb-3">UI/UX Designer</p>
            <p className="text-gray-600 text-sm">
              Designer with a focus on creating intuitive and accessible user experiences.
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default About;