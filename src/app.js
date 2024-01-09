const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const mongoose = require('mongoose');
const multer = require('multer');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const PORT = 3000;

// Replace 'your_mongodb_connection_string' with your actual MongoDB connection string
const MONGO_URI = 'mongodb://localhost:27017/backend/Ips';

// Connect to MongoDB
mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true})
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err.message));

// Use cors middleware to allow cross-origin requests (for frontend communication)
app.use(cors());

// Use express.json() middleware to parse incoming JSON data
app.use(express.json());

// Set up multer for handling file uploads (pictures)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Start the server
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

// Define MongoDB Schema for users
const userSchema = new mongoose.Schema({
  age: { type: Number, required: true, min: 18 },
  gender: { type: String, enum: ['male', 'female'], required: true },
  partnerPreferredGender: { type: String, enum: ['male', 'female', 'both'], required: true },
  socketId: String, // To keep track of user's active socket connection
});

const User = mongoose.model('User', userSchema);

// Serve static files from the "public" directory
app.use(express.static('public'));

// Define a route for the root URL ("/") to serve your index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});


// API endpoint for user registration
app.post('/api/register', async (req, res) => {
  // ... (existing code)
});

// Socket.IO connection handling
io.on('connection', (socket) => {
  // ... (existing code)
});

// Function to find suitable chat partners based on preferences
const findChatPartner = async (user) => {
  // ... (existing code)
};

app.post('/api/sendPicture', upload.single('picture'), async (req, res) => {
  // ... (existing code)
});
