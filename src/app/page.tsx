import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bot, Palette, Scan } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Header from '@/components/common/header';
import Logo from '@/components/common/logo';

export default function Home() {
  const heroImage = PlaceHolderImages.find(p => p.id === 'hero');

  return (
    <div className="flex flex-col min-h-dvh bg-background">
      <Header />
      <main className="flex-1">
        <section className="relative w-full h-[60vh] md:h-[80vh] flex items-center justify-center text-center text-primary-foreground">
          {heroImage && (
            <Image
              src={heroImage.imageUrl}
              alt={heroImage.description}
              fill
              className="object-cover"
              priority
              data-ai-hint={heroImage.imageHint}
            />
          )}
          <div className="absolute inset-0 bg-black/50" />
          <div className="relative z-10 p-4 max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-headline font-bold tracking-tight">
              StyleAI Studio: Redefine Your Style
            </h1>
            <p className="mt-4 text-lg md:text-xl text-primary-foreground/80 max-w-2xl mx-auto">
              Unlock personalized fashion recommendations, virtual try-ons, and more with the power of AI.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                <Link href="/dashboard">For Individuals</Link>
              </Button>
              <Button asChild size="lg" variant="secondary" className="bg-secondary/90 hover:bg-secondary/100 text-secondary-foreground">
                <Link href="/business/dashboard">For Businesses</Link>
              </Button>
            </div>
          </div>
        </section>

        <section id="features" className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-headline font-bold text-center text-foreground">
              Core Features
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-center text-muted-foreground">
              Discover a suite of tools designed for both fashion enthusiasts and businesses.
            </p>
            <div className="mt-12 grid gap-8 md:grid-cols-3">
              <Card className="text-center">
                <CardHeader className="items-center">
                  <div className="p-4 bg-accent/20 rounded-full">
                    <Bot className="w-8 h-8 text-accent-foreground" />
                  </div>
                  <CardTitle className="mt-4">AI Style Recommendations</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Get outfit suggestions based on your body type, color harmony, and style preferences.</p>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardHeader className="items-center">
                  <div className="p-4 bg-accent/20 rounded-full">
                    <Scan className="w-8 h-8 text-accent-foreground" />
                  </div>
                  <CardTitle className="mt-4">Generative AI Try-On</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Visualize outfits, hairstyles, and more with our realistic virtual try-on technology.</p>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardHeader className="items-center">
                  <div className="p-4 bg-accent/20 rounded-full">
                    <Palette className="w-8 h-8 text-accent-foreground" />
                  </div>
                  <CardTitle className="mt-4">Visual Catalog Generation</CardTitle>
                </CardHeader>
                <CardContent>
                 <p className="text-muted-foreground">Businesses can automatically create stunning, interactive catalogs for their products.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
      <footer className="py-6 bg-muted text-muted-foreground">
        <div className="container mx-auto px-4 text-center text-sm">
          &copy; {new Date().getFullYear()} StyleAI Studio. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
