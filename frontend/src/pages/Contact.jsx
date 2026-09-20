import React, { useState } from 'react';
import API from '../api/axios'; // আপনার তৈরি করা axios ইনস্ট্যান্স ইমপোর্ট করুন

/* ------------------------------------------------------------------ */
/* Config: edit these values, the layout updates automatically        */
/* ------------------------------------------------------------------ */

const TOPICS = ['General question', 'News tip', 'Feedback', 'Advertising'];
const MESSAGE_MAX = 500;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const INITIAL_VALUES = { topic: TOPICS[0], name: '', email: '', message: '' };

const CONTACT_DETAILS = [
  {
    label: 'Office',
    value: '123 News Avenue, Media District, Dhaka',
    icon: PinIcon,
  },
  {
    label: 'Email',
    value: 'support@dailynewsportal.com',
    href: 'mailto:support@dailynewsportal.com',
    icon: MailIcon,
  },
  {
    label: 'Phone',
    value: '+880 1234 567890',
    href: 'tel:+8801234567890',
    icon: PhoneIcon,
  },
  {
    label: 'Office hours',
    value: 'Sunday to Thursday, 9:00 am to 6:00 pm',
    icon: ClockIcon,
  },
];

/* ------------------------------------------------------------------ */
/* API call                                                           */
/* ------------------------------------------------------------------ */

async function sendMessage(payload) {
  try {
    // baseURL-এ ইতিমধ্যে '/api' যুক্ত থাকলে এখানে শুধু '/contact' দিলেই হবে
    const response = await API.post('/contact', payload);
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Request failed';
    throw new Error(errorMessage);
  }
}

/* ------------------------------------------------------------------ */
/* Validation                                                         */
/* ------------------------------------------------------------------ */

function validate(values) {
  const errors = {};
  if (values.name.trim().length < 2) {
    errors.name = 'Enter your full name.';
  }
  if (!values.email.trim()) {
    errors.email = 'Enter your email address.';
  } else if (!EMAIL_PATTERN.test(values.email.trim())) {
    errors.email = 'Enter a valid email address, like name@example.com.';
  }
  if (values.message.trim().length < 10) {
    errors.message = 'Write at least 10 characters so we can help you properly.';
  }
  return errors;
}

/* ------------------------------------------------------------------ */
/* Small UI helpers                                                   */
/* ------------------------------------------------------------------ */

const inputClass = (hasError) =>
  `w-full rounded-lg border bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 transition focus:outline-none focus:ring-2 ${
    hasError
      ? 'border-red-400 focus:border-red-500 focus:ring-red-200'
      : 'border-slate-300 focus:border-blue-600 focus:ring-blue-200'
  }`;

