import Link from 'next/link';
import { Sparkles } from 'lucide-react';

export default function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2 text-xl font-bold font-headline group">
      <Sparkles className="w-6 h-6 text-accent group-hover:animate-pulse" />
      <span className="hidden sm:inline-block">StyleAI Studio</span>
    </Link>
  );
}
