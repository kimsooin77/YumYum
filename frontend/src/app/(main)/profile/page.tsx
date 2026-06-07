'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { usersApi, favoritesApi, reviewsApi } from '@/lib/api';
import { isLoggedIn, removeToken } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { User, Heart, LogOut, Star } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function ProfilePage() {
  const router = useRouter();
  const loggedIn = isLoggedIn();

  useEffect(() => {
    if (!loggedIn) router.push('/login');
  }, [loggedIn, router]);

  const { data: me } = useQuery({
    queryKey: ['me'],
    queryFn: usersApi.me,
    enabled: loggedIn,
  });

  const { data: favorites } = useQuery({
    queryKey: ['favorites'],
    queryFn: () => favoritesApi.list({ limit: 1 }),
    enabled: loggedIn,
  });

  const { data: myReviews } = useQuery({
    queryKey: ['myReviews'],
    queryFn: reviewsApi.listByMe,
    enabled: loggedIn,
  });

  const handleLogout = () => {
    removeToken();
    router.push('/login');
  };

  if (!loggedIn) return null;

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-xl font-bold text-gray-900">내 정보</h1>

      {/* 프로필 카드 */}
      <div className="bg-white rounded-xl p-5 shadow-sm flex items-center gap-4">
        <div className="w-14 h-14 rounded-full bg-orange-100 flex items-center justify-center text-2xl">
          🐥
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-gray-900 text-lg">{me?.nickname ?? '로딩 중...'}</p>
          <p className="text-sm text-gray-500 truncate">{me?.email}</p>
          <p className="text-xs text-gray-400 mt-0.5">
            가입일: {me ? new Date(me.createdAt).toLocaleDateString('ko-KR') : ''}
          </p>
        </div>
      </div>

      {/* 통계 */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white rounded-xl p-4 shadow-sm text-center">
          <Heart className="w-6 h-6 text-red-400 fill-red-400 mx-auto mb-1" />
          <p className="text-2xl font-bold text-gray-900">{favorites?.total ?? 0}</p>
          <p className="text-xs text-gray-500">관심 과자</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm text-center">
          <Star className="w-6 h-6 text-yellow-400 fill-yellow-400 mx-auto mb-1" />
          <p className="text-2xl font-bold text-gray-900">{myReviews?.length ?? 0}</p>
          <p className="text-xs text-gray-500">작성 리뷰</p>
        </div>
      </div>

      {/* 내가 쓴 리뷰 */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <h2 className="font-bold text-gray-900 mb-3">내가 쓴 리뷰 {myReviews?.length ?? 0}개</h2>
        {myReviews?.length === 0 && (
          <p className="text-sm text-gray-400 text-center py-4">아직 작성한 리뷰가 없어요</p>
        )}
        <div className="flex flex-col divide-y divide-gray-100">
          {myReviews?.map((review) => (
            <div key={review.id} className="py-3 first:pt-0 last:pb-0">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-medium text-gray-900 truncate">{review.snack.name}</p>
                <div className="flex shrink-0">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={cn('w-3.5 h-3.5', i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200')} />
                  ))}
                </div>
              </div>
              <p className="text-sm text-gray-600 mt-0.5 leading-relaxed">{review.content}</p>
              <p className="text-xs text-gray-400 mt-1">{new Date(review.createdAt).toLocaleDateString('ko-KR')}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 로그아웃 */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <Button
          variant="ghost"
          className="w-full text-red-500 hover:bg-red-50 justify-start"
          onClick={handleLogout}
        >
          <LogOut className="w-4 h-4" />
          로그아웃
        </Button>
      </div>
    </div>
  );
}
