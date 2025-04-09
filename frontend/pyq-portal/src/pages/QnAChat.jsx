import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { IoMdSend, IoMdHelpCircle, IoMdPerson, IoMdRefresh } from 'react-icons/io';
import { useNotification } from '../context/NotificationContext';
import { pyqService } from '../services/api';
import Button from '../components/ui/Button';

const QnAChat = () => {
  const [query, setQuery] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [systemStatus, setSystemStatus] = useState(null);
  const [isLoadingStatus, setIsLoadingStatus] = useState(false);
  const chatEndRef = useRef(null);
  
  const { addNotification } = useNotification();
  
  // Scroll to bottom when chat history updates
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatHistory]);
  
  // Add welcome message when component mounts and fetch system status
  useEffect(() => {
    setChatHistory([
      {
        role: 'assistant',
        content: 'Hello! I can help you with questions about previous year papers and exams. What would you like to know?',
        timestamp: new Date()
      }
    ]);
    
    fetchSystemStatus();
  }, []);
  
  const fetchSystemStatus = async () => {
    setIsLoadingStatus(true);
    try {
      const status = await pyqService.getSystemStatus();
      setSystemStatus(status);
    } catch (error) {
      console.error('Error fetching system status:', error);
      addNotification('Failed to fetch system status', 'error');
    } finally {
      setIsLoadingStatus(false);
    }
  };
  
  const handleTriggerScan = async () => {
    try {
      await pyqService.triggerScan();
      addNotification('PDF scan initiated successfully', 'success');
      
      // Wait a bit and refresh status
      setTimeout(fetchSystemStatus, 2000);
    } catch (error) {
      console.error('Error triggering scan:', error);
      addNotification('Failed to trigger PDF scan', 'error');
    }
  };
  
  const handleInputChange = (e) => {
    setQuery(e.target.value);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!query.trim()) return;
    
    // Add user message to chat
    const userMessage = {
      role: 'user',
      content: query,
      timestamp: new Date()
    };
    
    setChatHistory(prev => [...prev, userMessage]);
    setQuery('');
    setIsTyping(true);
    
    try {
      // Format chat history for API
      const formattedHistory = chatHistory.map(msg => ({
        role: msg.role,
        content: msg.content
      }));
      
      // Add current query to history
      formattedHistory.push({
        role: 'user',
        content: query
      });
      
      // Send to backend
      const response = await pyqService.sendChatQuery(formattedHistory);
      
      // Add response to chat
      setChatHistory(prev => [...prev, {
        role: 'assistant',
        content: response.message,
        timestamp: new Date(),
        sources: response.sources
      }]);
      
      // Refresh system status after query
      fetchSystemStatus();
      
    } catch (error) {
      console.error('Chat error:', error);
      addNotification(
        'Failed to get a response. Please try again.',
        'error'
      );
      
      // Add error message to chat
      setChatHistory(prev => [...prev, {
        role: 'assistant',
        content: 'Sorry, I encountered an error while processing your request. Please try again later.',
        timestamp: new Date()
      }]);
    } finally {
      setIsTyping(false);
    }
  };
  
  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  return (
    <div>
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Study Buddy Q&A</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Ask questions about previous year papers, exam preparation, or any academic queries.
          Our AI assistant will help you find the answers.
        </p>
      </div>
      
      <div className="max-w-2xl mx-auto">
        {/* System Status */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card glass p-4 mb-4"
        >
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-semibold">System Status</h2>
            <Button
              onClick={fetchSystemStatus}
              variant="secondary"
              size="xs"
              disabled={isLoadingStatus}
              icon={<IoMdRefresh className={`w-4 h-4 ${isLoadingStatus ? 'animate-spin' : ''}`} />}
            >
              Refresh
            </Button>
          </div>
          
          {systemStatus ? (
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Knowledge Base:</span> 
                <span className={`ml-2 ${systemStatus.vectorstore_initialized ? 'text-green-500' : 'text-yellow-500'}`}>
                  {systemStatus.vectorstore_initialized ? 'Ready' : 'Initializing'}
                </span>
              </div>
              <div>
                <span className="font-medium">Indexed PDFs:</span> 
                <span className="ml-2">{systemStatus.indexed_pdfs}</span>
              </div>
              <div>
                <span className="font-medium">Last Scan:</span> 
                <span className="ml-2">
                  {systemStatus.last_scan_time ? new Date(systemStatus.last_scan_time * 1000).toLocaleTimeString() : 'Never'}
                </span>
              </div>
            </div>
          ) : (
            <p className="text-gray-500 text-sm">Loading system status...</p>
          )}
          
          <div className="mt-3 flex justify-end">
            <Button
              onClick={handleTriggerScan}
              variant="primary"
              size="sm"
              className="bg-blue-500"
            >
              Scan for New PDFs
            </Button>
          </div>
        </motion.div>
        
        {/* Chat Interface */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card glass p-4 mb-4"
        >
          {/* Chat History */}
          <div className="h-96 overflow-y-auto mb-4 p-2">
            {chatHistory.map((message, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex mb-4 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex max-w-3/4 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`h-8 w-8 rounded-full flex items-center justify-center ${message.role === 'user' ? 'bg-blue-500 ml-2' : 'bg-gray-500 mr-2'}`}>
                    {message.role === 'user' ? (
                      <IoMdPerson className="text-white" />
                    ) : (
                      <IoMdHelpCircle className="text-white" />
                    )}
                  </div>
                  <div className={`px-4 py-2 rounded-xl ${message.role === 'user' ? 'bg-blue-100 text-right' : 'bg-gray-100'}`}>
                    <div className="text-sm whitespace-pre-wrap">
                      {message.content}
                    </div>
                    
                    {/* Display sources if available */}
                    {message.sources && message.sources.length > 0 && (
                      <div className="mt-2 pt-2 border-t border-gray-200">
                        <span className="text-xs font-semibold text-gray-600">Sources:</span>
                        <ul className="text-xs text-gray-500 mt-1">
                          {message.sources.map((source, idx) => (
                            <li key={idx}>{source}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {message.timestamp && (
                      <div className="text-xs text-gray-500 mt-1">
                        {formatTimestamp(message.timestamp)}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
            
            {/* Show typing indicator */}
            {isTyping && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-start mb-4"
              >
                <div className="flex">
                  <div className="h-8 w-8 rounded-full flex items-center justify-center bg-gray-500 mr-2">
                    <IoMdHelpCircle className="text-white" />
                  </div>
                  <div className="px-4 py-2 rounded-xl bg-gray-100">
                    <div className="flex space-x-1">
                      <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                      <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
            
            {/* Scroll to bottom reference */}
            <div ref={chatEndRef} />
          </div>
          
          {/* Message Input */}
          <form onSubmit={handleSubmit} className="flex items-center">
            <input
              type="text"
              value={query}
              onChange={handleInputChange}
              placeholder="Type your question here..."
              className="form-input flex-grow mr-2"
              disabled={isTyping}
            />
            <Button
              type="submit"
              variant="primary"
              size="sm"
              className="bg-blue-500"
              disabled={isTyping || !query.trim()}
              icon={<IoMdSend className="w-4 h-4" />}
              iconPosition="right"
            >
              Send
            </Button>
          </form>
        </motion.div>
        
        {/* Chat Tips */}
        <div className="mt-6 p-5 card glass">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Chat Tips</h2>
          <ul className="space-y-2 text-gray-600 list-disc pl-5">
            <li>Ask specific questions about previous year papers</li>
            <li>Ask for exam preparation tips for specific subjects</li>
            <li>Ask about course recommendations or study strategies</li>
            <li>Try to provide context for more accurate responses</li>
            <li>You can ask follow-up questions on the same topic</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default QnAChat;