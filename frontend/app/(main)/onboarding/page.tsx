'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../context/AuthContext';
import { useTenant } from '../../../context/TenantContext';
import Image from 'next/image';

const INDUSTRIES = [
  'Automotive', 'Healthcare', 'Real Estate', 'Legal',
  'Finance', 'Retail', 'Hospitality', 'Education',
  'Technology', 'Construction', 'Other',
];

interface FormState {
  name: string;
  email: string;
  industry: string;
  phone: string;
  websiteURL: string;
}

export default function OnboardingPage() {
  const { user } = useAuth();
  const { createTenant } = useTenant();
  const router = useRouter();

  console.log('user', user);

  const [form, setForm] = useState<FormState>({
    name: '',
    email: user?.email ?? '',
    industry: '',
    phone: '',
    websiteURL: '',
  });
  const [errors, setErrors] = useState<Partial<FormState>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const set =
    (field: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    };

  const validate = (): boolean => {
    const e: Partial<FormState> = {};
    if (!form.name.trim()) e.name = 'Business name is required';
    if (!form.industry) e.industry = 'Select an industry';
    if (!form.phone.trim()) e.phone = 'Phone is required';
    if (!form.websiteURL.trim()) e.websiteURL = 'Website URL is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);
    setServerError(null);
    try {
      await createTenant({ ...form, email: user?.email ?? form.email });
      router.push('/dashboard');
    } catch (err: any) {
      setServerError(err?.response?.data?.message ?? err?.message ?? 'Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass =
    'w-full bg-white border border-slate-200 text-slate-900 rounded-xl px-4 py-3 text-sm focus:border-slate-950 focus:ring-2 focus:ring-slate-950/5 outline-none transition-all duration-200 font-sans';

  return (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center px-4 py-12 font-sans">
      <div className="w-full max-w-[480px]">

        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Image
            src="/velocity-logo.webp"
            alt="Velocity"
            width={44}
            height={46}
            className="object-contain brightness-0"
          />
        </div>

        {/* Heading */}
        <div className="text-center mb-8">
          <h1 className="font-serif text-3xl font-normal text-slate-950 tracking-tight mb-2">
            Set up your workspace.
          </h1>
          <p className="text-sm text-slate-600">
            Tell us about your business. You can update these details later from settings.
          </p>
        </div>

        {/* Card */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-[0_6px_18px_rgba(15,23,42,0.06)] p-8">
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Business name */}
            <div>
              <label className="sr-only">Business name</label>
              <input
                type="text"
                placeholder="Acme Auto Group"
                value={form.name}
                onChange={set('name')}
                disabled={isSubmitting}
                className={inputClass}
              />
              {errors.name && <p className="mt-1.5 text-xs text-rose-600">{errors.name}</p>}
            </div>

            {/* Email — read-only, pre-filled from auth */}
            <div>
              <label className="sr-only">Business email</label>
              <input
                type="email"
                value={user?.email ?? ''}
                readOnly
                className={`${inputClass} bg-slate-50 text-slate-400 cursor-not-allowed`}
              />
            </div>

            {/* Industry */}
            <div>
              <select
                value={form.industry}
                onChange={set('industry')}
                disabled={isSubmitting}
                className={`${inputClass} ${!form.industry ? 'text-slate-400' : 'text-slate-900'}`}
              >
                <option value="" disabled>Select industry</option>
                {INDUSTRIES.map((ind) => (
                  <option key={ind} value={ind}>{ind}</option>
                ))}
              </select>
              {errors.industry && <p className="mt-1.5 text-xs text-rose-600">{errors.industry}</p>}
            </div>

            {/* Phone + Website */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="sr-only">Phone</label>
                <input
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  value={form.phone}
                  onChange={set('phone')}
                  disabled={isSubmitting}
                  className={inputClass}
                />
                {errors.phone && <p className="mt-1.5 text-xs text-rose-600">{errors.phone}</p>}
              </div>
              <div>
                <label className="sr-only">Website</label>
                <input
                  type="url"
                  placeholder="https://acme.com"
                  value={form.websiteURL}
                  onChange={set('websiteURL')}
                  disabled={isSubmitting}
                  className={inputClass}
                />
                {errors.websiteURL && <p className="mt-1.5 text-xs text-rose-600">{errors.websiteURL}</p>}
              </div>
            </div>

            {serverError && (
              <div className="rounded-lg border border-rose-100 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                {serverError}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-slate-950 text-white hover:bg-slate-900 disabled:opacity-60 disabled:cursor-not-allowed font-medium py-3 rounded-xl transition-all duration-200 shadow-sm text-sm tracking-wide flex items-center justify-center gap-2 mt-2"
            >
              {isSubmitting ? 'Creating workspace…' : 'Create workspace'}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-slate-400 mt-6">
          By continuing, you agree to Velocity's{' '}
          <span className="underline cursor-pointer">Terms of Service</span> and{' '}
          <span className="underline cursor-pointer">Privacy Policy</span>.
        </p>
      </div>
    </div>
  );
}