'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { snacksApi, recommendationsApi, brandsApi } from '@/lib/api';
import SnackCard from '@/components/snack-card';
import { BrandLogo } from '@/components/brand-logo';
import { isLoggedIn } from '@/lib/auth';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const CONVENIENCE_BRANDS = ['CU', 'GS25', '세븐일레븐', '이마트24'];

const SORT_OPTIONS = [
  { value: 'newest', label: '최신순' },
  { value: 'popular', label: '인기순' },
  { value: 'rating', label: '평점순' },
];

export default function HomePage() {
  const [sort, setSort] = useState('newest');
  const loggedIn = isLoggedIn();

  return (
    <div className="flex flex-col gap-6">
      <TodaySection />
      <ConvenienceShortcuts />
      <PopularSection sort={sort} onSortChange={setSort} />
      {loggedIn && <RecommendationsSection />}
    </div>
  );
}

function TodaySection() {
  const { data } = useQuery({
    queryKey: ['snacks', 'today'],
    queryFn: () => snacksApi.list({ dateRange: 'today', sort: 'newest', limit: 10 }),
  });

  const snacks = data?.data ?? [];

  return (
    <section>
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-sm font-bold text-gray-800">
          🔥 오늘의 신상
          {snacks.length > 0 && (
            <span className="ml-1.5 text-xs font-normal text-orange-500">{snacks.length}개</span>
          )}
        </h2>
        <Link href="/new?range=today" className="flex items-center gap-0.5 text-xs text-gray-400 hover:text-orange-500">
          더보기 <ChevronRight className="w-3 h-3" />
        </Link>
      </div>
      {snacks.length === 0 ? (
        <div className="bg-orange-50 rounded-xl p-4 text-center">
          <p className="text-sm text-orange-400">오늘 등록된 신상품이 없어요</p>
          <Link href="/new?range=week" className="text-xs text-orange-500 font-medium mt-1 inline-block">
            이번주 신상 보기 →
          </Link>
        </div>
      ) : (
        <div className="flex gap-3 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-none">
          {snacks.map((snack) => (
            <div key={snack.id} className="shrink-0 w-36">
              <SnackCard snack={snack} />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

function ConvenienceShortcuts() {
  const { data: brands } = useQuery({
    queryKey: ['brands'],
    queryFn: brandsApi.list,
  });

  const convenienceBrands = brands?.filter((b) => CONVENIENCE_BRANDS.includes(b.name)) ?? [];

  return (
    <section>
      <h2 className="text-sm font-bold text-gray-800 mb-2">🏪 편의점별 탐색</h2>
      <div className="grid grid-cols-4 gap-2">
        {CONVENIENCE_BRANDS.map((name) => {
          const brand = convenienceBrands.find((b) => b.name === name);
          return (
            <Link
              key={name}
              href={brand ? `/convenience?brandId=${brand.id}` : '/convenience'}
              className="flex flex-col items-center gap-1.5 py-1 hover:opacity-75 transition-opacity"
            >
              <BrandLogo name={name} size={52} />
              <span className="text-xs font-medium text-gray-700">{name}</span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

function PopularSection({ sort, onSortChange }: { sort: string; onSortChange: (s: string) => void }) {
  const { data, isLoading } = useQuery({
    queryKey: ['snacks', 'home', sort],
    queryFn: () => snacksApi.list({ dateRange: 'month', sort, limit: 8 }),
  });

  return (
    <section>
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-sm font-bold text-gray-800">📈 이번달 신상품</h2>
        <div className="flex gap-2">
          {SORT_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => onSortChange(opt.value)}
              className={cn(
                'text-xs transition-colors',
                sort === opt.value ? 'text-orange-500 font-semibold' : 'text-gray-400'
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
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
          {data?.data.length === 0 && (
            <div className="text-center py-10 text-gray-400 text-sm">이번달 신상품이 없습니다</div>
          )}
          <Link
            href="/new?range=month"
            className="mt-3 flex items-center justify-center gap-1 text-sm text-orange-500 font-medium hover:underline"
          >
            전체 보기 <ChevronRight className="w-4 h-4" />
          </Link>
        </>
      )}
    </section>
  );
}

function RecommendationsSection() {
  const { data: recommendations } = useQuery({
    queryKey: ['recommendations'],
    queryFn: () => recommendationsApi.get(5),
  });

  if (!recommendations?.length) return null;

  return (
    <section>
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-sm font-bold text-gray-800">🤖 AI 추천</h2>
        <Link href="/profile" className="flex items-center gap-0.5 text-xs text-gray-400 hover:text-orange-500">
          더보기 <ChevronRight className="w-3 h-3" />
        </Link>
      </div>
      <div className="flex gap-3 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-none">
        {recommendations.map((snack) => (
          <div key={snack.id} className="shrink-0 w-36">
            <SnackCard snack={snack} />
          </div>
        ))}
      </div>
    </section>
  );
}

