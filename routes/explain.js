const express = require('express');
const router = express.Router();
const { openRouterChat } = require('../openrouter');

router.post('/', async (req, res) => {
  try {
    const { topic } = req.body;

    if (!topic) {
      return res.status(400).json({ error: 'Topic is required.' });
    }

    const prompt = `
You are an AI Study Assistant. Explain the following topic clearly and in a structured way for a student who is learning it for the first time.

Topic: "${topic}"

Provide:
- A clear, intuitive explanation
- Key concepts
- Simple real-world analogies if relevant
`;

    const explanation = await openRouterChat({
      model: process.env.OPENROUTER_MODEL_EXPLAIN || 'openai/gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You are a friendly, concise AI study tutor.' },
        { role: 'user', content: prompt },
      ],
      temperature: 0.7,
    });
    res.json({ explanation });
  } catch (error) {
    console.error('Explain error:', error);
    const message = error?.message || 'Failed to generate explanation.';
    const status = message.includes('OPENROUTER_API_KEY') ? 400 : 500;
    res.status(status).json({ error: message });
  }
});

module.exports = router;

