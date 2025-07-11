'use client';

import { User } from 'lucide-react';
import { Logo } from '@/components/common/logo';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useAuthContext } from '@/hooks/use-auth-context';
import { getAuth, signOut, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import Link from 'next/link';

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
      <div className="container mx-auto flex h-16 items-center">
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
                      <p className="text-sm font-medium leading-none">{user.role === 'Student' ? '學生' : user.role === 'Lecturer' ? '講師' : user.role === 'Admin' ? '管理員' : user.role}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>個人資料</DropdownMenuItem>
                  <DropdownMenuItem>我的課程</DropdownMenuItem>
                  {user.role === 'Lecturer' && (
                    <>
                      <DropdownMenuItem>講師儀表板</DropdownMenuItem>
                      <DropdownMenuItem>
                        <Link href="/lecturer/courses/new">建立新課程</Link>
                      </DropdownMenuItem>
                    </>
                  )}
                  {user.role === 'Admin' && (
                    <>
                      <DropdownMenuItem>管理員儀表板</DropdownMenuItem>
                      <DropdownMenuItem>
                        <Link href="/admin/subjects/new">建立新科目</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Link href="/lecturer/courses/new">建立新課程</Link>
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>登出</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button onClick={handleSignIn}>登入</Button>
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