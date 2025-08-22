// app/api/suggest-message/route.ts
import { google } from '@ai-sdk/google';
import { streamText } from 'ai';

export const runtime = 'edge';

export async function POST(req: Request) {
  const prompt = `Create a list of three open-ended and engaging questions for an anonymous social media platform like qooh.me. 
Format them as a single string separated by '||'. Keep them friendly and concise.`;

  const result = await streamText({
    model: google('models/gemini-1.5-pro-latest'),
    messages: [
      {
        role: 'user',
        content: prompt,
      },
    ],
  });

  // Correct method name here:
  return result.toTextStreamResponse();
}
