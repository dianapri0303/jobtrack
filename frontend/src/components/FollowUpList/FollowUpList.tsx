import type { Application } from '@/types/application';
import css from './FollowUpList.module.css';

interface FollowUpListProps {
  applications: Application[];
  onDone: (id: string) => void;
  isUpdating: boolean;
}

const formatDate = (value: string) => new Date(value).toLocaleDateString('en-GB');

export default function FollowUpList({ applications, onDone, isUpdating }: FollowUpListProps) {
  return (
    <section className={css.section}>
      <h2 className={css.title}>Follow up today ({applications.length})</h2>

      {applications.length === 0 ? (
        <p className={css.empty}>Nobody to follow up today.</p>
      ) : (
        <ul className={css.list}>
          {applications.map((app) => (
            <li key={app._id} className={css.item}>
              <div>
                <p className={css.company}>{app.company}</p>
                <p className={css.details}>
                  {app.position} · applied {formatDate(app.appliedAt)}
                  {app.followUpDate && ` · follow-up due ${formatDate(app.followUpDate)}`}
                </p>
              </div>
              <button
                className={css.button}
                type="button"
                disabled={isUpdating}
                onClick={() => onDone(app._id)}
              >
                Followed up
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}