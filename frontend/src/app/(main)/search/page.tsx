'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { snacksApi } from '@/lib/api';
import SnackCard from '@/components/snack-card';
import { Search } from 'lucide-react';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [submitted, setSubmitted] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['search', submitted],
    queryFn: () => snacksApi.search({ q: submitted, limit: 20 }),
    enabled: submitted.length > 0,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(query.trim());
  };

  return (
    <div className="flex flex-col gap-4">
      <form onSubmit={handleSubmit} className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="과자 이름으로 검색..."
          className="w-full pl-9 pr-4 py-3 rounded-xl border border-gray-200 bg-white text-sm focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-400/20 shadow-sm"
        />
      </form>

      {!submitted && (
        <div className="text-center py-16 text-gray-400">
          <Search className="w-10 h-10 mx-auto mb-2 opacity-30" />
          <p className="text-sm">과자 이름을 검색해보세요</p>
        </div>
      )}

      {submitted && isLoading && (
        <div className="grid grid-cols-2 gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl h-52 animate-pulse" />
          ))}
        </div>
      )}

      {submitted && !isLoading && (
        <>
          <p className="text-sm text-gray-500">
            &quot;{submitted}&quot; 검색 결과 {data?.total ?? 0}개
          </p>
          {data?.data.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <p className="text-4xl mb-2">🔍</p>
              <p className="text-sm">검색 결과가 없습니다</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {data?.data.map((snack) => (
                <SnackCard key={snack.id} snack={snack} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
