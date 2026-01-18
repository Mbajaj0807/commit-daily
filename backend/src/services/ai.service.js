import OpenAI from "openai";
import dotenv from 'dotenv';
dotenv.config();
const client = new OpenAI({
  baseURL: "https://router.huggingface.co/v1",
  apiKey: process.env.HF_TOKEN,
});

export async function generateMotivationalQuote({
  currentStreak,
  bestStreak,
  streakBrokenToday,
  avgRatingLast7Days,
}) {
  const completion = await client.chat.completions.create({
    model: "meta-llama/Llama-3.2-1B-Instruct:novita",
    messages: [
      {
  role: "system",
  content: `
You generate short motivational quotes for a discipline app.

ABSOLUTE RULES (must follow):
- Output EXACTLY ONE sentence.
- Max 15 words.
- No emojis.
- dont use generic quotes but make it specific to the user's situation.
- mention the user's current streak and best streak in a positive light.
- No sympathy or comfort language.
- Do NOT mention failure, recovery, restart, or "getting back on track"
  UNLESS explicitly told that the streak was broken.
- Do NOT invent problems.
- Do NOT interpret emotions.
- Focus only on the factual state provided.

If rules are violated, the output is invalid.
`
  },

,
      {
  role: "user",
  content: `
FACTS (do not reinterpret):
- Current streak length: ${currentStreak}
- Best streak length: ${bestStreak}
- Streak broken today: ${streakBrokenToday}
- Average rating (7 days): ${avgRatingLast7Days}

TASK:
Generate ONE short motivational sentence.
if streakBrokenToday is false, you MUST NOT mention:
- recovery
- restart
- failure
- fixing anything
- getting back on track
- mention users progress like you are talking to the user on his/her progress
`
}
,
    ],
    max_tokens: 60,
    temperature: 0.7,
  });

  return completion.choices[0].message.content.trim();
}
