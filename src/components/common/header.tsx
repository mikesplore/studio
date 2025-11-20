import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Logo from '@/components/common/logo';

export default function Header() {
  return (
    <header className="absolute top-0 left-0 right-0 z-20 bg-gradient-to-b from-black/50 to-transparent text-primary-foreground">
      <div className="container mx-auto flex items-center justify-between p-4">
        <div className="text-white">
          <Logo />
        </div>
        <nav className="flex items-center gap-2 sm:gap-4">
          <Button asChild variant="ghost" className="hover:bg-white/10 text-white">
            <Link href="/login">Log In</Link>
          </Button>
          <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground hidden sm:flex">
            <Link href="/signup">Sign Up</Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}
