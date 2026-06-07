'use client';

import Image from 'next/image';
import { useState } from 'react';

const BRAND_IMAGE: Record<string, string> = {
  'CU':      '/brands/cu.svg',
  'GS25':    '/brands/gs25.svg',
  '세븐일레븐': '/brands/eleven.png',
  '이마트24':  '/brands/emart24.png',
};

export function BrandLogo({ name, size = 52 }: { name: string; size?: number }) {
  const [imgError, setImgError] = useState(false);
  const src = BRAND_IMAGE[name];

  if (!src || imgError) {
    return (
      <div
        style={{ width: size, height: size }}
        className="rounded-2xl bg-gray-200 flex items-center justify-center text-xl shrink-0"
      >
        🏪
      </div>
    );
  }

  return (
    <div
      style={{ width: size, height: size }}
      className="rounded-2xl overflow-hidden flex items-center justify-center bg-white border border-gray-100 shrink-0"
    >
      <Image
        src={src}
        alt={name}
        width={size}
        height={size}
        className="object-contain w-full h-full"
        onError={() => setImgError(true)}
      />
    </div>
  );
}
