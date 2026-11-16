import type { Metadata } from 'next';
import AuthForm from '@/components/AuthForm/AuthForm';

export const metadata: Metadata = {
  title: 'Sign up · JobTrack',
};

export default function RegisterPage() {
  return <AuthForm mode="register" />;
}