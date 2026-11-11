'use client';

import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { STATUSES, type NewApplication } from '@/types/application';
import css from './ApplicationForm.module.css';

interface ApplicationFormProps {
  onSubmit: (values: NewApplication) => void;
}

const today = new Date().toISOString().slice(0, 10);

const initialValues: NewApplication = {
  company: '',
  position: '',
  link: '',
  status: 'applied',
  appliedAt: today,
};

const validationSchema = Yup.object({
  company: Yup.string().trim().required('Company is required'),
  position: Yup.string().trim().required('Position is required'),
  link: Yup.string().trim().url('Enter a valid URL, e.g. https://...'),
  status: Yup.string().oneOf(STATUSES).required(),
  appliedAt: Yup.date().required('Date is required'),
});

export default function ApplicationForm({ onSubmit }: ApplicationFormProps) {
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={(values, actions) => {
        onSubmit(values);
        actions.resetForm();
      }}
    >
      <Form className={css.form}>
        <label className={css.label}>
          Company
          <Field className={css.input} name="company" type="text" />
          <ErrorMessage className={css.error} name="company" component="span" />
        </label>

        <label className={css.label}>
          Position
          <Field className={css.input} name="position" type="text" />
          <ErrorMessage className={css.error} name="position" component="span" />
        </label>

        <label className={css.label}>
          Job link
          <Field className={css.input} name="link" type="text" placeholder="https://..." />
          <ErrorMessage className={css.error} name="link" component="span" />
        </label>

        <label className={css.label}>
          Status
          <Field className={css.input} name="status" as="select">
            {STATUSES.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </Field>
        </label>

        <label className={css.label}>
          Applied on
          <Field className={css.input} name="appliedAt" type="date" />
          <ErrorMessage className={css.error} name="appliedAt" component="span" />
        </label>

        <button className={css.button} type="submit">
          Add application
        </button>
      </Form>
    </Formik>
  );
}