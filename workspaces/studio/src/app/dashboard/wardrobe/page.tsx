// src/app/dashboard/wardrobe/page.tsx
"use client";

import { usePathname } from "next/navigation";
import WardrobeManager from "@/components/dashboard/wardrobe-manager";
import AssetManager from "@/components/business/asset-manager";

export default function WardrobePage() {
  const pathname = usePathname();
  const isBusinessPath = pathname.startsWith('/business');

  // If on a business path, show only the AssetManager
  if (isBusinessPath) {
    return (
      <div className="animate-fade-in">
        <AssetManager />
      </div>
    );
  }

  // On personal paths, show the WardrobeManager
  return (
    <div className="animate-fade-in">
      <WardrobeManager />
    </div>
  );
}
