"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { PlusCircle, Upload } from "lucide-react";

type ImageCategory = {
  title: string;
  description: string;
  images: typeof PlaceHolderImages;
};

export default function WardrobeManager() {
  const userImages = PlaceHolderImages.filter(
    (p) => p.id.startsWith("user-")
  );
  const wardrobeItems = PlaceHolderImages.filter((p) =>
    p.id.startsWith("wardrobe-")
  );

  const categories: ImageCategory[] = [
    {
      title: "My Photos",
      description: "Your full-body and face photos for accurate recommendations.",
      images: userImages,
    },
    {
      title: "My Wardrobe Items",
      description: "Images of your clothes, shoes, and accessories.",
      images: wardrobeItems,
    },
  ];

  return (
    <div className="space-y-8">
      {categories.map((category) => (
        <Card key={category.title}>
          <CardHeader className="flex-row items-center justify-between">
            <div>
              <CardTitle>{category.title}</CardTitle>
              <CardDescription>{category.description}</CardDescription>
            </div>
            <Button>
              <Upload className="mr-2 h-4 w-4" />
              Upload
            </Button>
          </CardHeader>
          <CardContent>
            {category.images.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {category.images.map((image) => (
                  <div key={image.id} className="group relative aspect-square">
                    <Image
                      src={image.imageUrl}
                      alt={image.description}
                      fill
                      className="object-cover rounded-lg border"
                      data-ai-hint={image.imageHint}
                      sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 16vw"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-center p-8 border-2 border-dashed rounded-lg">
                <PlusCircle className="h-12 w-12 text-muted-foreground" />
                <p className="mt-4 font-medium">No items yet</p>
                <p className="text-sm text-muted-foreground">
                  Click "Upload" to add your first item.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
