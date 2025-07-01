import { GraduationCap } from 'lucide-react';
import Link from 'next/link';

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2">
      <GraduationCap className="h-7 w-7 text-primary" />
      <h1 className="text-2xl font-bold font-headline text-foreground">TeachMe</h1>
    </Link>
  );
}
