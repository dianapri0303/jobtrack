'use client';

import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import ApplicationForm from '@/components/ApplicationForm/ApplicationForm';
import ApplicationList from '@/components/ApplicationList/ApplicationList';
import StatusFilter, { type StatusFilterValue } from '@/components/StatusFilter/StatusFilter';
import { createApplication, fetchApplications } from '@/lib/api';
import type { NewApplication } from '@/types/application';
import css from './page.module.css';

export default function ApplicationsPage() {
  const [statusFilter, setStatusFilter] = useState<StatusFilterValue>('all');
  const queryClient = useQueryClient();

  const {
    data: applications = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['applications', statusFilter],
    queryFn: () => fetchApplications(statusFilter === 'all' ? undefined : statusFilter),
  });

  const createMutation = useMutation({
    mutationFn: createApplication,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] });
    },
  });

  const handleAdd = async (values: NewApplication) => {
    await createMutation.mutateAsync(values);
  };

  return (
    <main className={css.main}>
      <h1 className={css.title}>My applications</h1>

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