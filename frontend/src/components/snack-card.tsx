'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { favoritesApi } from '@/lib/api';
import { isLoggedIn } from '@/lib/auth';
import { cn } from '@/lib/utils';
import type { Snack } from '@/types';

interface SnackCardProps {
  snack: Snack;
}

export default function SnackCard({ snack }: SnackCardProps) {
  const queryClient = useQueryClient();
  const [imgError, setImgError] = useState(false);
  const [localFavorited, setLocalFavorited] = useState(snack.isFavorited ?? false);
  const [localFavoriteId, setLocalFavoriteId] = useState(snack.favoriteId);

  useEffect(() => {
    setLocalFavorited(snack.isFavorited ?? false);
    setLocalFavoriteId(snack.favoriteId ?? undefined);
  }, [snack.isFavorited, snack.favoriteId]);

  const addFav = useMutation({
    mutationFn: () => favoritesApi.add(snack.id),
    onMutate: () => setLocalFavorited(true),
    onSuccess: (data) => {
      setLocalFavoriteId(data.id);
      queryClient.invalidateQueries({ queryKey: ['snacks'] });
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
    },
    onError: () => setLocalFavorited(false),
  });

  const removeFav = useMutation({
    mutationFn: (id: number) => favoritesApi.remove(id),
    onMutate: () => { setLocalFavorited(false); setLocalFavoriteId(undefined); },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['snacks'] });
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
    },
    onError: () => { setLocalFavorited(true); setLocalFavoriteId(snack.favoriteId); },
  });

  const handleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isLoggedIn()) {
      window.location.href = '/login';
      return;
    }
    if (localFavorited && localFavoriteId) {
      removeFav.mutate(localFavoriteId);
    } else {
      addFav.mutate();
    }
  };

  const isPending = addFav.isPending || removeFav.isPending;

  return (
    <Link href={`/snacks/${snack.id}`} className="group block">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
        <div className="relative aspect-square bg-gray-100">
          {snack.imageUrl && !imgError ? (
            <Image
              src={snack.imageUrl}
              alt={snack.name}
              fill
              unoptimized
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-4xl">🍿</div>
          )}
          <button
            onClick={handleFavorite}
            disabled={isPending}
            className={cn(
              'absolute top-2 right-2 p-2 rounded-full bg-white/80 backdrop-blur-sm shadow-sm transition-all',
              localFavorited ? 'text-red-500' : 'text-gray-400 hover:text-red-400'
            )}
          >
            <Heart className={cn('w-4 h-4', localFavorited && 'fill-current')} />
          </button>
        </div>
        <div className="p-3">
          <p className="text-xs text-orange-500 font-medium">{snack.category.name}</p>
          <h3 className="font-semibold text-gray-900 text-sm mt-0.5 line-clamp-2">{snack.name}</h3>
          <p className="text-xs text-gray-500 mt-0.5">{snack.brand.name}</p>
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-1">
              <span className="text-yellow-400 text-xs">★</span>
              <span className="text-xs font-medium text-gray-700">
                {snack.avgRating > 0 ? snack.avgRating.toFixed(1) : '-'}
              </span>
              <span className="text-xs text-gray-400">({snack.reviewCount})</span>
            </div>
            {snack.price && (
              <span className="text-sm font-bold text-gray-900">
                {snack.price.toLocaleString()}원
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
