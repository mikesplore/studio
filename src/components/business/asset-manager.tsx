"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { PlusCircle, Upload } from "lucide-react";

type AssetCategory = {
  title: string;
  description: string;
  images: typeof PlaceHolderImages;
};

export default function AssetManager() {
  const mannequinImages = PlaceHolderImages.filter(
    (p) => p.id.startsWith("mannequin-")
  );
  const productImages = PlaceHolderImages.filter((p) =>
    p.id.startsWith("product-")
  );

  const categories: AssetCategory[] = [
    {
      title: "Mannequin Heads",
      description: "Base images of mannequins for virtual try-ons.",
      images: mannequinImages,
    },
    {
      title: "Product Images",
      description: "Images of your products with transparent backgrounds.",
      images: productImages,
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
              Upload Asset
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
                <p className="mt-4 font-medium">No assets yet</p>
                <p className="text-sm text-muted-foreground">
                  Click "Upload Asset" to add your first item.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
