'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { authClient } from '@/lib/auth-client';
import { IconMenu, IconUser, IconLogout, IconGlobe } from '@tabler/icons-react';

export function Header() {
  const { data: session } = authClient.useSession();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="absolute top-0 left-0 right-0 z-50 w-full bg-black/20 backdrop-blur-md">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-lg md:text-2xl font-bold text-white">
              RealEstate
            </span>
          </Link>

          <nav className="hidden md:flex items-center space-x-6">
            <Link
              href="/"
              className="text-sm font-medium text-white hover:text-gray-200 transition-colors"
            >
              Home
            </Link>
            <Link
              href="/about"
              className="text-sm font-medium text-white hover:text-gray-200 transition-colors"
            >
              About Us
            </Link>
            <Link
              href="/properties"
              className="text-sm font-medium text-white hover:text-gray-200 transition-colors"
            >
              Property List
            </Link>
            <Link
              href="/contact"
              className="text-sm font-medium text-white hover:text-gray-200 transition-colors"
            >
              Contact Us
            </Link>
          </nav>

          <div className="flex items-center space-x-2 md:space-x-4">
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/10"
            >
              <IconGlobe className="h-4 w-4 mr-1" />
              Eng
            </Button>
            {session ? (
              <div className="hidden md:flex items-center space-x-2">
                <span className="text-sm text-white">
                  Welcome, {session.user?.name}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => authClient.signOut()}
                  className="text-white hover:bg-white/10"
                >
                  <IconLogout className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <Button
                size="sm"
                className="bg-primary hover:bg-primary/90 text-white"
                asChild
              >
                <Link href="/sign-up">Sign Up</Link>
              </Button>
            )}

            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="md:hidden text-white hover:bg-white/10"
                >
                  <IconMenu className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="w-[280px] sm:w-[300px] bg-black/95 border-white/20"
              >
                <div className="flex flex-col space-y-4 mt-8">
                  <Link
                    href="/"
                    className="text-sm font-medium text-white hover:text-gray-200 transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    Home
                  </Link>
                  <Link
                    href="/about"
                    className="text-sm font-medium text-white hover:text-gray-200 transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    About Us
                  </Link>
                  <Link
                    href="/properties"
                    className="text-sm font-medium text-white hover:text-gray-200 transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    Property List
                  </Link>
                  <Link
                    href="/contact"
                    className="text-sm font-medium text-white hover:text-gray-200 transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    Contact Us
                  </Link>
                  {session ? (
                    <>
                      <span className="text-sm text-white">
                        Welcome, {session.user?.name}
                      </span>
                      <Button
                        variant="ghost"
                        onClick={() => {
                          authClient.signOut();
                          setIsOpen(false);
                        }}
                      >
                        <IconLogout className="mr-2 h-4 w-4" />
                        Sign Out
                      </Button>
                    </>
                  ) : (
                    <Button
                      size="sm"
                      className="bg-primary hover:bg-primary/90 text-white"
                      asChild
                    >
                      <Link href="/sign-up" onClick={() => setIsOpen(false)}>
                        Sign Up
                      </Link>
                    </Button>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
