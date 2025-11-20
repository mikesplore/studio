import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CatalogGenerator from "@/components/business/catalog-generator";
import AssetManager from "@/components/business/asset-manager";
import { ImageIcon, Palette } from "lucide-react";

export default function BusinessDashboardPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight mb-6">Business Dashboard</h1>
      <Tabs defaultValue="generator" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:w-[500px]">
          <TabsTrigger value="generator">
            <Palette className="mr-2 h-4 w-4" />
            Catalog Generator
          </TabsTrigger>
          <TabsTrigger value="assets">
            <ImageIcon className="mr-2 h-4 w-4" />
            My Assets
          </TabsTrigger>
        </TabsList>
        <TabsContent value="generator" className="mt-6">
          <CatalogGenerator />
        </TabsContent>
        <TabsContent value="assets" className="mt-6">
          <AssetManager />
        </TabsContent>
      </Tabs>
    </div>
  );
}
