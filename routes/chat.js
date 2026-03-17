const express = require('express');
const router = express.Router();
const { openRouterChat } = require('../openrouter');

router.post('/', async (req, res) => {
    try {
        const { message } = req.body;

        if (!message) {
            return res.status(400).json({ error: 'Message is required.' });
        }

        const reply = await openRouterChat({
            model: process.env.OPENROUTER_MODEL_EXPLAIN || 'openai/gpt-4o-mini',
            messages: [
                {
                    role: 'system',
                    content:
                        'You are an AI Study Assistant chatbot. You help students learn by explaining topics clearly, providing examples, creating summaries, and answering questions. Be friendly, concise, and use markdown formatting where helpful (bold, bullet points, code blocks). If the student asks for a quiz, generate a short quiz with answers.',
                },
                { role: 'user', content: message },
            ],
            temperature: 0.7,
        });

        res.json({ reply });
    } catch (error) {
        console.error('Chat error:', error);
        const message = error?.message || 'Failed to generate response.';
        const status = message.includes('OPENROUTER_API_KEY') ? 400 : 500;
        res.status(status).json({ error: message });
    }
});

module.exports = router;
