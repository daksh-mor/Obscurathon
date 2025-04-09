from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import time
import hashlib
from pathlib import Path
import logging
import threading
import json

# LangChain imports
from langchain_google_genai import GoogleGenerativeAI
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.document_loaders import PyPDFLoader, DirectoryLoader
from langchain_community.vectorstores import FAISS
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain.chains import ConversationalRetrievalChain
from langchain.memory import ConversationBufferMemory

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Configuration
GOOGLE_API_KEY ="AIzaSyCav9NHJrt0q16F16hT9gU1ZaWQPyTiqUk"  # Make sure to set this environment variable
PDF_DIR = "./uploads"  # Default directory for PDFs
EMBEDDINGS_DIR = os.getenv("EMBEDDINGS_DIR", "./embeddings")  # Directory to store embeddings
SCAN_INTERVAL = int(os.getenv("SCAN_INTERVAL", "3600"))  # How often to scan for new PDFs (in seconds), default 1 hour
CHUNK_SIZE = 1000
CHUNK_OVERLAP = 200

# Global variables
vectorstore = None
chain = None
file_hashes = {}
last_scan_time = 0
scanning_lock = threading.Lock()

# Ensure directories exist
Path(PDF_DIR).mkdir(parents=True, exist_ok=True)
Path(EMBEDDINGS_DIR).mkdir(parents=True, exist_ok=True)

def get_file_hash(filepath):
    """Calculate MD5 hash of a file."""
    hash_md5 = hashlib.md5()
    with open(filepath, "rb") as f:
        for chunk in iter(lambda: f.read(4096), b""):
            hash_md5.update(chunk)
    return hash_md5.hexdigest()

def load_hashes():
    """Load previously calculated file hashes from disk."""
    global file_hashes
    hash_file = Path(EMBEDDINGS_DIR) / "file_hashes.json"
    if hash_file.exists():
        with open(hash_file, "r") as f:
            file_hashes = json.load(f)
    logger.info(f"Loaded {len(file_hashes)} file hashes")

def save_hashes():
    """Save current file hashes to disk."""
    hash_file = Path(EMBEDDINGS_DIR) / "file_hashes.json"
    with open(hash_file, "w") as f:
        json.dump(file_hashes, f)
    logger.info(f"Saved {len(file_hashes)} file hashes")

def check_and_process_pdfs():
    """Check for new or modified PDFs and process them."""
    global vectorstore, file_hashes, last_scan_time

    # Only allow one scan at a time
    if not scanning_lock.acquire(blocking=False):
        logger.info("Another scan is already in progress")
        return

    try:
        current_time = time.time()
        if current_time - last_scan_time < SCAN_INTERVAL and vectorstore is not None:
            # Skip if we've scanned recently and already have a vectorstore
            logger.info("Skipping scan as it was done recently")
            return

        logger.info("Scanning for new or modified PDFs...")
        last_scan_time = current_time
        new_or_modified = False

        # Walk through all subdirectories of PDF_DIR
        for root, _, files in os.walk(PDF_DIR):
            for file in files:
                if file.lower().endswith('.pdf'):
                    filepath = os.path.join(root, file)
                    current_hash = get_file_hash(filepath)
                    
                    # Check if file is new or modified
                    if filepath not in file_hashes or file_hashes[filepath] != current_hash:
                        logger.info(f"Processing new or modified PDF: {filepath}")
                        file_hashes[filepath] = current_hash
                        new_or_modified = True

        if new_or_modified or vectorstore is None:
            # Process all PDFs and update vectorstore
            initialize_vectorstore()
            save_hashes()
        else:
            logger.info("No new or modified PDFs found")

    finally:
        scanning_lock.release()

def initialize_vectorstore():
    """Process all PDFs and create or update the vectorstore."""
    global vectorstore, chain
    
    logger.info("Initializing/updating vectorstore...")
    
    # Initialize embeddings model
    embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001", google_api_key=GOOGLE_API_KEY)
    
    # Check if we have a saved vectorstore
    faiss_path = Path(EMBEDDINGS_DIR) / "faiss_index"
    
    if new_or_modified_pdfs() or not faiss_path.exists():
        # Load all PDFs from directory and subdirectories
        loader = DirectoryLoader(PDF_DIR, glob="**/*.pdf", loader_cls=PyPDFLoader)
        documents = loader.load()
        logger.info(f"Loaded {len(documents)} documents")
        
        # Split documents into chunks
        text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=CHUNK_SIZE,
            chunk_overlap=CHUNK_OVERLAP
        )
        texts = text_splitter.split_documents(documents)
        logger.info(f"Split into {len(texts)} chunks")
        
        # Create and save vectorstore
        vectorstore = FAISS.from_documents(texts, embeddings)
        vectorstore.save_local(str(faiss_path))
        logger.info(f"Vectorstore saved to {faiss_path}")
    else:
        # Load existing vectorstore
        vectorstore = FAISS.load_local(str(faiss_path), embeddings)
        logger.info(f"Loaded existing vectorstore from {faiss_path}")
    
    # Initialize retrieval chain
    initialize_chain()

