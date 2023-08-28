'use client';

import { TextField } from '@/core/ui/zenbuddha/src';
import Button from '@/core/ui/zenbuddha/src/components/Button';
import { useFormik } from 'formik';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { z } from 'zod';
import { toFormikValidate } from 'zod-formik-adapter';

export default function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const loginFormSchema = z.object({
    username: z.string(),
    password: z.string(),
  });

  type LoginRequestType = z.infer<typeof loginFormSchema>;

  const onSubmit = async (values: LoginRequestType) => {
    setIsLoading(true);
    const result = await signIn('credentials', {
      username: values.username,
      password: values.password,
      redirect: false,
    })
      .then((response) => {
        if (response?.error) {
          toast.error('Login Failed! Please check your credentials.');
        } else {
          router.replace('/admin/dashboard');
        }
      })
      .catch((errorResponse) => {
        toast.error('Login Failed! Please check your credentials.');
      });
    setIsLoading(false);
  };

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
    },
    validate: toFormikValidate(loginFormSchema),
    onSubmit,
  });

  return (
    <form
      className="flex flex-col"
      onSubmit={(e) => {
        e.preventDefault();
        formik.handleSubmit(e);
      }}
    >
      <div className="font-bold text-xl">Login to your account</div>
      <div className="text-sm mb-4">
        Sign in by entering the information below.
      </div>
      <TextField
        placeholder="Your username"
        id="username"
        type="text"
        label="Username"
        {...formik.getFieldProps('username')}
      />
      {!!formik.errors.username && (
        <div className="text-red-500">{formik.errors.username}</div>
      )}

      <TextField
        placeholder="•••••••••••"
        id="password"
        type="password"
        className="mt-2"
        label="Password"
        {...formik.getFieldProps('password')}
      />
      {!!formik.errors.password && (
        <div className="text-red-500">{formik.errors.password}</div>
      )}
      <Button
        text="Login"
        type="submit"
        isLoading={isLoading}
        className="mt-4 font-bold"
      />
    </form>
  );
}
