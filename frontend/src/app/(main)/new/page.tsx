'use client';

import { useState, Suspense } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams, useRouter } from 'next/navigation';
import { snacksApi } from '@/lib/api';
import type { Snack } from '@/types';
import SnackCard from '@/components/snack-card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

type DateRange = 'today' | 'week' | 'month';

const RANGE_OPTIONS: { value: DateRange; label: string; desc: string }[] = [
  { value: 'today', label: '오늘', desc: '오늘 출시' },
  { value: 'week', label: '이번주', desc: '7일 이내' },
  { value: 'month', label: '이번달', desc: '30일 이내' },
];

function NewArrivalsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialRange = (searchParams.get('range') as DateRange) ?? 'week';
  const [range, setRange] = useState<DateRange>(initialRange);
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ['snacks', 'new', range, page],
    queryFn: () => snacksApi.list({ dateRange: range, sort: 'newest', page, limit: 20 }),
  });

  const handleRangeChange = (r: DateRange) => {
    setRange(r);
    setPage(1);
    router.replace(`/new?range=${r}`, { scroll: false });
  };

  // Group snacks by releaseDate
  const grouped = (data?.data ?? []).reduce<Record<string, Snack[]>>((acc, snack) => {
    const dateKey = snack.releaseDate
      ? new Date(snack.releaseDate).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })
      : '날짜 미정';
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(snack);
    return acc;
  }, {});

  return (
    <div className="flex flex-col gap-4">
      {/* Range filter */}
      <div className="flex gap-2 bg-gray-50 rounded-xl p-1">
        {RANGE_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => handleRangeChange(opt.value)}
            className={cn(
              'flex-1 py-2 rounded-lg text-sm font-medium transition-all',
              range === opt.value
                ? 'bg-white text-orange-500 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            )}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="grid grid-cols-2 gap-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl h-52 animate-pulse" />
          ))}
        </div>
      ) : Object.keys(grouped).length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-4xl mb-2">🍪</p>
          <p className="text-sm">해당 기간에 등록된 상품이 없습니다</p>
        </div>
      ) : (
        <>
          {Object.entries(grouped).map(([date, snacks]) => (
            <section key={date}>
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-xs font-semibold text-gray-600">{date}</h3>
                <span className="text-xs text-gray-400">({snacks.length}개)</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {snacks.map((snack) => (
                  <SnackCard key={snack.id} snack={snack} />
                ))}
              </div>
            </section>
          ))}

          {data && data.totalPages > 1 && (
            <div className="flex items-center justify-center gap-4 mt-2">
              <Button variant="ghost" size="sm" onClick={() => setPage((p) => p - 1)} disabled={page === 1}>
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <span className="text-sm text-gray-600">{page} / {data.totalPages}</span>
              <Button variant="ghost" size="sm" onClick={() => setPage((p) => p + 1)} disabled={page === data.totalPages}>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default function NewArrivalsPage() {
  return (
    <Suspense fallback={<div className="grid grid-cols-2 gap-3">{Array.from({length:8}).map((_,i)=><div key={i} className="bg-white rounded-xl h-52 animate-pulse"/>)}</div>}>
      <NewArrivalsContent />
    </Suspense>
  );
}
