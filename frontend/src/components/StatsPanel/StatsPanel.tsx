import type { Summary } from '@/types/application';
import css from './StatsPanel.module.css';

interface StatsPanelProps {
  summary: Summary;
}

export default function StatsPanel({ summary }: StatsPanelProps) {
  const progress = Math.min((summary.appliedThisMonth / summary.goal) * 100, 100);

  return (
    <section className={css.panel}>
      <div className={css.top}>
        <h2 className={css.title}>This month ({summary.month})</h2>
        <p className={css.count}>
          {summary.appliedThisMonth} / {summary.goal} applications
        </p>
      </div>

      <div
        className={css.bar}
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={summary.goal}
        aria-valuenow={summary.appliedThisMonth}
      >
        <div className={css.fill} style={{ width: `${progress}%` }} />
      </div>

      <p className={css.remaining}>
        {summary.remaining === 0
          ? 'Monthly goal reached!'
          : `${summary.remaining} more to reach your monthly goal`}
      </p>

      <ul className={css.statuses}>
        {Object.entries(summary.byStatus).map(([status, count]) => (
          <li key={status} className={css.status}>
            <span className={css.statusName}>{status}</span>
            <span className={css.statusCount}>{count}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}