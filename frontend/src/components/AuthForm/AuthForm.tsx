'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { isAxiosError } from 'axios';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { login, register } from '@/lib/api';
import { saveSession } from '@/lib/auth';
import type { Credentials } from '@/types/auth';
import css from './AuthForm.module.css';

interface AuthFormProps {
  mode: 'login' | 'register';
}

const initialValues: Credentials = { email: '', password: '' };

const validationSchema = Yup.object({
  email: Yup.string().trim().email('Enter a valid email').required('Email is required'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .required('Password is required'),
});

export default function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const [serverError, setServerError] = useState('');
  const isLogin = mode === 'login';

  const handleSubmit = async (values: Credentials) => {
    setServerError('');
    try {
      const data = isLogin ? await login(values) : await register(values);
      saveSession(data.token, data.user.email);
      router.push('/applications');
    } catch (error) {
      const message =
        isAxiosError(error) && error.response?.data?.message
          ? error.response.data.message
          : 'Something went wrong. Please try again.';
      setServerError(message);
    }
  };

  return (
    <main className={css.main}>
      <div className={css.card}>
        <h1 className={css.title}>{isLogin ? 'Log in to JobTrack' : 'Create your account'}</h1>

        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
          {({ isSubmitting }) => (
            <Form className={css.form}>
              <label className={css.label}>
                Email
                <Field className={css.input} name="email" type="email" autoComplete="email" />
                <ErrorMessage className={css.error} name="email" component="span" />
              </label>

              <label className={css.label}>
                Password
                <Field
                  className={css.input}
                  name="password"
                  type="password"
                  autoComplete={isLogin ? 'current-password' : 'new-password'}
                />
                <ErrorMessage className={css.error} name="password" component="span" />
              </label>

              {serverError && <p className={css.serverError}>{serverError}</p>}

              <button className={css.button} type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Please wait...' : isLogin ? 'Log in' : 'Sign up'}
              </button>
            </Form>
          )}
        </Formik>

        <p className={css.switch}>
          {isLogin ? 'No account yet? ' : 'Already have an account? '}
          <Link className={css.link} href={isLogin ? '/register' : '/login'}>
            {isLogin ? 'Sign up' : 'Log in'}
          </Link>
        </p>
      </div>
    </main>
  );
}