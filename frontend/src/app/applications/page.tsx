'use client';

import { useState } from 'react';
import ApplicationForm from '@/components/ApplicationForm/ApplicationForm';
import ApplicationList from '@/components/ApplicationList/ApplicationList';
import type { Application, NewApplication } from '@/types/application';
import css from './page.module.css';

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);

  const handleAdd = (values: NewApplication) => {
    const now = new Date().toISOString();
    const newApplication: Application = {
      ...values,
      _id: crypto.randomUUID(),
      createdAt: now,
      updatedAt: now,
    };
    setApplications((prev) => [newApplication, ...prev]);
  };

  return (
    <main className={css.main}>
      <h1 className={css.title}>My applications</h1>
      <ApplicationForm onSubmit={handleAdd} />
      <h2 className={css.subtitle}>Applications ({applications.length})</h2>
      <ApplicationList applications={applications} />
    </main>
  );
}