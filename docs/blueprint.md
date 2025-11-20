# **App Name**: StyleAI Studio

## Core Features:

- User Authentication: Secure user and business accounts with Firebase Authentication, providing separate login flows.
- Image Management: Securely upload and store user-provided images (full body, face, wardrobe items) and business assets (mannequin heads, product images) using Firebase Storage. Firestore metadata will index these uploads.
- AI Style Recommendations: Use AI to detect body parts, clothing types, and colors; rank outfit combinations based on body type, color harmony, and user style preferences.
- Generative AI Try-On: Integrate with Vertex AI / Nano Banana tool to generate realistic virtual try-ons for outfits, hairstyles, and nail designs.
- Visual Catalog Generation: Automatically generate catalogs for businesses, showcasing mannequin styles and virtual try-on images for an interactive browsing experience.
- Recommendation Ranking & Saving: Rank AI suggestions and enable users to save liked combinations, outfits, and designs.
- Cross-Platform Frontend: Provide an intuitive web and mobile interface built with NextJS, TypeScript, and TailwindCSS. The layout will focus on visual appeal and ease of navigation.

## Style Guidelines:

- Primary color: Deep Blue (#2962FF) for a professional yet creative feel.
- Background color: Light Gray (#F0F4F8), to ensure content elements such as images stand out.
- Accent color: Bright Yellow (#FFDA63) for interactive elements and highlights.
- Body and headline font: 'Inter', a modern sans-serif font. Note: currently only Google Fonts are supported.
- Employ minimal thin-line icons with the accent color to ensure a visually engaging experience.
- Visual-first design with a clean, intuitive layout, optimized for both web and mobile platforms.
- Incorporate subtle transitions and animations to enhance visual engagement and provide a smooth user experience.