'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  IconSearch,
  IconBell,
  IconMessageCircle,
  IconUser,
  IconSettings,
  IconLogout,
  IconHeart,
  IconMenu2,
  IconX,
} from '@tabler/icons-react';
import { authClient } from '@/lib/auth-client';
import { SignOut } from '@/components/auth/signout';

const navigation = [
  { name: 'Buy', href: '/buy' },
  { name: 'Rent', href: '/rent' },
  { name: 'Favorites', href: '/favorites' },
  { name: 'Help', href: '/help' },
  { name: 'Services', href: '/services' },
  { name: 'Blog', href: '/blog' },
];

interface EstateHeaderProps {
  onSearchChange?: (query: string) => void;
}

export function EstateHeader({ onSearchChange }: EstateHeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { data: session, isPending } = authClient.useSession();

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="bg-white border-b border-estate-gray-200 sticky top-0 z-50">
      <div className="estate-container">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-estate-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">E</span>
              </div>
              <span className="text-xl font-bold text-estate-gray-900">
                EstateEase
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigation.map(item => (
              <Link
                key={item.name}
                href={item.href}
                className="text-estate-gray-600 hover:text-estate-primary font-medium transition-colors duration-200"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Search Bar */}
          <div className="hidden lg:flex items-center flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <IconSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-estate-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Search Anything..."
                className="pl-10 pr-4 py-2 border-estate-gray-300 rounded-lg focus:ring-2 focus:ring-estate-primary focus:border-estate-primary"
                onChange={e => onSearchChange?.(e.target.value)}
              />
            </div>
          </div>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {/* Mobile Search Button */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              aria-label="Search"
            >
              <IconSearch className="h-5 w-5" />
            </Button>

            {session ? (
              <>
                {/* Messages */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative"
                  aria-label="Messages"
                >
                  <IconMessageCircle className="h-5 w-5" />
                  <span className="absolute -top-1 -right-1 bg-estate-error text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                    3
                  </span>
                </Button>

                {/* Notifications */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative"
                  aria-label="Notifications"
                >
                  <IconBell className="h-5 w-5" />
                  <span className="absolute -top-1 -right-1 bg-estate-error text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                    2
                  </span>
                </Button>

                {/* User Profile */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="relative h-8 w-8 rounded-full"
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={session.user.image || ''}
                          alt={session.user.name || 'User'}
                        />
                        <AvatarFallback>
                          {session.user.initials ||
                            session.user.name?.charAt(0) ||
                            'U'}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {session.user.name || 'User'}
                        </p>
                        <p className="text-xs leading-none text-estate-gray-500">
                          {session.user.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/profile" className="flex items-center">
                        <IconUser className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/favorites" className="flex items-center">
                        <IconHeart className="mr-2 h-4 w-4" />
                        <span>Favorites</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/settings" className="flex items-center">
                        <IconSettings className="mr-2 h-4 w-4" />
                        <span>Settings</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <SignOut />
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              /* Sign In / Sign Up Buttons */
              <div className="flex items-center space-x-2">
                <Button variant="ghost" asChild>
                  <Link href="/sign-in">Sign In</Link>
                </Button>
                <Button
                  className="bg-estate-primary hover:bg-estate-primary-dark"
                  asChild
                >
                  <Link href="/sign-up">Sign Up</Link>
                </Button>
              </div>
            )}

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={handleMobileMenuToggle}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <IconX className="h-5 w-5" />
              ) : (
                <IconMenu2 className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-estate-gray-200 py-4">
            {/* Mobile Search */}
            <div className="mb-4">
              <div className="relative">
                <IconSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-estate-gray-400 h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Search Anything..."
                  className="pl-10 pr-4 py-2 border-estate-gray-300 rounded-lg focus:ring-2 focus:ring-estate-primary focus:border-estate-primary"
                  onChange={e => onSearchChange?.(e.target.value)}
                />
              </div>
            </div>

            {/* Mobile Navigation */}
            <nav className="space-y-2">
              {navigation.map(item => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="block px-3 py-2 text-estate-gray-600 hover:text-estate-primary hover:bg-estate-gray-50 rounded-lg font-medium transition-colors duration-200"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            {/* Mobile Authentication */}
            {!session && (
              <div className="pt-4 border-t border-estate-gray-200">
                <div className="space-y-2">
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    asChild
                  >
                    <Link
                      href="/sign-in"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Sign In
                    </Link>
                  </Button>
                  <Button
                    className="w-full bg-estate-primary hover:bg-estate-primary-dark"
                    asChild
                  >
                    <Link
                      href="/sign-up"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Sign Up
                    </Link>
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
