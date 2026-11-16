import { Application, STATUSES } from '../models/application.js';
import { buildSummary } from '../utils/summary.js';

export const getApplications = async (req, res) => {
  const { status } = req.query;
  const filter = { owner: req.userId };
  if (STATUSES.includes(status)) {
    filter.status = status;
  }
  const applications = await Application.find(filter).sort({ appliedAt: -1 });
  res.json(applications);
};

export const getSummary = async (req, res) => {
  const applications = await Application.find({ owner: req.userId })
    .sort({ appliedAt: 1 })
    .lean();
  res.json(buildSummary(applications));
};

export const getApplicationById = async (req, res) => {
  const application = await Application.findOne({ _id: req.params.id, owner: req.userId });
  if (!application) {
    return res.status(404).json({ message: 'Application not found' });
  }
  res.json(application);
};

export const createApplication = async (req, res) => {
  const application = await Application.create({ ...req.body, owner: req.userId });
  res.status(201).json(application);
};

export const updateApplication = async (req, res) => {
  const changes = { ...req.body };
  delete changes.owner;

  const application = await Application.findOneAndUpdate(
    { _id: req.params.id, owner: req.userId },
    changes,
    { returnDocument: 'after', runValidators: true },
  );
  if (!application) {
    return res.status(404).json({ message: 'Application not found' });
  }
  res.json(application);
};

export const deleteApplication = async (req, res) => {
  const application = await Application.findOneAndDelete({
    _id: req.params.id,
    owner: req.userId,
  });
  if (!application) {
    return res.status(404).json({ message: 'Application not found' });
  }
  res.status(204).send();
};