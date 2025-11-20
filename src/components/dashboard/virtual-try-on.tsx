"use client";

import { useState } from "react";
import Image from "next/image";
import { getVirtualTryOn } from "@/app/actions";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Loader2, Wand2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "../ui/skeleton";

export default function VirtualTryOn() {
  const [loading, setLoading] = useState(false);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const { toast } = useToast();

  const userPhotos = PlaceHolderImages.filter(p => p.id.startsWith('user-'));
  const wardrobeItems = PlaceHolderImages.filter(p => p.id.startsWith('wardrobe-'));

  const [selectedUserPhoto, setSelectedUserPhoto] = useState(userPhotos[0].imageUrl);
  const [selectedWardrobeItem, setSelectedWardrobeItem] = useState(wardrobeItems[0].imageUrl);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResultImage(null);
    const result = await getVirtualTryOn({});
    if ("error" in result) {
      toast({
        variant: "destructive",
        title: "Error",
        description: result.error,
      });
    } else {
      setResultImage(result.tryOnImageDataUri);
    }
    setLoading(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Virtual Try-On</CardTitle>
        <CardDescription>
          Select your photo and a clothing item to see how it looks on you.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="font-medium">Your Photo</label>
              <Select defaultValue={selectedUserPhoto} onValueChange={setSelectedUserPhoto}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your photo" />
                </SelectTrigger>
                <SelectContent>
                  {userPhotos.map(photo => (
                    <SelectItem key={photo.id} value={photo.imageUrl}>{photo.description}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
               <div className="mt-2 rounded-lg border p-2 bg-muted/30">
                <Image src={selectedUserPhoto} alt="Selected user" width={100} height={100} className="rounded-md object-cover" />
              </div>
            </div>
            <div>
              <label className="font-medium">Wardrobe Item</label>
              <Select defaultValue={selectedWardrobeItem} onValueChange={setSelectedWardrobeItem}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a wardrobe item" />
                </SelectTrigger>
                <SelectContent>
                  {wardrobeItems.map(item => (
                    <SelectItem key={item.id} value={item.imageUrl}>{item.description}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="mt-2 rounded-lg border p-2 bg-muted/30">
                <Image src={selectedWardrobeItem} alt="Selected item" width={100} height={100} className="rounded-md object-cover" />
              </div>
            </div>
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Wand2 className="mr-2 h-4 w-4" />
              )}
              Generate Try-On
            </Button>
          </form>
          <div className="flex flex-col items-center justify-center bg-muted rounded-lg p-4">
            <h3 className="font-semibold mb-4">Result</h3>
            <div className="relative w-full max-w-[300px] aspect-[3/4] rounded-lg border-2 border-dashed flex items-center justify-center">
              {loading ? (
                <Skeleton className="w-full h-full" />
              ) : resultImage ? (
                <Image
                  src={resultImage}
                  alt="Virtual try-on result"
                  fill
                  className="object-cover rounded-md"
                />
              ) : (
                <div className="text-center text-muted-foreground p-4">
                  <Wand2 className="mx-auto h-12 w-12" />
                  <p className="mt-2">Your generated image will appear here.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
