import { Application } from '../models/application.js';

export const getApplications = async (req, res) => {
  const applications = await Application.find().sort({ appliedAt: -1 });
  res.json(applications);
};

export const getApplicationById = async (req, res) => {
  const application = await Application.findById(req.params.id);
  if (!application) {
    return res.status(404).json({ message: 'Application not found' });
  }
  res.json(application);
};

export const createApplication = async (req, res) => {
  const application = await Application.create(req.body);
  res.status(201).json(application);
};

export const updateApplication = async (req, res) => {
  const application = await Application.findByIdAndUpdate(req.params.id, req.body, {
    returnDocument: 'after',
    runValidators: true,
  });
  if (!application) {
    return res.status(404).json({ message: 'Application not found' });
  }
  res.json(application);
};

export const deleteApplication = async (req, res) => {
  const application = await Application.findByIdAndDelete(req.params.id);
  if (!application) {
    return res.status(404).json({ message: 'Application not found' });
  }
  res.status(204).send();
};