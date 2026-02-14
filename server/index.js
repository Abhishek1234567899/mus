
import express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
app.use(bodyParser.json());

const PORT = 4000;
const GEMINI_KEY = process.env.GEMINI_API_KEY || process.env.API_KEY;

if (!GEMINI_KEY) {
  console.error('ERROR: GEMINI_API_KEY is not set in .env');
  process.exit(1);
}

const ai = new GoogleGenAI({ apiKey: GEMINI_KEY });

app.post('/api/generate', async (req, res) => {
  const { prompt } = req.body;
  if (!prompt) return res.status(400).json({ error: 'Missing prompt' });

  console.log('Received generation request...');

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: [{ role: 'user', parts: [{ text: prompt }] }]
    });

    const text = response.text;
    console.log('Successfully generated text');
    res.json({ text });
  } catch (err) {
    console.error('Gemini API Error:', err);
    res.status(500).json({ error: err.message || 'Internal Server Error' });
  }
});

app.listen(PORT, () => {
  console.log(`Backend server running at http://localhost:${PORT}`);
});
