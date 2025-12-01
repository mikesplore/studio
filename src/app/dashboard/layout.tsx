// src/app/dashboard/layout.tsx
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import {
  LogOut,
  LayoutGrid,
  Scan,
  Shirt,
  Palette,
  History,
  Menu,
  UserCircle,
} from 'lucide-react';

import Logo from '@/components/common/logo';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { WardrobeProvider } from '@/contexts/wardrobe-context';
import { cn } from '@/lib/utils';
import { BusinessAssetProvider } from '@/contexts/business-asset-context';
import { useIsMobile } from '@/hooks/use-mobile';
import { Separator } from '@/components/ui/separator';

function UserMenu() {
    const { data: session, status } = useSession();
    const isMobile = useIsMobile();
    
    if (status === 'loading') {
        return (
            <div className="h-9 w-9 rounded-full bg-muted animate-pulse" />
        );
    }

    if (status === 'unauthenticated') {
        return null;
    }

    if (isMobile) {
        return (
            <Sheet>
                <SheetTrigger asChild>
                    <Button variant="ghost" size="icon">
                        <Menu className="h-6 w-6" />
                        <span className="sr-only">Open menu</span>
                    </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[280px]">
                    <div className="p-4">
                        <div className="flex items-center gap-3 mb-4">
                            <Avatar className="h-10 w-10">
                                <AvatarImage 
                                    src={session?.user?.image || undefined} 
                                    alt={session?.user?.name || 'User'}
                                    referrerPolicy="no-referrer"
                                />
                                <AvatarFallback className="bg-primary text-white">
                                    {session?.user?.name?.charAt(0).toUpperCase() || 'U'}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col space-y-1">
                                <p className="text-sm font-medium leading-none">{session?.user?.name}</p>
                                <p className="text-xs leading-none text-muted-foreground">
                                    {session?.user?.email}
                                </p>
                            </div>
                        </div>
                        <Separator />
                        <nav className="flex flex-col gap-2 mt-4">
                             <SheetClose asChild>
                                <Link href="/dashboard" className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary">
                                    <LayoutGrid className="h-5 w-5" />
                                    Dashboard
                                </Link>
                            </SheetClose>
                            <SheetClose asChild>
                                <Link href="/dashboard/history" className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary">
                                    <History className="h-5 w-5" />
                                    Outfit History
                                </Link>
                            </SheetClose>
                            <SheetClose asChild>
                                <Link href="/dashboard/profile" className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary">
                                    <UserCircle className="h-5 w-5" />
                                    Profile & Usage
                                </Link>
                            </SheetClose>
                        </nav>
                        <Separator className="my-4" />
                        <Button variant="ghost" className="w-full justify-start" onClick={() => signOut({ callbackUrl: '/' })}>
                            <LogOut className="mr-3 h-5 w-5" />
                            Log out
                        </Button>
                    </div>
                </SheetContent>
            </Sheet>
        );
    }
    
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                    <Avatar className="h-9 w-9">
                        <AvatarImage 
                            src={session?.user?.image || undefined} 
                            alt={session?.user?.name || 'User'}
                            referrerPolicy="no-referrer"
                        />
                        <AvatarFallback className="bg-primary text-white">
                            {session?.user?.name?.charAt(0).toUpperCase() || 'U'}
                        </AvatarFallback>
                    </Avatar>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{session?.user?.name}</p>
                        <p className="text-xs leading-none text-muted-foreground">
                            {session?.user?.email}
                        </p>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                 <DropdownMenuItem asChild>
                    <Link href="/dashboard">
                        <LayoutGrid className="mr-2 h-4 w-4" />
                        <span>Dashboard</span>
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <Link href="/dashboard/history">
                        <History className="mr-2 h-4 w-4" />
                        <span>Outfit History</span>
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <Link href="/dashboard/profile">
                        <UserCircle className="mr-2 h-4 w-4" />
                        <span>Profile & Usage</span>
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => signOut({ callbackUrl: '/' })}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

const personalNavLinks = [
    { href: "/dashboard", label: "Virtual Try-On", icon: Scan },
    { href: "/dashboard/wardrobe", label: "My Wardrobe", icon: Shirt },
];

const businessNavLinks = [
    { href: "/business/dashboard", label: "Catalog Generator", icon: Palette },
    { href: "/dashboard/wardrobe", label: "Business Assets", icon: Shirt },
];


function NavTabs() {
    const pathname = usePathname();
    const isBusinessPath = pathname.startsWith('/business');
    const isMobile = useIsMobile();
    
    const navLinks = isBusinessPath ? businessNavLinks : personalNavLinks;

    return (
        <div className="flex items-center space-x-1 bg-muted p-1 rounded-full">
            {navLinks.map(({ href, label, icon: Icon }) => (
                <Link key={href} href={href} passHref>
                    <Button
                        variant={pathname === href ? "default" : "ghost"}
                        className={cn(
                            "rounded-full px-3 sm:px-4 py-2 text-sm font-medium transition-all",
                            pathname === href
                                ? "bg-background text-foreground shadow-sm"
                                : "text-muted-foreground hover:bg-background/50"
                        )}
                    >
                        {!isMobile && <Icon className="mr-2 h-4 w-4" />}
                        {label}
                    </Button>
                </Link>
            ))}
        </div>
    );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-dvh bg-gradient-to-br from-background to-muted/20">
      <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 sm:px-6 shadow-sm">
        <Logo />
        <div className="flex-1 flex justify-center">
            <NavTabs />
        </div>
        <div className="flex items-center">
          <UserMenu />
        </div>
      </header>
      <main className="flex-1 p-4 sm:p-6 md:p-8 lg:p-10 overflow-auto">
        <div className="max-w-7xl mx-auto">
          <WardrobeProvider>
            <BusinessAssetProvider>
              {children}
            </BusinessAssetProvider>
          </WardrobeProvider>
        </div>
      </main>
    </div>
  );
}
