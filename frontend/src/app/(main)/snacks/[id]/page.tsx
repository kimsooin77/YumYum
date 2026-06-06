'use client';

import { use, useState } from 'react';
import Image from 'next/image';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { snacksApi, reviewsApi, favoritesApi } from '@/lib/api';
import { isLoggedIn } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Heart, Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

interface Props {
  params: Promise<{ id: string }>;
}

const reviewSchema = z.object({
  rating: z.number().min(1).max(5),
  content: z.string().min(1, '리뷰를 입력해주세요').max(500),
});
type ReviewForm = z.infer<typeof reviewSchema>;

export default function SnackDetailPage({ params }: Props) {
  const { id } = use(params);
  const snackId = Number(id);
  const queryClient = useQueryClient();
  const loggedIn = isLoggedIn();

  const { data: snack, isLoading } = useQuery({
    queryKey: ['snack', snackId],
    queryFn: () => snacksApi.detail(snackId),
  });

  const { data: reviews } = useQuery({
    queryKey: ['reviews', snackId],
    queryFn: () => reviewsApi.listBySnack(snackId, { limit: 20 }),
  });

  const addFav = useMutation({
    mutationFn: () => favoritesApi.add(snackId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['snack', snackId] }),
  });

  const removeFav = useMutation({
    mutationFn: () => favoritesApi.remove(snack!.favoriteId!),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['snack', snackId] }),
  });

  const createReview = useMutation({
    mutationFn: (data: ReviewForm) => reviewsApi.create({ snackId, ...data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews', snackId] });
      queryClient.invalidateQueries({ queryKey: ['snack', snackId] });
      reset();
    },
  });

  const deleteReview = useMutation({
    mutationFn: (reviewId: number) => reviewsApi.delete(reviewId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews', snackId] });
      queryClient.invalidateQueries({ queryKey: ['snack', snackId] });
    },
  });

  const [selectedRating, setSelectedRating] = useState(5);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<ReviewForm>({
    resolver: zodResolver(reviewSchema),
    defaultValues: { rating: 5, content: '' },
  });

  if (isLoading) {
    return <div className="animate-pulse space-y-4"><div className="h-64 bg-gray-200 rounded-xl" /><div className="h-8 bg-gray-200 rounded" /></div>;
  }

  if (!snack) return <div className="text-center py-16 text-gray-400">과자를 찾을 수 없습니다</div>;

  const handleFavorite = () => {
    if (!loggedIn) { window.location.href = '/login'; return; }
    if (snack.isFavorited && snack.favoriteId) removeFav.mutate();
    else addFav.mutate();
  };

  const onSubmitReview = (data: ReviewForm) => {
    createReview.mutate({ ...data, rating: selectedRating });
  };

  return (
    <div className="flex flex-col gap-5">
      {/* 이미지 */}
      <div className="relative aspect-square bg-gray-100 rounded-2xl overflow-hidden">
        {snack.imageUrl ? (
          <Image src={snack.imageUrl} alt={snack.name} fill className="object-cover" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-6xl">🍿</div>
        )}
      </div>

      {/* 기본 정보 */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <p className="text-xs text-orange-500 font-medium">{snack.category.name} · {snack.brand.name}</p>
            <h1 className="text-xl font-bold text-gray-900 mt-0.5">{snack.name}</h1>
            {snack.price && (
              <p className="text-lg font-bold text-gray-800 mt-1">{snack.price.toLocaleString()}원</p>
            )}
          </div>
          <button
            onClick={handleFavorite}
            className={cn(
              'p-3 rounded-full transition-colors shrink-0',
              snack.isFavorited ? 'bg-red-50 text-red-500' : 'bg-gray-50 text-gray-400 hover:text-red-400'
            )}
          >
            <Heart className={cn('w-6 h-6', snack.isFavorited && 'fill-current')} />
          </button>
        </div>

        <div className="flex items-center gap-3 mt-3 pt-3 border-t border-gray-100">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
            <span className="font-bold text-gray-900">
              {snack.avgRating > 0 ? snack.avgRating.toFixed(1) : '-'}
            </span>
            <span className="text-sm text-gray-400">({snack.reviewCount}개 리뷰)</span>
          </div>
          <div className="text-sm text-gray-400">
            <Heart className="w-3.5 h-3.5 inline mr-0.5" />
            {snack.favoriteCount}
          </div>
        </div>

        {snack.description && (
          <p className="text-sm text-gray-600 mt-3 leading-relaxed">{snack.description}</p>
        )}

        {snack.releaseDate && (
          <p className="text-xs text-gray-400 mt-2">
            출시일: {new Date(snack.releaseDate).toLocaleDateString('ko-KR')}
          </p>
        )}
      </div>

      {/* 리뷰 작성 */}
      {loggedIn && (
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <h2 className="font-bold text-gray-900 mb-3">리뷰 작성</h2>
          <form onSubmit={handleSubmit(onSubmitReview)} className="flex flex-col gap-3">
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setSelectedRating(star)}
                  className="text-2xl transition-transform hover:scale-110"
                >
                  <Star
                    className={cn(
                      'w-7 h-7',
                      star <= selectedRating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'
                    )}
                  />
                </button>
              ))}
            </div>
            <textarea
              {...register('content')}
              placeholder="과자에 대한 솔직한 리뷰를 남겨주세요 (최대 500자)"
              rows={3}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm resize-none focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-400/20"
            />
            {errors.content && <p className="text-xs text-red-500">{errors.content.message}</p>}
            <Button type="submit" loading={createReview.isPending} size="sm">
              리뷰 등록
            </Button>
          </form>
        </div>
      )}

      {/* 리뷰 목록 */}
      <div className="flex flex-col gap-3">
        <h2 className="font-bold text-gray-900">리뷰 {reviews?.total ?? 0}개</h2>
        {reviews?.data.length === 0 && (
          <div className="text-center py-8 text-gray-400 text-sm">첫 번째 리뷰를 남겨보세요!</div>
        )}
        {reviews?.data.map((review) => (
          <div key={review.id} className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm text-gray-900">{review.user.nickname}</span>
                  <div className="flex">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={cn(
                          'w-3.5 h-3.5',
                          i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'
                        )}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-gray-700 mt-1 leading-relaxed">{review.content}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {new Date(review.createdAt).toLocaleDateString('ko-KR')}
                </p>
              </div>
              {loggedIn && (
                <button
                  onClick={() => deleteReview.mutate(review.id)}
                  className="text-xs text-gray-400 hover:text-red-400 shrink-0"
                >
                  삭제
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
