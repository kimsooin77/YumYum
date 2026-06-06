'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { authApi } from '@/lib/api';
import { setToken } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

const schema = z.object({
  email: z.string().email('올바른 이메일을 입력해주세요'),
  password: z.string().min(1, '비밀번호를 입력해주세요'),
});

type FormData = z.infer<typeof schema>;

export default function LoginPage() {
  const router = useRouter();
  const [serverError, setServerError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    try {
      setServerError('');
      const { accessToken } = await authApi.login(data);
      setToken(accessToken);
      router.push('/snacks');
    } catch {
      setServerError('이메일 또는 비밀번호가 올바르지 않습니다.');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <h2 className="text-xl font-bold text-gray-900">로그인</h2>

      <Input
        label="이메일"
        type="email"
        placeholder="example@email.com"
        error={errors.email?.message}
        {...register('email')}
      />
      <Input
        label="비밀번호"
        type="password"
        placeholder="비밀번호 입력"
        error={errors.password?.message}
        {...register('password')}
      />

      {serverError && <p className="text-sm text-red-500">{serverError}</p>}

      <Button type="submit" loading={isSubmitting} className="w-full mt-2">
        로그인
      </Button>

      <p className="text-center text-sm text-gray-500">
        계정이 없으신가요?{' '}
        <Link href="/signup" className="text-orange-500 font-medium hover:underline">
          회원가입
        </Link>
      </p>
    </form>
  );
}
