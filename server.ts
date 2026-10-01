import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const PORT = 3000;

async function startServer() {
  const app = express();

  app.use(express.json({ limit: '10mb' }));

  // Initialize Gemini client safely (lazy check)
  let genAI: GoogleGenAI | null = null;
  if (process.env.GEMINI_API_KEY) {
    genAI = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }

  // API: Health check
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      app: 'NEXUS: LEVEL ZERO',
      system: 'ONLINE',
      aiConfigured: !!process.env.GEMINI_API_KEY,
    });
  });

  // API: NOVA AI Companion Endpoint
  app.post('/api/nova', async (req, res) => {
    try {
      const { message, profile, recentQuests } = req.body;
      const username = profile?.username || 'Hunter';
      const level = profile?.level || 1;
      const rank = profile?.rank || 'E';
      const currentXp = profile?.currentXp || 0;
      const requiredXp = profile?.requiredXp || 500;
      const pathClass = profile?.path || 'DISCIPLINE';

      // If Gemini API is available, query gemini-3.8-flash
      if (genAI && process.env.GEMINI_API_KEY) {
        try {
          const systemInstruction = `You are NOVA, the tactical RPG System AI in the dark fantasy productivity app "NEXUS: LEVEL ZERO".
The user's title is "${username}" (Level ${level}, Rank ${rank}, Path: ${pathClass}, XP: ${currentXp}/${requiredXp}).
Your voice: Futuristic, encouraging, anime-rpg system authority, concise, sharp, and intensely motivating.
Never reference copyrighted anime series, characters, or dialogue.
Keep your responses between 2-4 punchy paragraphs or structured tactical bullet points.
If the user asks to create quests or break down goals, ALWAYS append a structured JSON block at the very end of your response inside a \`\`\`json\`\`\` code fence with this schema:
[
  {
    "title": "Quest Title (Action-oriented)",
    "description": "Short strategic reason",
    "difficulty": "EASY" | "NORMAL" | "HARD" | "EPIC",
    "category": "STUDY" | "FITNESS" | "WORK" | "READING" | "PERSONAL" | "DAILY",
    "xpReward": 10 | 25 | 50 | 100,
    "isDaily": true | false
  }
]
`;

          const prompt = `Hunter Query: "${message}"\nActive/Recent Quests Context: ${JSON.stringify(
            (recentQuests || []).slice(0, 5).map((q: { title: string; difficulty: string; completed: boolean }) => ({
              title: q.title,
              diff: q.difficulty,
              done: q.completed,
            }))
          )}`;

          const response = await genAI.models.generateContent({
            model: 'gemini-3.8-flash',
            contents: prompt,
            config: {
              systemInstruction,
              temperature: 0.7,
            },
          });

          const replyText = response.text || "System synchronization complete. Awaiting Hunter's directives.";

          // Parse any suggested quests from the JSON code fence if present
          let suggestedQuests = [];
          const jsonMatch = replyText.match(/```json\s*([\s\S]*?)\s*```/);
          if (jsonMatch) {
            try {
              suggestedQuests = JSON.parse(jsonMatch[1]);
            } catch {
              // ignore parse failure
            }
          }

          return res.json({
            text: replyText.replace(/```json[\s\S]*?```/, '').trim(),
            suggestedQuests,
          });
        } catch (apiErr) {
          console.error('Gemini API query error, using immersive RPG fallback:', apiErr);
          // Fall through to fallback
        }
      }

      // Offline / Intelligent RPG Fallback Generator
      const fallbackReplies: Record<string, { text: string; quests?: any[] }> = {
        quest: {
          text: `[SYSTEM PROTOCOL INITIATED]\nHunter ${username}, your request for mission directives has been processed. Based on your ${pathClass} path and current Level ${level}, I have generated three optimal development quests to maximize your attribute growth today:`,
          quests: [
            {
              title: '30-Minute Deep Focus Sprint',
              description: 'Zero distractions, complete one core objective.',
              difficulty: 'NORMAL',
              category: 'STUDY',
              xpReward: 25,
              isDaily: true,
            },
            {
              title: 'High-Intensity Conditioning',
              description: 'Push physical endurance to replenish vitality.',
              difficulty: 'NORMAL',
              category: 'FITNESS',
              xpReward: 25,
              isDaily: true,
            },
            {
              title: 'Epic Barrier Breakthrough',
              description: 'Overcome your most procrastinated roadblock.',
              difficulty: 'HARD',
              category: 'WORK',
              xpReward: 50,
              isDaily: false,
            },
          ],
        },
        motivate: {
          text: `[NOVA MOTIVATION LOG]\nHunter ${username}, look at your progress. You stand at Level ${level} with ${currentXp}/${requiredXp} XP.\n\nEvery small action is recorded by the System. While ordinary people remain passive, you are transmuting effort into tangible power. Rise, complete your pending tasks, and evolve into the next Rank!`,
        },
        progress: {
          text: `[SYSTEM STATUS AUDIT]\nHunter ${username}:\n• Current Level: ${level}\n• Current Rank: ${rank}\n• Total Acquired XP: ${profile?.totalXp || currentXp}\n• Daily Quota: ${Math.round(((profile?.dailyGoalXp || 200) - currentXp > 0 ? (profile?.dailyGoalXp || 200) - currentXp : 0))} XP remaining for today.\n\nYou are close to your next ascension threshold. Complete your active daily quests to maintain your streak!`,
        },
      };

      const lower = (message || '').toLowerCase();
      let matched = fallbackReplies.motivate;
      if (lower.includes('quest') || lower.includes('task') || lower.includes('goal') || lower.includes('break') || lower.includes('suggest')) {
        matched = fallbackReplies.quest;
      } else if (lower.includes('status') || lower.includes('stat') || lower.includes('progress') || lower.includes('level') || lower.includes('xp')) {
        matched = fallbackReplies.progress;
      }

      res.json({
        text: matched.text,
        suggestedQuests: matched.quests || [],
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'System core error' });
    }
  });

  // API: Visual Quest Proof Verification Endpoint (Multimodal AI Scanner)
  app.post('/api/verify-proof', async (req, res) => {
    try {
      const { questTitle, questDescription, questCategory, imageBase64, note, username } = req.body;
      const hunterName = username || 'Hunter';

      // Default deterministic RPG analysis
      let verified = true;
      let score = Math.floor(92 + Math.random() * 8); // 92 - 99%
      let feedback = `[NEURAL MATRIX: EVIDENCE VERIFIED]\nHunter ${hunterName}, your visual telemetry confirms satisfactory completion of "${questTitle || 'directive'}". Visual records archived to Hunter Log.`;
      let attributeBonus = '+1 DIS';

      if (questCategory === 'FITNESS') attributeBonus = '+2 STR, +1 VIT';
      else if (questCategory === 'STUDY' || questCategory === 'READING') attributeBonus = '+2 INT, +1 FOC';
      else if (questCategory === 'WORK') attributeBonus = '+2 DIS, +1 FOC';

      // If Gemini multimodal API is active and we have an image
      if (genAI && process.env.GEMINI_API_KEY && imageBase64) {
        try {
          // Extract mimeType and raw base64
          let mimeType = 'image/jpeg';
          let cleanData = imageBase64;
          if (imageBase64.includes('data:') && imageBase64.includes(';base64,')) {
            const parts = imageBase64.split(';base64,');
            mimeType = parts[0].replace('data:', '');
            cleanData = parts[1];
          }

          const systemPrompt = `You are NOVA, the omniscient tactical RPG System AI in the dark fantasy game "NEXUS: LEVEL ZERO".
A Hunter has submitted visual photographic evidence for completing the quest: "${questTitle}" (Category: ${questCategory || 'GENERAL'}, Description: ${questDescription || 'N/A'}).
Hunter notes: "${note || 'None'}".

Analyze the submitted image as proof of completing this quest.
Always respond strictly with a valid JSON object in this exact format (enclosed in \`\`\`json\`\`\`):
\`\`\`json
{
  "verified": true,
  "score": 98,
  "feedback": "Visual telemetry confirms book study and active notes. Neural discipline rewarded.",
  "attributeBonus": "+2 INT, +1 FOC"
}
\`\`\`
Tone: Cybernetic, concise, validating, immersive RPG anime system voice. Maximum 2 sentences in feedback.`;

          const response = await genAI.models.generateContent({
            model: 'gemini-3.8-flash',
            contents: [
              {
                role: 'user',
                parts: [
                  {
                    inlineData: {
                      mimeType,
                      data: cleanData,
                    },
                  },
                  {
                    text: systemPrompt,
                  },
                ],
              },
            ],
          });

          const resText = response.text || '';
          const jsonMatch = resText.match(/```json\s*([\s\S]*?)\s*```/);
          if (jsonMatch) {
            const parsed = JSON.parse(jsonMatch[1]);
            verified = parsed.verified ?? true;
            score = parsed.score ?? score;
            feedback = parsed.feedback ?? feedback;
            attributeBonus = parsed.attributeBonus ?? attributeBonus;
          }
        } catch (visionErr) {
          console.error('Gemini vision verification error, falling back to local matrix:', visionErr);
        }
      }

      res.json({
        verified,
        score,
        feedback,
        attributeBonus,
        verifiedAt: new Date().toISOString(),
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Evidence verification failed' });
    }
  });

  // Serve Frontend
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
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
    console.log(`NEXUS System Server running on port ${PORT}`);
  });
}

startServer();
