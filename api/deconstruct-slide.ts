// Vercel Serverless Function: /api/deconstruct-slide
// Calls Google Gemini on the server. Never exposes GEMINI_API_KEY to client-side code.
// ADMIN-ONLY (used by the admin template importer). User-facing reconstruction
// goes through /api/carousel/analyze, which is credit-metered.

import { route, readJson, HttpError } from './_lib/http.js';
import { requireAdmin } from './_lib/auth.js';

const MAX_BASE64_CHARS = 14_000_000; // ~10 MB image

const SYSTEM_PROMPT = `You are an expert graphic designer and document layout reverse-engineering AI.
Your task is to analyze an uploaded carousel slide image (designed for an Instagram/LinkedIn 4:5 canvas at 1080x1350 pixels) and deconstruct it into clean, distinct, editable visual layers.

Output a strictly valid JSON object conforming to the following structure:

{
  "canvas": {
    "width": 1080,
    "height": 1350
  },
  "background": {
    "type": "solid", // "solid" | "gradient" | "image"
    "value": "#111111", // Hex color if solid, or CSS gradient string if gradient, or dominant background color
    "isDark": true
  },
  "elements": [
    // Array of elements ordered from back to front (lowest zIndex to highest zIndex)
    {
      "id": "el_1",
      "type": "text", // "text" | "shape" | "image"
      "role": "headline", // "headline" | "subtitle" | "body" | "badge" | "cta" | "tag" | "author" | "card" | "line" | "photo" | "logo"
      "x": 60, // pixel coordinate on 1080x1350 canvas (0 to 1080)
      "y": 120, // pixel coordinate on 1080x1350 canvas (0 to 1350)
      "width": 960,
      "height": 180,
      "zIndex": 2,
      "properties": {
        // FOR TEXT:
        "text": "Exact text content",
        "fontFamily": "Inter", // "Inter", "Plus Jakarta Sans", "Playfair Display", "Outfit", "Bebas Neue", "Roboto", "Poppins"
        "fontSize": 64, // Realistic pixel size for 1080x1350 canvas
        "fontWeight": 700, // 300, 400, 500, 600, 700, 800, 900
        "color": "#FFFFFF", // Hex color code
        "alignment": "left", // "left" | "center" | "right"
        "textCase": "none", // "none" | "uppercase" | "lowercase"
        "letterSpacing": 0,
        "lineHeight": 1.2,

        // FOR SHAPES (e.g. background cards, pill tags, divider lines, accent buttons):
        "shapeType": "rectangle", // "rectangle" | "circle" | "line"
        "fill": "#FF5A00", // Hex color or "transparent"
        "stroke": "#FFFFFF", // optional hex
        "strokeWidth": 2, // optional
        "borderRadius": 16, // optional

        // FOR IMAGES/CUTOUTS (photos, author avatars, mockups, logos):
        "src": "", // placeholder
        "alt": "Description of image element",
        "objectFit": "cover"
      }
    }
  ]
}

CRITICAL RULES:
1. Extract ALL visible text blocks separately. Do NOT combine headlines with subheadings or author tags.
2. If there are container cards, accent blocks, or pill badges behind text, emit the shape FIRST with a lower zIndex, then the text on top with a higher zIndex.
3. Coordinates must strictly map to a 1080 (width) x 1350 (height) canvas.
4. Colors must be precise 6-character hex codes (e.g. "#FF5A00", "#1E1E1E").
5. Only return the JSON object, with no markdown code blocks or surrounding commentary.`;

export default route(['POST'], async (req, res) => {
  await requireAdmin(req);

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new HttpError(500, 'server_misconfigured', 'AI is not configured.');

  const { imageBase64, mimeType = 'image/png' } = readJson<{ imageBase64?: string; mimeType?: string }>(req);
  if (!imageBase64 || typeof imageBase64 !== 'string') {
    throw new HttpError(400, 'invalid_image', 'Missing imageBase64 in request body.');
  }
  if (imageBase64.length > MAX_BASE64_CHARS) throw new HttpError(413, 'file_too_large', 'Image is too large.');
  if (!['image/png', 'image/jpeg', 'image/webp'].includes(mimeType)) {
    throw new HttpError(415, 'unsupported_format', 'Use PNG, JPG or WEBP.');
  }

  const cleanBase64 = imageBase64.replace(/^data:image\/[a-zA-Z]+;base64,/, '');
  const geminiUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent';

  const geminiResponse = await fetch(geminiUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-goog-api-key': apiKey },
    body: JSON.stringify({
      contents: [{ parts: [{ text: SYSTEM_PROMPT }, { inline_data: { mime_type: mimeType, data: cleanBase64 } }] }],
      generationConfig: { response_mime_type: 'application/json', temperature: 0.1 },
    }),
  });

  if (!geminiResponse.ok) {
    console.error('[deconstruct-slide] Gemini error', geminiResponse.status, await geminiResponse.text());
    throw new HttpError(geminiResponse.status === 429 ? 429 : 502, 'ai_failed', 'AI analysis failed. Please try again.');
  }

  const geminiData = await geminiResponse.json();
  const rawText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!rawText) throw new HttpError(502, 'ai_empty', 'No content received from the AI model.');

  try {
    res.status(200).json(JSON.parse(rawText.trim()));
  } catch {
    throw new HttpError(502, 'ai_invalid_json', 'AI returned an invalid response. Please retry.');
  }
});
