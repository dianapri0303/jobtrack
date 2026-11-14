import { test } from 'node:test';
import assert from 'node:assert/strict';
import { needsFollowUp, buildSummary } from './summary.js';

const now = new Date('2026-11-14T12:00:00Z');

test('applied 7+ days ago without a follow-up date needs a follow-up', () => {
  const application = { status: 'applied', appliedAt: '2026-11-03T12:00:00Z' };
  assert.equal(needsFollowUp(application, now), true);
});

test('applied 2 days ago does not need a follow-up yet', () => {
  const application = { status: 'applied', appliedAt: '2026-11-12T12:00:00Z' };
  assert.equal(needsFollowUp(application, now), false);
});

test('follow-up date today needs a follow-up', () => {
  const application = {
    status: 'interview',
    appliedAt: '2026-11-10T12:00:00Z',
    followUpDate: '2026-11-14T00:00:00Z',
  };
  assert.equal(needsFollowUp(application, now), true);
});

test('rejected application never needs a follow-up', () => {
  const application = {
    status: 'rejected',
    appliedAt: '2026-10-01T12:00:00Z',
    followUpDate: '2026-11-01T00:00:00Z',
  };
  assert.equal(needsFollowUp(application, now), false);
});

test('buildSummary counts only applications from this month', () => {
  const summary = buildSummary(
    [
      { status: 'applied', appliedAt: '2026-11-01T12:00:00Z' },
      { status: 'interview', appliedAt: '2026-11-10T12:00:00Z' },
      { status: 'applied', appliedAt: '2026-10-20T12:00:00Z' },
    ],
    now,
  );
  assert.equal(summary.month, '2026-11');
  assert.equal(summary.appliedThisMonth, 2);
  assert.equal(summary.remaining, 28);
  assert.equal(summary.byStatus.interview, 1);
});