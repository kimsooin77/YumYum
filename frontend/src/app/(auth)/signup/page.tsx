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
  nickname: z.string().min(2, '닉네임은 2자 이상이어야 합니다').max(20, '닉네임은 20자 이하여야 합니다'),
  password: z.string().min(6, '비밀번호는 6자 이상이어야 합니다'),
  confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, {
  message: '비밀번호가 일치하지 않습니다',
  path: ['confirmPassword'],
});

type FormData = z.infer<typeof schema>;

export default function SignupPage() {
  const router = useRouter();
  const [serverError, setServerError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async ({ email, nickname, password }: FormData) => {
    try {
      setServerError('');
      const { accessToken } = await authApi.signup({ email, nickname, password });
      setToken(accessToken);
      router.push('/snacks');
    } catch (err: any) {
      const msg = err?.response?.data?.message;
      setServerError(Array.isArray(msg) ? msg[0] : msg ?? '회원가입에 실패했습니다.');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <h2 className="text-xl font-bold text-gray-900">회원가입</h2>

      <Input
        label="이메일"
        type="email"
        placeholder="example@email.com"
        error={errors.email?.message}
        {...register('email')}
      />
      <Input
        label="닉네임"
        placeholder="2~20자"
        error={errors.nickname?.message}
        {...register('nickname')}
      />
      <Input
        label="비밀번호"
        type="password"
        placeholder="6자 이상"
        error={errors.password?.message}
        {...register('password')}
      />
      <Input
        label="비밀번호 확인"
        type="password"
        placeholder="비밀번호 재입력"
        error={errors.confirmPassword?.message}
        {...register('confirmPassword')}
      />

      {serverError && <p className="text-sm text-red-500">{serverError}</p>}

      <Button type="submit" loading={isSubmitting} className="w-full mt-2">
        회원가입
      </Button>

      <p className="text-center text-sm text-gray-500">
        이미 계정이 있으신가요?{' '}
        <Link href="/login" className="text-orange-500 font-medium hover:underline">
          로그인
        </Link>
      </p>
    </form>
  );
}
