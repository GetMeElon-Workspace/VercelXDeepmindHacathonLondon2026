import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { streamObject } from 'ai';
import { NodeProposalSchema } from '@/lib/schema';

export const maxDuration = 30;

const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY || '',
});

export async function POST(req: Request) {
  if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
    return new Response('Google Generative AI API key is not configured', { status: 500 });
  }

  const { prompt, baseModelContext } = await req.json();

  const result = await streamObject({
    model: google('gemini-1.5-pro'),
    schema: NodeProposalSchema,
    system: `You are a senior financial analyst with deep knowledge in financial modeling and domain expertise in industrial plants. 
    The user will provide a base industrial plant model and ask you to create a new scenario branch.
    Your job is to analyze the new context, pull in relevant localized commodity prices, and estimate missing data (like heat efficiency or feedstock yield changes).
    You MUST return a valid JSON array of proposals representing the data gaps you are proposing. 
    Provide a markdown rationale and source links for each proposal to ensure traceability and auditability.
    
    Current Base Model Context:
    ${JSON.stringify(baseModelContext, null, 2)}`,
    prompt: prompt,
  });

  return result.toTextStreamResponse();
}