def new_or_modified_pdfs():
    """Check if there are any new or modified PDFs."""
    for root, _, files in os.walk(PDF_DIR):
        for file in files:
            if file.lower().endswith('.pdf'):
                filepath = os.path.join(root, file)
                current_hash = get_file_hash(filepath)
                if filepath not in file_hashes or file_hashes[filepath] != current_hash:
                    return True
    return False

def initialize_chain():
    """Initialize the conversational retrieval chain."""
    global chain, vectorstore
    
    if vectorstore is None:
        logger.error("Cannot initialize chain: vectorstore is None")
        return
    
    try:
        # Initialize LLM
        llm = GoogleGenerativeAI(
            model="gemini-pro",
            google_api_key=GOOGLE_API_KEY,
            temperature=0.3,
            top_p=0.95,
            max_output_tokens=2048
        )
        
        # Initialize memory
        memory = ConversationBufferMemory(
            memory_key="chat_history",
            return_messages=True
        )
        
        # Create retrieval chain
        chain = ConversationalRetrievalChain.from_llm(
            llm=llm,
            retriever=vectorstore.as_retriever(search_kwargs={"k": 5}),
            memory=memory,
            return_source_documents=True,
            verbose=True
        )
        
        logger.info("Conversational retrieval chain initialized successfully")
    except Exception as e:
        logger.error(f"Failed to initialize chain: {str(e)}")

@app.route('/api/chat', methods=['POST'])
def chat():
    """Endpoint to handle chat queries."""
    try:
        # Get data from request
        data = request.get_json()
        
        if not data or 'messages' not in data:
            return jsonify({'error': 'Invalid request format'}), 400
        
        # Check and update PDF indexing first
        threading.Thread(target=check_and_process_pdfs).start()
        
        # Wait for chain to be initialized
        wait_count = 0
        while chain is None and wait_count < 10:
            if wait_count == 0:
                logger.info("Waiting for chain to initialize...")
            time.sleep(1)
            wait_count += 1
        
        if chain is None:
            return jsonify({'error': 'System is still initializing, please try again shortly'}), 503
        
        # Format chat history for LangChain from the messages
        chat_history = []
        query = ""
        
        # Find the last user message for the query
        for msg in reversed(data['messages']):
            if msg['role'] == 'user':
                query = msg['content']
                break
        
        # Get previous messages for chat history
        # Skip the last user message as it's our current query
        messages = data['messages'][:-1] if data['messages'][-1]['role'] == 'user' else data['messages']
        
        # Format into pairs of (human, ai) for LangChain chat history
        for i in range(0, len(messages) - 1, 2):
            if i+1 < len(messages) and messages[i]['role'] == 'user' and messages[i+1]['role'] == 'assistant':
                chat_history.append((messages[i]['content'], messages[i+1]['content']))
        
        if not query:
            return jsonify({'error': 'No user query found'}), 400
        
        # Get response from chain
        response = chain({"question": query, "chat_history": chat_history})
        
        # Format sources for response if available
        sources = []
        if 'source_documents' in response:
            source_paths = set()
            for doc in response['source_documents']:
                if hasattr(doc, 'metadata') and 'source' in doc.metadata:
                    source_path = doc.metadata['source']
                    if source_path not in source_paths:
                        source_paths.add(source_path)
                        sources.append(os.path.basename(source_path))
        
        # Prepare response
        result = {
            'message': response['answer'],
            'sources': sources
        }
        
        return jsonify(result)
        
    except Exception as e:
        logger.error(f"Error in chat endpoint: {str(e)}")
        return jsonify({'error': f'Internal server error: {str(e)}'}), 500

@app.route('/api/scan', methods=['POST'])
def manual_scan():
    """Endpoint to manually trigger a PDF scan."""
    try:
        threading.Thread(target=check_and_process_pdfs).start()
        return jsonify({'message': 'Scan initiated'})
    except Exception as e:
        return jsonify({'error': f'Error initiating scan: {str(e)}'}), 500

@app.route('/api/status', methods=['GET'])
def status():
    """Endpoint to check system status."""
    global vectorstore, file_hashes
    
    status_info = {
        'vectorstore_initialized': vectorstore is not None,
        'chain_initialized': chain is not None,
        'indexed_pdfs': len(file_hashes),
        'last_scan_time': last_scan_time
    }
    
    return jsonify(status_info)

def start_background_tasks():
    """Start background tasks."""
    # Load existing file hashes
    load_hashes()
    # Initial scan for PDFs
    check_and_process_pdfs()
    
    # Start periodic scanning
    def periodic_scan():
        while True:
            time.sleep(SCAN_INTERVAL)
            check_and_process_pdfs()
    
    scanning_thread = threading.Thread(target=periodic_scan, daemon=True)
    scanning_thread.start()

if __name__ == '__main__':
    # Start background tasks
    start_background_tasks()
    
    # Run the Flask app
    port = int(os.getenv("PORT", 5000))
    app.run(host='0.0.0.0', port=port, debug=False)