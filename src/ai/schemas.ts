import {z} from 'genkit';

/**
 * @fileOverview Defines the Zod schemas and TypeScript types for AI flows.
 */

// Schema for analyzeColorPalette flow
export const AnalyzeColorPaletteInputSchema = z.object({
  userImageDataUri: z
    .string()
    .describe(
      "A close-up image of the user's face in natural light, as a data URI. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type AnalyzeColorPaletteInput = z.infer<typeof AnalyzeColorPaletteInputSchema>;


export const AnalyzeColorPaletteOutputSchema = z.object({
  season: z.string().describe("The determined seasonal color palette (e.g., 'Warm Autumn', 'Cool Winter')."),
  palette: z.array(z.string().regex(/^#[0-9A-F]{6}$/i)).describe("An array of 5-7 hex color codes that are most flattering for the user."),
  description: z.string().describe("A detailed description of the user's color palette, explaining the characteristics and why these colors are flattering."),
});
export type AnalyzeColorPaletteOutput = z.infer<typeof AnalyzeColorPaletteOutputSchema>;
