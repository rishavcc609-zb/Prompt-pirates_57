import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const isProduction = process.env.NODE_ENV === 'production';

app.use(express.json({ limit: '10mb' }));

// Initialize Gemini Client
const ai = new GoogleGenAI();

// Endpoint for Gemini Multi-Turn Chat
app.post('/api/chat', async (req, res) => {
  try {
    const {
      messages,
      model = 'gemini-3.5-flash',
      systemInstruction = 'You are PathFinder Senior Career Architect & Engineering Mentor. Provide tactical, reverse-engineered guidance for career milestones, technical skill gaps, and system design interviews.',
    } = req.body;

    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'Messages array is required.' });
    }

    // Format messages for @google/genai format
    const contents = messages.map((m: any) => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.text || m.content || '' }],
    }));

    // Selected model fallback if paid model rate-limited
    let targetModel = model;
    let fallbackNotice: string | null = null;

    try {
      const response = await ai.models.generateContent({
        model: targetModel,
        config: {
          systemInstruction,
        },
        contents,
      });

      return res.json({
        reply: response.text || '',
        modelUsed: targetModel,
        fallbackNotice,
      });
    } catch (modelError: any) {
      // If requested model (e.g. gemini-3.1-pro-preview) failed due to quota/paid key, fallback to gemini-3.5-flash
      if (targetModel !== 'gemini-3.5-flash') {
        console.warn(`Model ${targetModel} encountered error, falling back to gemini-3.5-flash:`, modelError?.message);
        targetModel = 'gemini-3.5-flash';
        fallbackNotice = `Switched to ${targetModel} because ${model} requires a paid billing quota.`;

        const fallbackResponse = await ai.models.generateContent({
          model: targetModel,
          config: {
            systemInstruction,
          },
          contents,
        });

        return res.json({
          reply: fallbackResponse.text || '',
          modelUsed: targetModel,
          fallbackNotice,
        });
      }
      throw modelError;
    }
  } catch (error: any) {
    console.error('Chat API Error:', error);
    return res.status(500).json({
      error: error?.message || 'Failed to generate response with Gemini API.',
    });
  }
});

// Endpoint for quick roadmap generation via Gemini
app.post('/api/roadmap/generate', async (req, res) => {
  try {
    const { jobTitle, industry, timelineMonths = 12, currentSkills = [], weeklyHours = 15 } = req.body;

    const prompt = `You are the PathFinder Reverse-Engineering Career Engine.
Generate a structured JSON reverse-engineered career roadmap for the dream role: "${jobTitle}" in the "${industry || 'Tech'}" sector.
Timeline: ${timelineMonths} months, Weekly study commitment: ${weeklyHours} hours.
Current user skills: ${currentSkills.join(', ') || 'Foundational programming'}.

Output pure valid JSON adhering strictly to:
{
  "title": "${jobTitle}",
  "industry": "${industry || 'Advanced Engineering'}",
  "summary": "Brief 2-sentence executive summary",
  "salaryRange": "$180k - $275k / yr",
  "marketDemand": "High-Growth",
  "requiredDegreeOrEquivalent": "B.S. in CS / EE or equivalent proof of work",
  "keyResponsibilities": ["Design systems", "Optimize latency", "Deploy pipelines"]
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json({ success: true, roadmap: parsed });
  } catch (err: any) {
    console.warn('Roadmap AI generate error:', err);
    return res.status(500).json({ error: err?.message || 'Failed to generate roadmap' });
  }
});

// Setup Vite middleware in dev or static serving in production
async function startServer() {
  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    if (fs.existsSync(distPath)) {
      app.use(express.static(distPath));
      app.get('*', (_req, res) => {
        res.sendFile(path.resolve(distPath, 'index.html'));
      });
    }
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`PathFinder Full-Stack Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
