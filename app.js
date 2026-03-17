const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const explainRoute = require('./routes/explain');
const summaryRoute = require('./routes/summary');
const quizRoute = require('./routes/quiz');
const notesRoute = require('./routes/notes');
const chatRoute = require('./routes/chat');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());


// API routes
app.use('/api/explain', explainRoute);
app.use('/api/summary', summaryRoute);
app.use('/api/quiz', quizRoute);
app.use('/api/notes', notesRoute);
app.use('/api/chat', chatRoute);

// Config endpoint - serves Supabase configuration from environment variables
app.get('/api/config', (req, res) => {
  res.json({
    supabaseUrl: process.env.SUPABASE_URL || '',
    supabaseAnonKey: process.env.SUPABASE_ANON_KEY || '',
  });
});

app.listen(PORT, () => {
  console.log(`AI Study Assistant server running on http://localhost:${PORT}`);
});
