function requireKey() {
  const key = String(process.env.OPENROUTER_API_KEY || '').trim();
  const looksLikePlaceholder = /^(your_openrouter_key_here|replace_me|changeme)$/i.test(key);
  if (!key || looksLikePlaceholder) {
    throw new Error(
      'Missing valid OPENROUTER_API_KEY in .env. Set OPENROUTER_API_KEY to your real OpenRouter key.'
    );
  }
  return key;
}

async function openRouterChat({
  model = 'openai/gpt-4o-mini',
  messages,
  temperature = 0.7,
  max_tokens,
}) {
  const apiKey = requireKey();

  const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      // Recommended by OpenRouter for attribution / analytics
      'HTTP-Referer': process.env.OPENROUTER_SITE_URL || 'http://localhost:3000',
      'X-Title': process.env.OPENROUTER_APP_NAME || 'AI Study Assistant',
    },
    body: JSON.stringify({
      model,
      messages,
      temperature,
      ...(max_tokens ? { max_tokens } : {}),
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`OpenRouter error ${res.status}: ${text}`);
  }

  const data = await res.json();
  const content = data?.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error('OpenRouter returned no content.');
  }
  return String(content).trim();
}

module.exports = { openRouterChat };













