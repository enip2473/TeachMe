import { Search, User } from 'lucide-react';
import { redirect } from 'next/navigation';
import { Logo } from '@/components/common/logo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

export function Header() {
  async function searchAction(formData: FormData) {
    'use server';
    const query = formData.get('q');
    if (typeof query === 'string' && query.trim() !== '') {
      redirect(`/search?q=${encodeURIComponent(query.trim())}`);
    } else {
      redirect('/search');
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Logo />
        <div className="flex flex-1 items-center justify-end space-x-4">
          <form action={searchAction} className="relative hidden w-full max-w-sm items-center md:flex">
            <Input
              type="text"
              name="q"
              placeholder="Search for courses..."
              className="pl-10"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          </form>
          <nav className="flex items-center space-x-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar>
                    <AvatarFallback>
                      <User />
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">Student</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      student@teachme.com
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>My Courses</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Log out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>
        </div>
      </div>
    </header>
  );
}

// A simple Avatar component to be used until shadcn provides one
const Avatar = ({ children }: { children: React.ReactNode }) => (
  <div className="relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full items-center justify-center bg-secondary">
    {children}
  </div>
);

const AvatarFallback = ({ children }: { children: React.ReactNode }) => (
  <span className="flex h-full w-full items-center justify-center rounded-full bg-muted">
    {children}
  </span>
);
