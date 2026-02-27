module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.statusCode = 405
    res.setHeader('Allow', 'POST')
    res.end('Method Not Allowed')
    return
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    res.statusCode = 500
    res.end('Missing ANTHROPIC_API_KEY')
    return
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body
    const prompt = body?.prompt

    if (!prompt) {
      res.statusCode = 400
      res.end('Missing prompt')
      return
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-latest',
        max_tokens: 32,
        temperature: 0.2,
        messages: [{ role: 'user', content: prompt }],
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      res.statusCode = response.status
      res.end(errorText)
      return
    }

    const data = await response.json()
    const text = data?.content?.[0]?.text ?? ''

    res.setHeader('content-type', 'application/json')
    res.end(JSON.stringify({ text }))
  } catch (error) {
    res.statusCode = 500
    res.end('Generation failed')
  }
}
