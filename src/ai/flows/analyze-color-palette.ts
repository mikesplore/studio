'use server';

/**
 * @fileOverview Analyzes a user's photo to determine their seasonal color palette.
 *
 * - analyzeColorPalette - A function that returns a color palette analysis.
 */

import {ai} from '@/ai/genkit';
import {
  AnalyzeColorPaletteInput,
  AnalyzeColorPaletteInputSchema,
  AnalyzeColorPaletteOutput,
  AnalyzeColorPaletteOutputSchema,
} from '@/ai/schemas';


export async function analyzeColorPalette(
  input: AnalyzeColorPaletteInput
): Promise<AnalyzeColorPaletteOutput> {
  return analyzeColorPaletteFlow(input);
}


const prompt = ai.definePrompt({
  name: 'analyzeColorPalettePrompt',
  input: {schema: AnalyzeColorPaletteInputSchema},
  output: {schema: AnalyzeColorPaletteOutputSchema},
  prompt: `You are an expert personal stylist specializing in color analysis. Your task is to analyze the provided user image to determine their seasonal color palette.

  Analyze the user's skin undertones (cool, warm, or neutral), hair color, and eye color from the image. Based on this analysis, determine which of the 12 seasonal color palettes they fit into (e.g., Light Spring, Deep Autumn, Cool Winter, etc.).

  Your response must include:
  1.  **season**: The name of the determined seasonal color palette.
  2.  **palette**: An array of 5-7 hex color codes representing the most flattering colors for this season.
  3.  **description**: A helpful paragraph explaining the characteristics of this season and why these colors are suitable for the user. Be encouraging and positive.

  User's Photo: {{media url=userImageDataUri}}`,
});

const analyzeColorPaletteFlow = ai.defineFlow(
  {
    name: 'analyzeColorPaletteFlow',
    inputSchema: AnalyzeColorPaletteInputSchema,
    outputSchema: AnalyzeColorPaletteOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
