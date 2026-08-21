'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema } from '@/lib/validators';
import { useAuth } from '@/context/AuthContext';
import AuthLayout from '@/components/templates/AuthLayout';
import GuestRoute from '@/components/guards/GuestRoute';
import FormField from '@/components/molecules/FormField';
import Button from '@/components/atoms/Button';
import { toastSuccess, toastError } from '@/utils/toast';

export default function RegisterPage() {
  const router = useRouter();
  const { register: signup } = useAuth();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values) => {
    setLoading(true);
    try {
      const response = await signup(values);
      if (response.success) {
        toastSuccess('Registration successful.');
        router.replace('/');
      } else {
        toastError(response.message || 'Registration failed.');
      }
    } catch (err) {
      toastError(err, 'Email might already be registered.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <GuestRoute>
      <AuthLayout>
        <div className="space-y-6">
          <div className="space-y-1">
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Create Account
            </h2>
            <p className="text-xs text-slate-400 font-semibold">
              Fill in credentials to register a customer account.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              id="name"
              label="Full Name"
              register={register}
              error={errors.name?.message}
              placeholder="e.g. Sara Ali"
            />

            <FormField
              id="email"
              label="Email Address"
              register={register}
              error={errors.email?.message}
              placeholder="e.g. sara@example.com"
              type="email"
            />

            <FormField
              id="password"
              label="Password"
              register={register}
              error={errors.password?.message}
              placeholder="••••••••"
              type="password"
            />

            <Button
              type="submit"
              isLoading={loading}
              className="w-full py-3.5 font-extrabold shadow-md shadow-teal-500/10 text-xs uppercase tracking-wider mt-2"
            >
              Sign Up 📝
            </Button>
          </form>

          <hr className="border-slate-100" />

          <p className="text-center text-xs text-slate-500">
            Already have an account?{' '}
            <Link href="/login" className="font-bold text-teal-600 hover:underline">
              Login here
            </Link>
          </p>
        </div>
      </AuthLayout>
    </GuestRoute>
  );
}