function Field({ id, label, error, hint, children }) {
  return (
    <div>
      <div className="mb-1.5 flex items-baseline justify-between gap-3">
        <label htmlFor={id} className="text-sm font-semibold text-slate-800">
          {label}
        </label>
        {hint}
      </div>
      {children}
      {error && (
        <p id={`${id}-error`} className="mt-1.5 text-xs font-medium text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                               */
/* ------------------------------------------------------------------ */

export default function Contact() {
  const [values, setValues] = useState(INITIAL_VALUES);
  const [touched, setTouched] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const errors = validate(values);
  const showError = (field) => (touched[field] ? errors[field] : undefined);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched({ name: true, email: true, message: true });
    if (Object.keys(errors).length > 0) return;

    setSubmitting(true);
    setSubmitError('');
    try {
      await sendMessage({
        topic: values.topic,
        name: values.name.trim(),
        email: values.email.trim(),
        message: values.message.trim(),
      });
      setSubmitted(true);
      setValues(INITIAL_VALUES);
      setTouched({});
    } catch (err) {
      setSubmitError(err.message || 'Your message could not be sent. Check your connection and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="bg-slate-50">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 md:py-16">
        {/* Page heading */}
        <header className="mb-10 max-w-2xl">
          <h1 className="font-serif text-4xl font-bold tracking-tight text-slate-900 md:text-5xl">
            Contact the newsroom
          </h1>
          <p className="mt-4 text-base leading-relaxed text-slate-600">
            Send us a question, a correction, or a story tip. We read every message and reply
            within one working day.
          </p>
        </header>

        <div className="grid overflow-hidden rounded-2xl bg-white shadow-xl ring-1 ring-slate-900/5 lg:grid-cols-5">
          {/* Contact details panel */}
          <div className="flex flex-col justify-between bg-slate-900 p-8 text-white md:p-10 lg:col-span-2">
            <div>
              <h2 className="font-serif text-2xl font-bold">Reach us directly</h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-300">
                Prefer to skip the form? Use any of these.
              </p>

              <ul className="mt-8 space-y-6">
                {CONTACT_DETAILS.map(({ label, value, href, icon: Icon }) => (
                  <li key={label} className="flex items-start gap-4">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/10 text-blue-200">
                      <Icon className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="text-xs font-medium text-slate-400">{label}</p>
                      {href ? (
                        <a
                          href={href}
                          className="mt-0.5 block text-sm text-white underline-offset-4 hover:underline focus:outline-none focus-visible:underline"
                        >
                          {value}
                        </a>
                      ) : (
                        <p className="mt-0.5 text-sm text-white">{value}</p>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <p className="mt-10 border-t border-white/10 pt-6 text-sm leading-relaxed text-slate-300">
              Sending a news tip? Include where and when it happened, plus any links or photos
              you have.
            </p>
          </div>

          {/* Form panel */}
          <div className="p-8 md:p-10 lg:col-span-3">
            {submitted ? (
              <div
                role="status"
                className="flex min-h-[24rem] flex-col items-center justify-center text-center"
              >
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-green-700">
                  <CheckIcon className="h-7 w-7" />
                </span>
                <h2 className="mt-5 font-serif text-2xl font-bold text-slate-900">Message sent</h2>
                <p className="mt-2 max-w-sm text-sm leading-relaxed text-slate-600">
                  Thanks for writing to us. We will reply to your email within one working day.
                </p>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="mt-6 rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-300 focus-visible:ring-offset-2"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="space-y-6">
                {/* Topic */}
                <fieldset>
                  <legend className="mb-2 text-sm font-semibold text-slate-800">
                    What is this about?
                  </legend>
                  <div className="flex flex-wrap gap-2">
                    {TOPICS.map((topic) => (
                      <label key={topic} className="cursor-pointer">
                        <input
                          type="radio"
                          name="topic"
                          value={topic}
                          checked={values.topic === topic}
                          onChange={handleChange}
                          className="peer sr-only"
                        />
                        <span className="inline-block rounded-full border border-slate-300 px-4 py-2 text-sm text-slate-700 transition peer-checked:border-blue-700 peer-checked:bg-blue-700 peer-checked:text-white peer-focus-visible:ring-2 peer-focus-visible:ring-blue-300 peer-focus-visible:ring-offset-2">
                          {topic}
                        </span>
                      </label>
                    ))}
                  </div>
                </fieldset>

                {/* Name + email */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <Field id="name" label="Full name" error={showError('name')}>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      autoComplete="name"
                      placeholder="Your name"
                      value={values.name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      aria-invalid={Boolean(showError('name'))}
                      aria-describedby={showError('name') ? 'name-error' : undefined}
                      className={inputClass(showError('name'))}
                    />
                  </Field>

                  <Field id="email" label="Email address" error={showError('email')}>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      placeholder="you@example.com"
                      value={values.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      aria-invalid={Boolean(showError('email'))}
                      aria-describedby={showError('email') ? 'email-error' : undefined}
                      className={inputClass(showError('email'))}
                    />
                  </Field>
                </div>

                {/* Message */}
                <Field
                  id="message"
                  label="Message"
                  error={showError('message')}
                  hint={
                    <span className="text-xs tabular-nums text-slate-500">
                      {values.message.length}/{MESSAGE_MAX}
                    </span>
                  }
                >
                  <textarea
                    id="message"
                    name="message"
                    rows={6}
                    maxLength={MESSAGE_MAX}
                    placeholder="Tell us how we can help"
                    value={values.message}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    aria-invalid={Boolean(showError('message'))}
                    aria-describedby={showError('message') ? 'message-error' : undefined}
                    className={`${inputClass(showError('message'))} resize-none`}
                  />
                </Field>

                {submitError && (
                  <p
                    role="alert"
                    className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                  >
                    {submitError}
                  </p>
                )}

                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-xs leading-relaxed text-slate-500 sm:max-w-xs">
                    We only use your email address to reply to this message.
                  </p>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-blue-700 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-300 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                  >
                    {submitting && (
                      <svg
                        className="h-4 w-4 animate-spin motion-reduce:animate-none"
                        viewBox="0 0 24 24"
                        fill="none"
                        aria-hidden="true"
                      >
                        <circle
                          cx="12"
                          cy="12"
                          r="9"
                          stroke="currentColor"
                          strokeOpacity="0.3"
                          strokeWidth="3"
                        />
                        <path
                          d="M21 12a9 9 0 00-9-9"
                          stroke="currentColor"
                          strokeWidth="3"
                          strokeLinecap="round"
                        />
                      </svg>
                    )}
                    {submitting ? 'Sending…' : 'Send message'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Inline icons                                                       */
/* ------------------------------------------------------------------ */

function Icon({ className, children }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

function PinIcon(props) {
  return (
    <Icon {...props}>
      <path d="M12 21s7-6.2 7-12a7 7 0 10-14 0c0 5.8 7 12 7 12z" />
      <circle cx="12" cy="9" r="2.5" />
    </Icon>
  );
}

function MailIcon(props) {
  return (
    <Icon {...props}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </Icon>
  );
}

function PhoneIcon(props) {
  return (
    <Icon {...props}>
      <path d="M5 4h4l2 5-2.5 1.5a11 11 0 005 5L15 13l5 2v4a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2z" />
    </Icon>
  );
}

function ClockIcon(props) {
  return (
    <Icon {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </Icon>
  );
}

function CheckIcon(props) {
  return (
    <Icon {...props}>
      <path d="m5 12 5 5 9-10" />
    </Icon>
  );
}