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
  // Use a powerful, widely available model for complex vision tasks.
  model: 'gemini-1.5-pro-latest',
});
