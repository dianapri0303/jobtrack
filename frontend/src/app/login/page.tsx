import type { Metadata } from 'next';
import AuthForm from '@/components/AuthForm/AuthForm';

export const metadata: Metadata = {
  title: 'Log in · JobTrack',
};

export default function LoginPage() {
  return <AuthForm mode="login" />;
}