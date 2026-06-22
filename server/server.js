const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Connect DB
const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI;
    if (!uri) {
      throw new Error("MONGO_URI is not defined in the environment variables");
    }
    
    await mongoose.connect(uri);
    console.log('MongoDB Atlas Connected');
  } catch (err) {
    console.error('MongoDB Connection Error: ', err.message);
    process.exit(1); // Exit process with failure for production readiness
  }
};

connectDB();

// Routes
app.use('/auth', require('./routes/auth'));
app.use('/habits', require('./routes/habits'));
app.use('/entries', require('./routes/entries'));
app.use('/stats', require('./routes/stats'));

// Serve frontend in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/dist')));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client/dist', 'index.html'));
  });
} else {
  app.get('/', (req, res) => {
    res.send('API is running...');
  });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
