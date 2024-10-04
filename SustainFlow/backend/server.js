import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/mongoose.js'; // Import the connectDB function
import bodyParser from 'body-parser';
import cors from 'cors';
import agencyRoutes from './routes/index.js'; // Import your routes

dotenv.config(); // Load environment variables

const app = express();
const PORT = process.env.PORT || 8000;

// CORS configuration
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true, // Enable set of credentials
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Connect to MongoDB
connectDB(); // Call the function to connect to the database

// Define a root route
app.get('/', (req, res) => {
  res.send('Welcome to the API!');
});

// Routes
app.use('/api', agencyRoutes);

// Listen on the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
