export const MONTHLY_GOAL = 30;
export const FOLLOW_UP_AFTER_DAYS = 7;

const DAY_MS = 24 * 60 * 60 * 1000;
const ACTIVE_STATUSES = ['applied', 'interview'];

export const needsFollowUp = (application, now = new Date()) => {
  if (!ACTIVE_STATUSES.includes(application.status)) {
    return false;
  }

  const endOfToday = new Date(now);
  endOfToday.setHours(23, 59, 59, 999);

  if (application.followUpDate) {
    return new Date(application.followUpDate) <= endOfToday;
  }

  if (application.status !== 'applied') {
    return false;
  }

  const daysSinceApplied = (now - new Date(application.appliedAt)) / DAY_MS;
  return daysSinceApplied >= FOLLOW_UP_AFTER_DAYS;
};

export const buildSummary = (applications, now = new Date()) => {
  const year = now.getFullYear();
  const month = now.getMonth();

  const thisMonth = applications.filter((app) => {
    const date = new Date(app.appliedAt);
    return date.getFullYear() === year && date.getMonth() === month;
  });

  const byStatus = { applied: 0, interview: 0, offer: 0, rejected: 0 };
  thisMonth.forEach((app) => {
    byStatus[app.status] += 1;
  });

  return {
    month: `${year}-${String(month + 1).padStart(2, '0')}`,
    goal: MONTHLY_GOAL,
    appliedThisMonth: thisMonth.length,
    remaining: Math.max(MONTHLY_GOAL - thisMonth.length, 0),
    byStatus,
    followUps: applications.filter((app) => needsFollowUp(app, now)),
  };
};