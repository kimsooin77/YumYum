'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Heart, User, LogOut, Store, Search, Moon, Sun } from 'lucide-react';
import { isLoggedIn, removeToken } from '@/lib/auth';
import { cn } from '@/lib/utils';
import { useTheme } from '@/context/theme-context';

const navItems = [
  { href: '/snacks', label: '홈', icon: '🏠' },
  { href: '/new', label: '신상', icon: '🆕' },
  { href: '/convenience', label: '편의점', Icon: Store },
  { href: '/favorites', label: '관심', Icon: Heart },
  { href: '/profile', label: '마이', Icon: User },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const loggedIn = isLoggedIn();
  const { dark, toggle } = useTheme();

  const handleLogout = () => {
    removeToken();
    router.push('/login');
    router.refresh();
  };

  return (
    <>
      {/* Top header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-lg mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/snacks" className="text-xl font-bold text-orange-500">
            YumYum 🍪
          </Link>
          <div className="flex items-center gap-3">
            <button onClick={toggle} className="text-gray-500 hover:text-orange-500 transition-colors">
              {dark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <Link href="/search" className="text-gray-500 hover:text-orange-500 transition-colors">
              <Search className="w-5 h-5" />
            </Link>
            {loggedIn ? (
              <button
                onClick={handleLogout}
                className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
              >
                <LogOut className="w-4 h-4" />
              </button>
            ) : (
              <Link href="/login" className="text-sm text-orange-500 font-medium">
                로그인
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Bottom nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-100 safe-bottom">
        <div className="max-w-lg mx-auto flex">
          {navItems.map(({ href, label, icon, Icon }) => {
            const isActive = pathname === href || pathname.startsWith(href + '/');
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  'flex-1 flex flex-col items-center justify-center py-2 gap-0.5 text-xs transition-colors',
                  isActive ? 'text-orange-500' : 'text-gray-400 hover:text-gray-600'
                )}
              >
                {icon ? (
                  <span className="text-lg leading-none">{icon}</span>
                ) : Icon ? (
                  <Icon className={cn('w-5 h-5', isActive && 'stroke-orange-500')} />
                ) : null}
                <span>{label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
