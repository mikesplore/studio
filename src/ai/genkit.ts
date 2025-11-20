import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';

/**
 * Genkit AI instance configured with Google AI (Gemini)
 */
export const ai = genkit({
  plugins: [
    googleAI({
    }),
  ],
  model: 'gemini-2.0-flash',
});
