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
Summarize the following study topic in a concise, student-friendly way.

Topic: "${topic}"

Return:
- 3–6 bullet points
- Focus on the most important ideas only
`;

    const summary = await openRouterChat({
      model: process.env.OPENROUTER_MODEL_SUMMARY || 'openai/gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You create short, concise summaries for students.' },
        { role: 'user', content: prompt },
      ],
      temperature: 0.6,
    });

    res.json({ summary });
  } catch (error) {
    console.error('Summary error:', error);
    const message = error?.message || 'Failed to generate summary.';
    const status = message.includes('OPENROUTER_API_KEY') ? 400 : 500;
    res.status(status).json({ error: message });
  }
});

module.exports = router;
