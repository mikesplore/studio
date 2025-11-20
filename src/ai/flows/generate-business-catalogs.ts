'use server';
/**
 * @fileOverview This file implements the Genkit flow for generating business catalogs showcasing mannequin styles with AI-generated try-on images.
 *
 * - generateBusinessCatalog - A function that generates a business catalog.
 * - GenerateBusinessCatalogInput - The input type for the generateBusinessCatalog function.
 * - GenerateBusinessCatalogOutput - The return type for the generateBusinessCatalog function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateBusinessCatalogInputSchema = z.object({
  mannequinImage: z
    .string()
    .describe(
      "A photo of a mannequin head, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  productImage: z
    .string()
    .describe(
      "A photo of the product to try on the mannequin, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  catalogStyleDescription: z
    .string()
    .describe('A description of the desired style for the catalog.'),
});
export type GenerateBusinessCatalogInput = z.infer<typeof GenerateBusinessCatalogInputSchema>;

const GenerateBusinessCatalogOutputSchema = z.object({
  catalogImage: z
    .string()
    .describe(
      'A generated image of the mannequin wearing the product, suitable for use in a catalog, as a data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.' // Corrected typo here
    ),
});
export type GenerateBusinessCatalogOutput = z.infer<typeof GenerateBusinessCatalogOutputSchema>;

export async function generateBusinessCatalog(
  input: GenerateBusinessCatalogInput
): Promise<GenerateBusinessCatalogOutput> {
  return generateBusinessCatalogFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateBusinessCatalogPrompt',
  input: {schema: GenerateBusinessCatalogInputSchema},
  output: {schema: GenerateBusinessCatalogOutputSchema},
  prompt: `You are an expert stylist for business catalogs.  You will generate an image of a mannequin wearing the provided product, styled for use in a business catalog.  The style of the catalog should be consistent with the following description: {{{catalogStyleDescription}}}.\n\nMannequin: {{media url=mannequinImage}}\nProduct: {{media url=productImage}}`,
});

const generateBusinessCatalogFlow = ai.defineFlow(
  {
    name: 'generateBusinessCatalogFlow',
    inputSchema: GenerateBusinessCatalogInputSchema,
    outputSchema: GenerateBusinessCatalogOutputSchema,
  },
  async input => {
    const {media} = await ai.generate({
      model: 'googleai/gemini-2.5-flash-image-preview',
      prompt: [
        {media: {url: input.mannequinImage}},
        {text: `generate an image of this character wearing the product, and generate the catalog image in the style of ${input.catalogStyleDescription}`},
        {media: {url: input.productImage}},
      ],
      config: {
        responseModalities: ['TEXT', 'IMAGE'], // MUST provide both TEXT and IMAGE, IMAGE only won't work
      },
    });
    return {catalogImage: media!.url};
  }
);
