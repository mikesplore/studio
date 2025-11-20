import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import StyleRecommender from "@/components/dashboard/style-recommender";
import VirtualTryOn from "@/components/dashboard/virtual-try-on";
import WardrobeManager from "@/components/dashboard/wardrobe-manager";
import { Bot, Scan, Shirt } from "lucide-react";

export default function DashboardPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight mb-6">Personal Dashboard</h1>
      <Tabs defaultValue="recommender" className="w-full">
        <TabsList className="grid w-full grid-cols-3 md:w-[600px]">
          <TabsTrigger value="recommender">
            <Bot className="mr-2 h-4 w-4" />
            Style Recommender
          </TabsTrigger>
          <TabsTrigger value="try-on">
            <Scan className="mr-2 h-4 w-4" />
            Virtual Try-On
          </TabsTrigger>
          <TabsTrigger value="wardrobe">
            <Shirt className="mr-2 h-4 w-4" />
            My Wardrobe
          </TabsTrigger>
        </TabsList>
        <TabsContent value="recommender" className="mt-6">
          <StyleRecommender />
        </TabsContent>
        <TabsContent value="try-on" className="mt-6">
          <VirtualTryOn />
        </TabsContent>
        <TabsContent value="wardrobe" className="mt-6">
          <WardrobeManager />
        </TabsContent>
      </Tabs>
    </div>
  );
}
