import type { Application } from '@/types/application';
import css from './ApplicationList.module.css';

interface ApplicationListProps {
  applications: Application[];
}

export default function ApplicationList({ applications }: ApplicationListProps) {
  if (applications.length === 0) {
    return <p className={css.empty}>No applications yet. Add your first one above.</p>;
  }

  return (
    <ul className={css.list}>
      {applications.map((app) => (
        <li key={app._id} className={css.item}>
          <div>
            <h3 className={css.company}>{app.company}</h3>
            <p className={css.position}>{app.position}</p>
          </div>
          <div className={css.meta}>
            <span className={`${css.status} ${css[app.status]}`}>{app.status}</span>
            <span className={css.date}>
              {new Date(app.appliedAt).toLocaleDateString('en-GB')}
            </span>
            {app.link && (
              <a className={css.link} href={app.link} target="_blank" rel="noopener noreferrer">
                View job
              </a>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}