'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { recommendationsApi } from '@/lib/api';
import { isLoggedIn } from '@/lib/auth';
import SnackCard from '@/components/snack-card';
import { Star } from 'lucide-react';

export default function RecommendationsPage() {
  const router = useRouter();
  const loggedIn = isLoggedIn();

  useEffect(() => {
    if (!loggedIn) router.push('/login');
  }, [loggedIn, router]);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['recommendations'],
    queryFn: () => recommendationsApi.get(12),
    enabled: loggedIn,
  });

  if (!loggedIn) return null;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <Star className="w-5 h-5 text-orange-400 fill-orange-400" />
          AI 맞춤 추천
        </h1>
        <button
          onClick={() => refetch()}
          className="text-sm text-orange-500 font-medium hover:text-orange-600"
        >
          새로고침
        </button>
      </div>

      <div className="bg-orange-50 rounded-xl p-3 text-sm text-orange-700 border border-orange-100">
        관심 과자를 기반으로 AI가 추천하는 과자입니다 🤖
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 gap-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl h-52 animate-pulse" />
          ))}
        </div>
      ) : data?.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-4xl mb-2">🤖</p>
          <p className="text-sm">관심 과자를 추가하면 맞춤 추천을 받을 수 있어요!</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {data?.map((snack) => (
            <SnackCard key={snack.id} snack={snack} />
          ))}
        </div>
      )}
    </div>
  );
}
