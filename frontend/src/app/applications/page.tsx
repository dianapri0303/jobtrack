'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import ApplicationForm from '@/components/ApplicationForm/ApplicationForm';
import ApplicationList from '@/components/ApplicationList/ApplicationList';
import FollowUpList from '@/components/FollowUpList/FollowUpList';
import StatsPanel from '@/components/StatsPanel/StatsPanel';
import StatusFilter, { type StatusFilterValue } from '@/components/StatusFilter/StatusFilter';
import {
  createApplication,
  fetchApplications,
  fetchSummary,
  updateApplication,
} from '@/lib/api';
import { clearSession, getEmail, getToken } from '@/lib/auth';
import type { NewApplication } from '@/types/application';
import css from './page.module.css';

const FOLLOW_UP_AFTER_DAYS = 7;

const getNextFollowUpDate = () => {
  const date = new Date();
  date.setDate(date.getDate() + FOLLOW_UP_AFTER_DAYS);
  return date.toISOString().slice(0, 10);
};

export default function ApplicationsPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isReady, setIsReady] = useState(false);
  const [email, setEmail] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<StatusFilterValue>('all');

  useEffect(() => {
    if (!getToken()) {
      router.replace('/login');
      return;
    }
    setEmail(getEmail());
    setIsReady(true);
  }, [router]);

  const {
    data: applications = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['applications', 'list', statusFilter],
    queryFn: () => fetchApplications(statusFilter === 'all' ? undefined : statusFilter),
    enabled: isReady,
  });

  const { data: summary } = useQuery({
    queryKey: ['applications', 'summary'],
    queryFn: fetchSummary,
    enabled: isReady,
  });

  const refreshAll = () => queryClient.invalidateQueries({ queryKey: ['applications'] });

  const createMutation = useMutation({
    mutationFn: createApplication,
    onSuccess: refreshAll,
  });

  const followUpMutation = useMutation({
    mutationFn: (id: string) => updateApplication(id, { followUpDate: getNextFollowUpDate() }),
    onSuccess: refreshAll,
  });

  const handleAdd = async (values: NewApplication) => {
    await createMutation.mutateAsync(values);
  };

  const handleLogout = () => {
    clearSession();
    queryClient.clear();
    router.replace('/login');
  };

  if (!isReady) {
    return null;
  }

  return (
    <main className={css.main}>
      <div className={css.topBar}>
        <h1 className={css.title}>My applications</h1>
        <div className={css.user}>
          <span className={css.email}>{email}</span>
          <button className={css.logout} type="button" onClick={handleLogout}>
            Log out
          </button>
        </div>
      </div>

      {summary && <StatsPanel summary={summary} />}

      {summary && (
        <FollowUpList
          applications={summary.followUps}
          onDone={(id) => followUpMutation.mutate(id)}
          isUpdating={followUpMutation.isPending}
        />
      )}
      {followUpMutation.isError && (
        <p className={css.error}>Could not update the follow-up date. Please try again.</p>
      )}

      <ApplicationForm onSubmit={handleAdd} />
      {createMutation.isError && (
        <p className={css.error}>Could not save the application. Please try again.</p>
      )}

      <div className={css.header}>
        <h2 className={css.subtitle}>Applications ({applications.length})</h2>
        <StatusFilter value={statusFilter} onChange={setStatusFilter} />
      </div>

      {isLoading && <p>Loading...</p>}
      {isError && <p className={css.error}>Could not load applications. Is the API running?</p>}
      {!isLoading && !isError && <ApplicationList applications={applications} />}
    </main>
  );
}