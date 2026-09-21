import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  // JSON Body parsing with 10mb limit for documents
  app.use(express.json({ limit: '10mb' }));

  // API Route: Health Check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
  });

  // API Route: Resume Extraction with Gemini & Heuristic Fallback
  app.post('/api/extract-resume', async (req, res) => {
    try {
      const { resumeText, fileData, mimeType } = req.body;

      if (!resumeText && !fileData) {
        return res.status(400).json({ error: 'No resume text or file data provided.' });
      }

      const apiKey = process.env.GEMINI_API_KEY;

      if (apiKey) {
        try {
          const ai = new GoogleGenAI({
            apiKey,
            httpOptions: {
              headers: {
                'User-Agent': 'aistudio-build',
              },
            },
          });

          const prompt = `You are an expert HR and Career Success AI for the Staffing Bees platform.
Extract comprehensive, verified candidate profile data from the provided resume.
Analyze the candidate's work history, skills, contact info, and education.
Infer realistic, high-market-value career targets for their next job title, industry sector, and compensation benchmarks based on their background.
Return strictly valid JSON conforming to the requested schema.`;

          const contents: any[] = [];

          if (fileData && mimeType && mimeType.startsWith('application/pdf')) {
            contents.push({
              inlineData: {
                data: fileData,
                mimeType,
              },
            });
          }

          contents.push({
            text: `${prompt}\n\nResume content:\n${resumeText || 'See attached document above'}`,
          });

          const response = await ai.models.generateContent({
            model: 'gemini-3.8-flash',
            contents,
            config: {
              responseMimeType: 'application/json',
              responseSchema: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING, description: 'Full name of the candidate' },
                  email: { type: Type.STRING, description: 'Email address' },
                  phone: { type: Type.STRING, description: 'Phone number' },
                  location: { type: Type.STRING, description: 'City and State or Country' },
                  headline: { type: Type.STRING, description: 'Professional headline or current title' },
                  currentRole: { type: Type.STRING, description: 'Most recent or current job title' },
                  targetRole: { type: Type.STRING, description: 'Target next-level job title' },
                  targetIndustry: { type: Type.STRING, description: 'Target industry sector' },
                  experienceYears: { type: Type.STRING, description: 'Total years of experience e.g. 4.5 Years' },
                  targetSalary: { type: Type.STRING, description: 'Realistic target compensation range e.g. $105,000 - $125,000 / year' },
                  bio: { type: Type.STRING, description: 'Executive summary (2-3 sentences)' },
                  skills: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: 'Extracted technical and professional skills',
                  },
                  experienceHistory: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        id: { type: Type.STRING },
                        title: { type: Type.STRING },
                        company: { type: Type.STRING },
                        period: { type: Type.STRING },
                        location: { type: Type.STRING },
                        description: { type: Type.STRING },
                      },
                      required: ['title', 'company', 'period', 'description'],
                    },
                  },
                  education: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        degree: { type: Type.STRING },
                        institution: { type: Type.STRING },
                        year: { type: Type.STRING },
                      },
                    },
                  },
                  certifications: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                  cpiEstimate: {
                    type: Type.OBJECT,
                    properties: {
                      overallScore: { type: Type.NUMBER, description: 'Overall baseline CPI score between 70 and 95' },
                      marketFit: { type: Type.NUMBER },
                      intent: { type: Type.NUMBER },
                      communication: { type: Type.NUMBER },
                      problemSolving: { type: Type.NUMBER },
                      reliability: { type: Type.NUMBER },
                    },
                  },
                },
                required: ['name', 'email', 'skills', 'experienceHistory'],
              },
            },
          });

          if (response.text) {
            const parsed = JSON.parse(response.text.trim());
            return res.json({ success: true, data: parsed, source: 'gemini' });
          }
        } catch (geminiErr) {
          console.error('Gemini API call failed, falling back to heuristic parsing:', geminiErr);
        }
      }

      // Fallback response: if no key or error, tell client to use client-side heuristic
      return res.json({
        success: false,
        message: 'Proceed with client-side heuristic extraction',
      });
    } catch (error: any) {
      console.error('Server extraction error:', error);
      res.status(500).json({ error: error?.message || 'Failed to extract resume' });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
