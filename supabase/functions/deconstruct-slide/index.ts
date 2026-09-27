// Supabase Edge Function: deconstruct-slide
// Deconstructs a flattened carousel slide image into genuine editable Fabric.js layers using Gemini 2.5 Flash.

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const SYSTEM_PROMPT = `You are an expert graphic designer and document layout reverse-engineering AI.
Your task is to analyze an uploaded carousel slide image (designed for an Instagram/LinkedIn 4:5 canvas at 1080x1350 pixels) and deconstruct it into clean, distinct, editable visual layers.

Output a strictly valid JSON object conforming to the following structure:

{
  "canvas": {
    "width": 1080,
    "height": 1350
  },
  "background": {
    "type": "solid" | "gradient" | "image",
    "value": "#111111", // Hex color if solid, or CSS gradient if gradient, or dominant background color
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
        "fontFamily": "Inter", // Choose best fit: "Inter", "Plus Jakarta Sans", "Playfair Display", "Outfit", "Bebas Neue", "Roboto", "Poppins"
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
        "borderRadius": 16, // optional, use for rounded cards (12-24) or pill badges (20-40)

        // FOR IMAGES/CUTOUTS (photos, author avatars, mockups, logos):
        "src": "", // placeholder, client can overlay or crop
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

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const apiKey = Deno.env.get('GEMINI_API_KEY');
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: 'GEMINI_API_KEY is not configured in backend environment.' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { imageBase64, mimeType = 'image/png' } = await req.json();
    if (!imageBase64) {
      return new Response(
        JSON.stringify({ error: 'Missing imageBase64 in request body.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Strip data URL prefix if present
    const cleanBase64 = imageBase64.replace(/^data:image\/[a-zA-Z]+;base64,/, '');

    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent?key=${apiKey}`;

    const geminiResponse = await fetch(geminiUrl, {
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

    if (!geminiResponse.ok) {
      const errText = await geminiResponse.text();
      return new Response(
        JSON.stringify({ error: `Gemini API error (${geminiResponse.status}): ${errText}` }),
        { status: geminiResponse.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const geminiData = await geminiResponse.json();
    const rawText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!rawText) {
      return new Response(
        JSON.stringify({ error: 'No content received from Gemini Vision model.' }),
        { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Parse JSON
    const parsed = JSON.parse(rawText.trim());

    return new Response(JSON.stringify(parsed), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: (err as Error).message || 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
