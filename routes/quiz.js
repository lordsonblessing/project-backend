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
Create 5 multiple-choice quiz questions (MCQs) for the following topic:

Topic: "${topic}"

Return JSON ONLY with the following structure (no additional commentary):
[
  {
    "question": "string",
    "options": ["A", "B", "C", "D"],
    "answer": "exact option text",
    "explanation": "short explanation"
  }
]
`;

    const raw = await openRouterChat({
      model: process.env.OPENROUTER_MODEL_QUIZ || 'openai/gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are a quiz generator for students. Always respond with valid JSON.',
        },
        { role: 'user', content: prompt },
      ],
      temperature: 0.7,
    });

    let quiz;
    try {
      quiz = JSON.parse(raw);
    } catch (e) {
      // Attempt to recover JSON by trimming code fences
      const cleaned = raw
        .replace(/```json/gi, '')
        .replace(/```/g, '')
        .trim();
      quiz = JSON.parse(cleaned);
    }

    res.json({ quiz });
  } catch (error) {
    console.error('Quiz error:', error);
    const message = error?.message || 'Failed to generate quiz.';
    const status = message.includes('OPENROUTER_API_KEY') ? 400 : 500;
    res.status(status).json({ error: message });
  }
});

module.exports = router;

