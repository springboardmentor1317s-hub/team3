import { connectToDatabase } from '@/lib/mongodb';
import User from '@/models/User';
import Event from '@/models/Event';
import jwt from 'jsonwebtoken';

/* =========================================================
   FALLBACK RECOMMENDER (ALWAYS WORKS)
   ========================================================= */

function fallbackRecommendations(user, events) {
  return events.slice(0, 10).map(e => ({
    event: e,
    score: 50,
    reasons: ['Recommended for you']
  }));
}

/* =========================================================
   GEMINI AI SCORING (PLAIN NUMBERS ONLY)
   ========================================================= */

async function generateAIRecommendations(user, events) {
  const geminiKey = process.env.GEMINI_API_KEY;
  if (!geminiKey) return fallbackRecommendations(user, events);

  // ---- SMALL, SAFE PROMPT ----
  const prompt = `
You are an event similarity scorer.

Student interests:
${user.interests.join(', ')}

Student skills:
${user.skills?.join(', ') || 'None'}

Below is a list of events.
Give a similarity score from 0 to 100 for EACH event.
Return ONLY numbers separated by commas.
NO TEXT. NO JSON.

Events:
${events.map((e, i) => `
${i}. ${e.title}
${e.description?.slice(0, 200) || ''}
`).join('\n')}
`;

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${geminiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0,
            maxOutputTokens: 256
          }
        })
      }
    );

    if (!res.ok) {
      return fallbackRecommendations(user, events);
    }

    const data = await res.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      return fallbackRecommendations(user, events);
    }

    // ---- PARSE SCORES SAFELY ----
    const scores = text
      .split(',')
      .map(s => parseInt(s.trim(), 10))
      .map(n => (Number.isFinite(n) ? n : 0));

    // ---- MERGE EVENTS + SCORES ----
    const ranked = events.map((event, i) => ({
      event,
      score: scores[i] ?? 0,
      reasons: ['AI similarity match']
    }));

    return ranked
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);

  } catch {
    return fallbackRecommendations(user, events);
  }
}

/* =========================================================
   API ROUTE
   ========================================================= */

export async function POST(req) {
  try {
    await connectToDatabase();

    const token = req.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return Response.json({ success: false }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const user = await User.findById(decoded.id);

    if (!user || !user.interests?.length) {
      return Response.json({ success: false }, { status: 400 });
    }

    const events = await Event.find({ status: 'active' });
    if (!events.length) {
      return Response.json({ success: true, data: [] });
    }

    const recommendations = await generateAIRecommendations(user, events);

    return Response.json({
      success: true,
      data: recommendations.map(r => ({
        ...r.event.toObject(),
        matchScore: r.score,
        matchReasons: r.reasons
      }))
    });

  } catch (err) {
    console.error(err);
    return Response.json(
      { success: false, message: 'Server error' },
      { status: 500 }
    );
  }
}
