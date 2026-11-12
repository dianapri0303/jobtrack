import { STATUSES, type ApplicationStatus } from '@/types/application';
import css from './StatusFilter.module.css';

export type StatusFilterValue = ApplicationStatus | 'all';

interface StatusFilterProps {
  value: StatusFilterValue;
  onChange: (value: StatusFilterValue) => void;
}

export default function StatusFilter({ value, onChange }: StatusFilterProps) {
  return (
    <label className={css.label}>
      Show
      <select
        className={css.select}
        value={value}
        onChange={(event) => onChange(event.target.value as StatusFilterValue)}
      >
        <option value="all">all</option>
        {STATUSES.map((status) => (
          <option key={status} value={status}>
            {status}
          </option>
        ))}
      </select>
    </label>
  );
}