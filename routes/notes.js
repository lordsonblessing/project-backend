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
Create concise, point-wise study notes for the topic below.

Topic: "${topic}"

Return:
- Bullet-style notes
- Organize into small sections if needed
`;

    const notes = await openRouterChat({
      model: process.env.OPENROUTER_MODEL_NOTES || 'openai/gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You create structured, bullet-style notes for students.' },
        { role: 'user', content: prompt },
      ],
      temperature: 0.65,
    });
    res.json({ notes });
  } catch (error) {
    console.error('Notes error:', error);
    const message = error?.message || 'Failed to generate notes.';
    const status = message.includes('OPENROUTER_API_KEY') ? 400 : 500;
    res.status(status).json({ error: message });
  }
});

module.exports = router;

