'use client';

import { User } from 'lucide-react';
import { Logo } from '@/components/common/logo';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useAuthContext } from '@/hooks/use-auth-context';
import { getAuth, signOut, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

export function Header() {
  const { user } = useAuthContext();
  const auth = getAuth();
  const provider = new GoogleAuthProvider();

  const handleSignOut = async () => {
    await signOut(auth);
  };

  const handleSignIn = async () => {
    await signInWithPopup(auth, provider);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Logo />
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-2">
            {user ? (
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
                      <p className="text-sm font-medium leading-none">{user.role}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Profile</DropdownMenuItem>
                  <DropdownMenuItem>My Courses</DropdownMenuItem>
                  {user.role === 'Lecturer' && (
                    <DropdownMenuItem>Lecturer Dashboard</DropdownMenuItem>
                  )}
                  {user.role === 'Admin' && (
                    <DropdownMenuItem>Admin Dashboard</DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>Log out</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button onClick={handleSignIn}>Log in</Button>
            )}
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