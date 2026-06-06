'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { favoritesApi } from '@/lib/api';
import { isLoggedIn } from '@/lib/auth';
import SnackCard from '@/components/snack-card';
import { Heart } from 'lucide-react';

export default function FavoritesPage() {
  const router = useRouter();
  const loggedIn = isLoggedIn();

  useEffect(() => {
    if (!loggedIn) router.push('/login');
  }, [loggedIn, router]);

  const { data, isLoading } = useQuery({
    queryKey: ['favorites'],
    queryFn: () => favoritesApi.list({ limit: 50 }),
    enabled: loggedIn,
  });

  if (!loggedIn) return null;

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
        <Heart className="w-5 h-5 text-red-500 fill-red-500" />
        관심 과자
      </h1>

      {isLoading ? (
        <div className="grid grid-cols-2 gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl h-52 animate-pulse" />
          ))}
        </div>
      ) : data?.data.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <Heart className="w-10 h-10 mx-auto mb-2 opacity-30" />
          <p className="text-sm">관심 과자가 없습니다</p>
          <p className="text-xs mt-1">마음에 드는 과자에 하트를 눌러보세요!</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {data?.data.map((fav) => (
            <SnackCard
              key={fav.id}
              snack={{ ...fav.snack, isFavorited: true, favoriteId: fav.id }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
