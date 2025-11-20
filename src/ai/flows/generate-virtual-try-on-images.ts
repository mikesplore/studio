'use server';
/**
 * @fileOverview Generates virtual try-on images using a user-provided photo and outfit image.
 *
 * - generateVirtualTryOnImages - A function that generates virtual try-on images.
 * - GenerateVirtualTryOnImagesInput - The input type for the generateVirtualTryOnImages function.
 * - GenerateVirtualTryOnImagesOutput - The return type for the generateVirtualTryOnImages function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateVirtualTryOnImagesInputSchema = z.object({
  userPhotoDataUri: z
    .string()
    .describe(
      'A photo of the user, as a data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.'
    ),
  outfitImageDataUri: z
    .string()
    .describe(
      'A photo of the outfit, as a data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.'
    ),
});
export type GenerateVirtualTryOnImagesInput = z.infer<typeof GenerateVirtualTryOnImagesInputSchema>;

const GenerateVirtualTryOnImagesOutputSchema = z.object({
  tryOnImageDataUri: z
    .string()
    .describe('The generated try-on image, as a data URI.'),
});
export type GenerateVirtualTryOnImagesOutput = z.infer<typeof GenerateVirtualTryOnImagesOutputSchema>;

export async function generateVirtualTryOnImages(
  input: GenerateVirtualTryOnImagesInput
): Promise<GenerateVirtualTryOnImagesOutput> {
  return generateVirtualTryOnImagesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateVirtualTryOnImagesPrompt',
  input: {schema: GenerateVirtualTryOnImagesInputSchema},
  output: {schema: GenerateVirtualTryOnImagesOutputSchema},
  prompt: [
    {
      media: {url: '{{userPhotoDataUri}}'},
    },
    {
      text: 'generate an image of this person wearing the clothes in the next image',
    },
    {
      media: {url: '{{outfitImageDataUri}}'},
    },
  ],
  model: 'googleai/gemini-2.5-flash-image-preview',
  config: {
    responseModalities: ['TEXT', 'IMAGE'],
  },
});

const generateVirtualTryOnImagesFlow = ai.defineFlow(
  {
    name: 'generateVirtualTryOnImagesFlow',
    inputSchema: GenerateVirtualTryOnImagesInputSchema,
    outputSchema: GenerateVirtualTryOnImagesOutputSchema,
  },
  async input => {
    const {media} = await prompt(input);
    return {tryOnImageDataUri: media!.url!};
  }
);
