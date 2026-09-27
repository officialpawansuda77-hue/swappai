import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [
      react(),
      {
        name: 'api-server-middleware',
        configureServer(server) {
          server.middlewares.use(async (req, res, next) => {
            const url = req.url?.split('?')[0];

            // 1. Health check & verification test endpoint
            if (url === '/api/test-gemini') {
              const apiKey = process.env.GEMINI_API_KEY || env.GEMINI_API_KEY;
              if (!apiKey) {
                res.statusCode = 400;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({
                  ok: false,
                  error: 'GEMINI_API_KEY is not configured in .env',
                }));
                return;
              }

              try {
                const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent?key=${apiKey}`;
                const testRes = await fetch(geminiUrl, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    contents: [{ parts: [{ text: 'Respond with exactly: GEMINI_READY' }] }],
                    generationConfig: { maxOutputTokens: 20 },
                  }),
                });

                if (!testRes.ok) {
                  const errText = await testRes.text();
                  res.statusCode = testRes.status;
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify({ ok: false, error: errText }));
                  return;
                }

                const data = await testRes.json();
                const reply = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ ok: true, model: 'gemini-3.5-flash-lite', reply }));
              } catch (err: any) {
                res.statusCode = 500;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ ok: false, error: err.message }));
              }
              return;
            }

            // 2. Deconstruct slide endpoint
            if (url === '/api/deconstruct-slide' && req.method === 'POST') {
              const apiKey = process.env.GEMINI_API_KEY || env.GEMINI_API_KEY;
              if (!apiKey) {
                res.statusCode = 500;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({
                  error: 'GEMINI_API_KEY is missing from server environment (.env).',
                }));
                return;
              }

              let chunks: Buffer[] = [];
              req.on('data', chunk => chunks.push(chunk));
              req.on('end', async () => {
                try {
                  const rawBody = Buffer.concat(chunks).toString();
                  const body = JSON.parse(rawBody);
                  const { imageBase64, mimeType = 'image/png' } = body || {};

                  if (!imageBase64) {
                    res.statusCode = 400;
                    res.setHeader('Content-Type', 'application/json');
                    res.end(JSON.stringify({ error: 'Missing imageBase64 in request.' }));
                    return;
                  }

                  const cleanBase64 = imageBase64.replace(/^data:image\/[a-zA-Z]+;base64,/, '');
                  const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent?key=${apiKey}`;

                  const SYSTEM_PROMPT = `You are an expert graphic designer and document layout reverse-engineering AI.
Your task is to analyze an uploaded carousel slide image (designed for an Instagram/LinkedIn 4:5 canvas at 1080x1350 pixels) and deconstruct it into clean, distinct, editable visual layers.

Output a strictly valid JSON object conforming to the following structure:
{
  "canvas": {
    "width": 1080,
    "height": 1350
  },
  "background": {
    "type": "solid",
    "value": "#111111",
    "isDark": true
  },
  "elements": [
    {
      "id": "el_1",
      "type": "text",
      "role": "headline",
      "x": 60,
      "y": 120,
      "width": 960,
      "height": 180,
      "zIndex": 2,
      "properties": {
        "text": "Exact text content",
        "fontFamily": "Inter",
        "fontSize": 64,
        "fontWeight": 700,
        "color": "#FFFFFF",
        "alignment": "left",
        "textCase": "none",
        "letterSpacing": 0,
        "lineHeight": 1.2
      }
    }
  ]
}

CRITICAL RULES:
1. Extract ALL visible text blocks separately with exact wording.
2. For container cards, badges, or divider lines, emit them as type "shape" with shapeType ("rectangle" | "circle" | "line"), fill, and borderRadius.
3. Coordinates must strictly map to a 1080 (width) x 1350 (height) canvas.
4. Colors must be precise 6-character hex codes (e.g. "#FF5A00", "#1E1E1E").
5. Only return the JSON object, with no markdown code blocks or surrounding commentary.`;

                  const geminiRes = await fetch(geminiUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      contents: [
                        {
                          parts: [
                            { text: SYSTEM_PROMPT },
                            {
                              inline_data: {
                                mime_type: mimeType,
                                data: cleanBase64,
                              },
                            },
                          ],
                        },
                      ],
                      generationConfig: {
                        response_mime_type: 'application/json',
                        temperature: 0.1,
                      },
                    }),
                  });

                  if (!geminiRes.ok) {
                    const errText = await geminiRes.text();
                    res.statusCode = geminiRes.status;
                    res.setHeader('Content-Type', 'application/json');
                    res.end(JSON.stringify({ error: `Gemini API error (${geminiRes.status}): ${errText}` }));
                    return;
                  }

                  const data = await geminiRes.json();
                  const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
                  const parsed = JSON.parse(rawText.trim());

                  res.statusCode = 200;
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify(parsed));
                } catch (err: any) {
                  res.statusCode = 500;
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify({ error: err.message || 'Processing failed' }));
                }
              });
              return;
            }

            next();
          });
        },
      },
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      port: 5173,
    },
  };
});
