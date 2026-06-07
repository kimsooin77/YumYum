'use client';

import { useState, Suspense } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams, useRouter } from 'next/navigation';
import { snacksApi, brandsApi } from '@/lib/api';
import SnackCard from '@/components/snack-card';
import { BrandLogo } from '@/components/brand-logo';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { SortDropdown } from '@/components/ui/sort-dropdown';
import { cn } from '@/lib/utils';

const CONVENIENCE_BRANDS = [
  { name: 'CU' },
  { name: 'GS25' },
  { name: '세븐일레븐' },
  { name: '이마트24' },
];

const SORT_OPTIONS = [
  { value: 'newest', label: '최신순' },
  { value: 'popular', label: '인기순' },
];

function ConvenienceContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const { data: brands } = useQuery({
    queryKey: ['brands'],
    queryFn: brandsApi.list,
  });

  const initialBrandId = searchParams.get('brandId') ? Number(searchParams.get('brandId')) : null;
  const [selectedBrandId, setSelectedBrandId] = useState<number | null>(initialBrandId);
  const [sort, setSort] = useState('newest');
  const [page, setPage] = useState(1);

  // Map convenience brand names to their IDs
  const convenienceBrandMap = brands
    ? CONVENIENCE_BRANDS.reduce<Record<string, number>>((acc, { name }) => {
        const found = brands.find((b) => b.name === name);
        if (found) acc[name] = found.id;
        return acc;
      }, {})
    : {};

  // Default to first brand if none selected and brands are loaded
  const effectiveBrandId =
    selectedBrandId ??
    (Object.values(convenienceBrandMap)[0] || null);

  const { data, isLoading } = useQuery({
    queryKey: ['snacks', 'convenience', effectiveBrandId, sort, page],
    queryFn: () => snacksApi.list({ brandId: effectiveBrandId!, sort, page, limit: 20 }),
    enabled: !!effectiveBrandId,
  });

  const handleBrandSelect = (brandId: number) => {
    setSelectedBrandId(brandId);
    setPage(1);
    router.replace(`/convenience?brandId=${brandId}`, { scroll: false });
  };

  const selectedBrandName =
    brands?.find((b) => b.id === effectiveBrandId)?.name ?? '';

  return (
    <div className="flex flex-col gap-4">
      {/* Brand tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {CONVENIENCE_BRANDS.map(({ name }) => {
          const brandId = convenienceBrandMap[name];
          const isSelected = brandId === effectiveBrandId;
          return (
            <button
              key={name}
              onClick={() => brandId && handleBrandSelect(brandId)}
              className={cn(
                'shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all border',
                isSelected
                  ? 'bg-orange-50 border-orange-400 shadow-sm'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-orange-300'
              )}
            >
              <BrandLogo name={name} size={22} />
              <span className={isSelected ? 'text-orange-500' : ''}>{name}</span>
            </button>
          );
        })}
      </div>

      {/* Sort + header */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          <span className="font-semibold text-gray-900">{selectedBrandName}</span> 신상품
          {data && <span className="text-gray-400 ml-1">({data.total}개)</span>}
        </p>
        <SortDropdown
          options={SORT_OPTIONS}
          value={sort}
          onChange={(v) => { setSort(v); setPage(1); }}
        />
      </div>

      {/* Grid */}
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

          {data?.data.length === 0 && (
            <div className="text-center py-16 text-gray-400">
              <p className="text-4xl mb-2">🏪</p>
              <p className="text-sm">등록된 상품이 없습니다</p>
            </div>
          )}

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

export default function ConveniencePage() {
  return (
    <Suspense fallback={<div className="grid grid-cols-2 gap-3">{Array.from({length:8}).map((_,i)=><div key={i} className="bg-white rounded-xl h-52 animate-pulse"/>)}</div>}>
      <ConvenienceContent />
    </Suspense>
  );
}
