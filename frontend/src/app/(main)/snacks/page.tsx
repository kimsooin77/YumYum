'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { snacksApi, categoriesApi } from '@/lib/api';
import SnackCard from '@/components/snack-card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const SORT_OPTIONS = [
  { value: 'newest', label: '최신순' },
  { value: 'rating', label: '평점순' },
  { value: 'popular', label: '인기순' },
];

export default function SnacksPage() {
  const [page, setPage] = useState(1);
  const [categoryId, setCategoryId] = useState<number | undefined>();
  const [sort, setSort] = useState('newest');

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: categoriesApi.list,
  });

  const { data, isLoading } = useQuery({
    queryKey: ['snacks', page, categoryId, sort],
    queryFn: () => snacksApi.list({ page, limit: 12, categoryId, sort }),
  });

  return (
    <div className="flex flex-col gap-4">
      {/* 신상품 배너 */}
      <NewArrivalsSection />

      {/* 카테고리 필터 */}
      <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-none">
        <button
          onClick={() => { setCategoryId(undefined); setPage(1); }}
          className={cn(
            'shrink-0 px-3 py-1.5 rounded-full text-sm font-medium transition-colors',
            !categoryId ? 'bg-orange-500 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-orange-300'
          )}
        >
          전체
        </button>
        {categories?.map((cat) => (
          <button
            key={cat.id}
            onClick={() => { setCategoryId(cat.id); setPage(1); }}
            className={cn(
              'shrink-0 px-3 py-1.5 rounded-full text-sm font-medium transition-colors',
              categoryId === cat.id ? 'bg-orange-500 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-orange-300'
            )}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* 정렬 */}
      <div className="flex gap-2">
        {SORT_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => setSort(opt.value)}
            className={cn(
              'text-sm transition-colors',
              sort === opt.value ? 'text-orange-500 font-medium' : 'text-gray-400'
            )}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* 과자 목록 */}
      {isLoading ? (
        <div className="grid grid-cols-2 gap-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl h-52 animate-pulse" />
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-3">
            {data?.data.map((snack) => (
              <SnackCard key={snack.id} snack={snack} />
            ))}
          </div>

          {data && data.totalPages > 1 && (
            <div className="flex items-center justify-center gap-4 mt-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setPage((p) => p - 1)}
                disabled={page === 1}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <span className="text-sm text-gray-600">
                {page} / {data.totalPages}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setPage((p) => p + 1)}
                disabled={page === data.totalPages}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          )}

          {data?.data.length === 0 && (
            <div className="text-center py-16 text-gray-400">
              <p className="text-4xl mb-2">🍪</p>
              <p className="text-sm">등록된 과자가 없습니다</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function NewArrivalsSection() {
  const { data: newSnacks } = useQuery({
    queryKey: ['snacks', 'new'],
    queryFn: () => snacksApi.newArrivals(6),
  });

  if (!newSnacks?.length) return null;

  return (
    <div>
      <h2 className="text-sm font-bold text-gray-700 mb-2">🆕 신상 과자</h2>
      <div className="flex gap-3 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-none">
        {newSnacks.map((snack) => (
          <div key={snack.id} className="shrink-0 w-32">
            <SnackCard snack={snack} />
          </div>
        ))}
      </div>
    </div>
  );
}
