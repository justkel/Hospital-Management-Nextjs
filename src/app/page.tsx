'use client';

import { useState } from 'react';
import Image from 'next/image';
import Lottie from 'lottie-react';
import {
  ArrowRight,
  ArrowUpRight,
  Activity,
  Bed,
  BedDouble,
  Bell,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  ClipboardList,
  ClipboardCheck,
  FileClock,
  FlaskConical,
  Gauge,
  KeyRound,
  LayoutDashboard,
  Lock,
  Menu,
  Search,
  Settings2,
  ShieldCheck,
  Timer,
  UserRound,
  X,
  Check,
  HeartPulse,
  Pill,
  Stethoscope,
  LucideIcon,
  Minus,
} from 'lucide-react';
import { NairaIcon } from '@/components/icon/NairaIcon';

import heroAnimation from '@/animations/health1.json';
import careAnimation from '@/animations/doc-pat1.json';
import runAnimation from '@/animations/run1.json';

const PATIENT_JOURNEY = [
  {
    number: '01',
    title: 'Start with the person',
    copy: 'Create one complete patient record, with key details and history ready for the care team.',
    icon: UserRound,
    label: 'Patient record',
  },
  {
    number: '02',
    title: 'Understand the visit',
    copy: 'Bring complaints, vitals, diagnoses, and clinical notes together in one visit.',
    icon: Stethoscope,
    label: 'Clinical assessment',
  },
  {
    number: '03',
    title: 'Coordinate the care',
    copy: 'Keep prescriptions, procedures, and lab requests connected to the visit.',
    icon: HeartPulse,
    label: 'Connected care',
  },
  {
    number: '04',
    title: 'Close with clarity',
    copy: 'Track charges and keep the completed visit as part of the patient’s ongoing history.',
    icon: NairaIcon,
    label: 'Visit & billing',
  },
];

const PRODUCT_PREVIEWS = [
  { id: 'patient', label: 'Patient record' },
  { id: 'visit', label: 'Visit workspace' },
  { id: 'ward', label: 'Ward board' },
] as const;

const MOBILE_SHOWCASES = [
  {
    image: '/images/mobile-patient-list.webp',
    alt: 'Wellflexia mobile patient list with search and status filters',
    category: 'Clinical records',
    title: 'Patient records, at a glance.',
    copy: 'Find a patient, check their status, and open their record from a phone.',
  },
  {
    image: '/images/mobile-visit-billing.webp',
    alt: 'Wellflexia mobile visit billing screen showing balances and recent visits',
    category: 'Visit billing',
    title: 'The visit and its details.',
    copy: 'Review recent visits, outstanding balances, and billing in one flow.',
  },
  {
    image: '/images/mobile-feature-controls.webp',
    alt: 'Wellflexia mobile organization settings screen for feature controls',
    category: 'Organization controls',
    title: 'The right controls, wherever you are.',
    copy: 'Manage optional capabilities with a clear history of changes.',
  },
];

const FEATURES = [
  {
    icon: UserRound,
    tint: '!text-[#1D9E75] !bg-[#F0FAF5]',
    ring: '!border-[#1D9E75]/20',
    tag: 'Core module',
    title: 'Patient care',
    copy: 'One record per patient, not five scattered across departments.',
    bullets: ['Demographics, allergies, next of kin', 'Full visit history at a glance', 'Duplicate-patient detection'],
    big: true,
  },
  {
    icon: ClipboardList,
    tint: '!text-[#2563EB] !bg-[#EFF6FF]',
    ring: '!border-[#2563EB]/20',
    tag: 'Clinical',
    title: 'Visit lifecycle',
    copy: 'From check-in to closure, tracked end to end.',
    bullets: ['Complaints, diagnosis, vitals, notes', 'Prescriptions tied to billing'],
    big: false,
  },
  {
    icon: Bed,
    tint: '!text-[#16A34A] !bg-[#EEFDF4]',
    ring: '!border-[#16A34A]/20',
    tag: 'Operations',
    title: 'Theatre & ward',
    copy: 'Scheduling that holds under real hospital load.',
    bullets: ['Bookings, blocks, live availability', 'Bed allocation & incident logs'],
    big: false,
  },
  {
    icon: NairaIcon,
    tint: '!text-[#D97706] !bg-[#FFFBEB]',
    ring: '!border-[#D97706]/20',
    tag: 'Finance',
    title: 'Billing & finance',
    copy: 'Charges that reconcile themselves.',
    bullets: ['Charge catalog & adjustments', 'Invoices, refunds, wallet top-ups'],
    big: false,
  },
  {
    icon: FlaskConical,
    tint: '!text-[#7C3AED] !bg-[#F5F3FF]',
    ring: '!border-[#7C3AED]/20',
    tag: 'Diagnostics',
    title: 'Lab diagnostics',
    copy: 'Requests and results, connected to the visit.',
    bullets: ['Request creation & routing', 'Result capture per visit'],
    big: false,
  },
];

const ROLE_DESCRIPTIONS: Record<string, string> = {
  ADMIN: 'Full administrative control — staff, organization settings, feature flags, guest approvals.',
  DOCTOR: 'Diagnoses, prescriptions, procedures, and the full clinical record for every visit.',
  NURSE: 'Vitals, notes, tasks, and day-to-day visit care.',
  PHARMACIST: 'Prescription review and dispensing tied to each visit.',
  RECEPTIONIST: 'Patient check-in, and front-desk record-keeping.',
  LAB_TECH: 'Lab request intake, processing, and result capture.',
  BILLING_OFFICER: 'Charges, invoices, adjustments, and payment reconciliation.',
  GUEST: 'Time-boxed access to only the screens explicitly opened for guests.',
};

const ROLES = Object.keys(ROLE_DESCRIPTIONS);

const DOMAINS = ['Patients', 'Visits', 'Theatre & Ward', 'Billing', 'Labs', 'Audit & Admin'];

const ROLE_ICONS: Record<string, LucideIcon> = {
  ADMIN: ShieldCheck,
  DOCTOR: Stethoscope,
  NURSE: HeartPulse,
  PHARMACIST: Pill,
  RECEPTIONIST: UserRound,
  LAB_TECH: FlaskConical,
  BILLING_OFFICER: NairaIcon,
  GUEST: KeyRound,
};

type AccessType = boolean | 'partial';

const ROLE_ACCESS: Record<string, AccessType[]> = {
  ADMIN: [true, 'partial', true, true, 'partial', true],
  DOCTOR: [true, true, true, false, 'partial', false],
  NURSE: [true, true, true, false, 'partial', false],
  PHARMACIST: [false, 'partial', false, false, false, false],
  RECEPTIONIST: ['partial', 'partial', false, false, false, false],
  LAB_TECH: [false, false, false, false, true, false],
  BILLING_OFFICER: [false, false, false, true, false, false],
  GUEST: [true, 'partial', true, true, 'partial', false],
};

const GUEST_STEPS = [
  { label: 'Request', copy: 'A guest asks for access. It lands in a pending queue, not a live session.' },
  { label: 'Review', copy: 'An admin approves or rejects. Nothing is granted by default.' },
  { label: 'Time-boxed access', copy: 'Only endpoints explicitly opened for guests become reachable.' },
  { label: 'Auto-expiry', copy: 'Access lapses on its own — revoked, expired, or blocked, the door closes.' },
  {
    label: 'Reactivate',
    copy: 'Admins can restore expired sessions. Reactivated access has no auto-expiry and requires manual admin revocation.'
  }
];

const SECURITY = [
  { icon: ShieldCheck, label: 'Role-based access', copy: 'Every endpoint checks who is asking before it answers.', accent: true },
  { icon: FileClock, label: 'Full audit trail', copy: 'Actor, action, entity, timestamp — logged without exception.', accent: false },
  { icon: Lock, label: 'Session security', copy: 'JWT access tokens, rotated refresh tokens, Redis-backed.', accent: false },
  { icon: Gauge, label: 'Rate-limited by default', copy: 'The gateway and auth layer both throttle at the edge.', accent: false },
];

export default function Home() {
  const [navOpen, setNavOpen] = useState(false);
  const [activeRole, setActiveRole] = useState('DOCTOR');
  const [activePreview, setActivePreview] = useState<(typeof PRODUCT_PREVIEWS)[number]['id']>('patient');

  return (
    <div className="min-h-screen !bg-[#FAFAF8] font-sans">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,400;0,500;0,600;0,700;0,800;1,500;1,700&display=swap');
        .font-sans { font-family: 'Montserrat', ui-sans-serif, system-ui, sans-serif; }
        @keyframes floatSlow {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes floatSlower {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-14px); }
        }
      `}</style>

      <header className="sticky top-0 z-50 border-b !border-[#E8E6E0] !bg-[#FAFAF8]/85 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3.5 sm:px-6 sm:py-4 lg:px-8">
          <div className="flex items-center gap-2 sm:gap-2.5">
            <span className="text-[20px] font-bold italic tracking-[-0.02em] !text-[#14231A] sm:text-[22px]">
              well<span className="!text-[#1D9E75] underline decoration-[#1D9E75]/30 underline-offset-4">flex</span>ia !
            </span>
          </div>

          <nav className="hidden items-center gap-6 lg:flex xl:gap-8">
            <a href="#platform" className="text-[13px] font-semibold !text-[#5c5c56] transition hover:!text-[#14231A]">Platform</a>
            <a href="#preview" className="text-[13px] font-semibold !text-[#5c5c56] transition hover:!text-[#14231A]">Product preview</a>
            <a href="#mobile" className="text-[13px] font-semibold !text-[#5c5c56] transition hover:!text-[#14231A]">Mobile</a>
            <a href="#roles" className="text-[13px] font-semibold !text-[#5c5c56] transition hover:!text-[#14231A]">Roles</a>
            <a href="#security" className="text-[13px] font-semibold !text-[#5c5c56] transition hover:!text-[#14231A]">Security</a>
            <a href="#guest" className="text-[13px] font-semibold !text-[#5c5c56] transition hover:!text-[#14231A]">Guest access</a>
          </nav>

          <div className="hidden items-center gap-2.5 sm:flex">
            <a href="/login" className="rounded-full px-3.5 py-2 text-[13px] font-semibold !text-[#14231A] transition hover:!bg-[#F0FAF5] hover:!text-[#1D9E75]">Sign in</a>
            <a
              href="/guest-access"
              className="inline-flex items-center gap-1.5 rounded-full !bg-[#0C1A12] px-4 py-2 text-[13px] font-semibold !text-white transition hover:!bg-[#14231A] active:scale-[0.97]"
            >
              Request guest access
              <ArrowRight size={13} />
            </a>
          </div>

          <button
            onClick={() => setNavOpen((v) => !v)}
            className="flex h-9 w-9 items-center justify-center rounded-lg border !border-[#E8E6E0] !text-[#14231A] sm:hidden"
            aria-label="Toggle menu"
          >
            {navOpen ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>

        {navOpen && (
          <div className="border-t !border-[#E8E6E0] px-5 py-4 sm:hidden">
            <div className="flex flex-col gap-3">
              <a href="#platform" className="text-[13px] font-semibold !text-[#5c5c56]">Platform</a>
              <a href="#preview" onClick={() => setNavOpen(false)} className="text-[13px] font-semibold !text-[#5c5c56]">Product preview</a>
              <a href="#mobile" onClick={() => setNavOpen(false)} className="text-[13px] font-semibold !text-[#5c5c56]">Mobile experience</a>
              <a href="#roles" className="text-[13px] font-semibold !text-[#5c5c56]">Roles</a>
              <a href="#security" className="text-[13px] font-semibold !text-[#5c5c56]">Security</a>
              <a href="#guest" className="text-[13px] font-semibold !text-[#5c5c56]">Guest access</a>
              <div className="mt-2 flex flex-row gap-2">
                <a href="/login" className="flex min-h-11 min-w-0 flex-1 items-center justify-center rounded-full border !border-[#E8E6E0] px-2 py-2 text-center text-[12px] font-semibold !text-[#14231A]">Sign in</a>
                <a href="/guest-access" className="flex min-h-11 min-w-0 flex-1 items-center justify-center rounded-full !bg-[#0C1A12] px-2 py-2 text-center text-[11px] font-semibold leading-tight !text-white">Request guest access</a>
              </div>
            </div>
          </div>
        )}
      </header>

      <section className="relative overflow-hidden !bg-[#0C1A12]">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px)',
            backgroundSize: '22px 22px',
          }}
        />
        <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full !bg-[#1D9E75]/15 blur-[90px]" />
        <div className="pointer-events-none absolute -bottom-24 -right-16 h-80 w-80 rounded-full !bg-[#5DCAA5]/10 blur-[100px]" />

        <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-5 pb-16 pt-16 sm:px-6 sm:pb-16 sm:pt-20 md:pt-24 lg:grid-cols-[1.05fr_0.95fr] lg:gap-8 lg:px-8 lg:pb-20 lg:pt-24 xl:gap-14">
          <div className="text-center lg:text-left">
            <div className="mx-auto mb-5 inline-flex items-center gap-2 rounded-full border !border-[#1D9E75]/25 !bg-[#1D9E75]/10 px-3.5 py-1.5 lg:mx-0">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full !bg-[#1D9E75]" />
              <span className="text-[11.5px] font-bold uppercase tracking-[0.08em] !text-[#5DCAA5] sm:text-[12px]">Hospital operations, unified</span>
            </div>

            <h1 className="text-[32px] font-extrabold leading-[1.08] tracking-[-0.02em] !text-white sm:text-[42px] md:text-[50px] lg:text-[46px] xl:text-[54px]">
              Every visit, every vital,<br className="hidden sm:block" />{' '}
              <span className="italic !text-[#5DCAA5]">one system.</span>
            </h1>

            <p className="mx-auto mt-5 max-w-xl text-[14.5px] font-medium leading-relaxed !text-[#8fa89a] sm:text-[15.5px] lg:mx-0">
              Patient records, visits, theatre scheduling, billing, and compliance — running as connected
              services instead of a pile of spreadsheets and side channels.
            </p>

            <div className="mt-7 flex flex-row items-stretch justify-center gap-2 sm:gap-3 lg:justify-start">
              <a
                href="/login"
                className="inline-flex min-h-11 min-w-0 flex-1 items-center justify-center gap-1.5 rounded-full !bg-[#1D9E75] px-2.5 py-2.5 text-[11.5px] font-bold !text-white transition hover:!bg-[#1a8a68] active:scale-[0.98] sm:min-h-12 sm:w-auto sm:flex-none sm:gap-2 sm:px-6 sm:text-[14px]"
              >
                Sign in
                <ArrowRight size={14} className="sm:size-[15px]" />
              </a>
              <a
                href="/guest-access"
                className="inline-flex min-h-11 min-w-0 flex-1 items-center justify-center gap-1.5 rounded-full border !border-white/15 !bg-white/[0.04] px-2.5 py-2.5 text-[10.5px] font-bold leading-tight !text-white transition hover:!bg-white/[0.09] active:scale-[0.98] sm:min-h-12 sm:w-auto sm:flex-none sm:gap-2 sm:px-6 sm:text-[14px]"
              >
                Request guest access
                <ArrowUpRight size={14} className="sm:size-[15px]" />
              </a>
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-2 lg:justify-start">
              {['5 connected services', '8 hospital roles', 'Guest access, fully governed'].map((s) => (
                <div key={s} className="rounded-full border !border-white/10 !bg-white/[0.05] px-3 py-1.5">
                  <span className="text-[11.5px] font-bold !text-white">{s}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-[420px] lg:mx-0 lg:max-w-none">
            <div className="relative overflow-hidden rounded-[28px] border !border-white/10 !bg-gradient-to-br !from-white/[0.07] !to-white/[0.02] p-6 backdrop-blur sm:p-8 lg:p-10">
              <div className="pointer-events-none absolute inset-0 !bg-[#1D9E75]/5" />
              <div className="relative mx-auto h-[240px] w-full sm:h-[300px] md:h-[360px] lg:h-[440px] xl:h-[480px]">
                <Lottie animationData={heroAnimation} loop autoplay />
              </div>
            </div>

            <div className="absolute -left-3 top-6 hidden animate-[floatSlow_5s_ease-in-out_infinite] items-center gap-2 rounded-xl border !border-[#E8E6E0] !bg-white px-3 py-2.5 shadow-[0_8px_24px_rgba(0,0,0,0.18)] sm:flex">
              <CheckCircle2 size={15} className="!text-[#1D9E75]" />
              <span className="text-[11.5px] font-bold !text-[#14231A]">Visit #482 closed</span>
            </div>

            <div className="absolute -right-4 top-1/3 hidden animate-[floatSlower_6s_ease-in-out_infinite] items-center gap-2 rounded-xl border !border-[#E8E6E0] !bg-white px-3 py-2.5 shadow-[0_8px_24px_rgba(0,0,0,0.18)] sm:flex">
              <Timer size={15} className="!text-[#D97706]" />
              <span className="text-[11.5px] font-bold !text-[#14231A]">Guest access expires in 47m</span>
            </div>

            <div className="absolute -bottom-4 left-1/4 hidden animate-[floatSlow_5.5s_ease-in-out_infinite] items-center gap-2 rounded-xl border !border-[#E8E6E0] !bg-white px-3 py-2.5 shadow-[0_8px_24px_rgba(0,0,0,0.18)] md:flex">
              <BedDouble size={15} className="!text-[#2563EB]" />
              <span className="text-[11.5px] font-bold !text-[#14231A]">3 beds reassigned · Ward B</span>
            </div>
          </div>
        </div>
      </section>

      <section id="platform" className="relative my-2 overflow-hidden border-b !border-[#E8E6E0] !bg-white py-16 sm:my-0 sm:py-20 lg:py-24">
        <div className="pointer-events-none absolute -right-24 -top-28 h-80 w-80 rounded-full !bg-[#1D9E75]/[0.06] blur-3xl" />
        <div className="pointer-events-none absolute -bottom-36 -left-20 h-80 w-80 rounded-full !bg-[#D97706]/[0.05] blur-3xl" />
        <div className="relative mx-auto max-w-6xl px-5 sm:px-6 lg:px-8">
          <div className="mb-10 flex flex-col gap-5 sm:mb-14 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border !border-[#1D9E75]/15 !bg-[#F0FAF5] px-3 py-1.5">
                <span className="h-1.5 w-1.5 rounded-full !bg-[#1D9E75]" />
                <span className="text-[10px] font-bold uppercase tracking-[0.12em] !text-[#1D9E75]">The patient journey</span>
              </div>
              <h2 className="mt-5 text-[30px] font-extrabold leading-tight tracking-[-0.035em] !text-[#14231A] sm:text-[38px] lg:text-[44px]">
                From first visit to follow-up, <span className="!text-[#1D9E75]">connected.</span>
              </h2>
            </div>
            <p className="max-w-md text-[13.5px] font-medium leading-relaxed !text-[#6b6b64] sm:text-[14px] lg:pb-1">
              Care is a series of important moments. Wellflexia keeps the patient record moving with the people and decisions around it.
            </p>
          </div>

          <div className="relative grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4 lg:gap-5">
            <div className="pointer-events-none absolute left-[12%] right-[12%] top-[34px] hidden h-px !bg-gradient-to-r !from-[#1D9E75]/10 !via-[#1D9E75]/30 !to-[#1D9E75]/10 lg:block" />
            {PATIENT_JOURNEY.map((step) => {
              const Icon = step.icon;
              return (
                <article
                  key={step.number}
                  className="group relative rounded-2xl border !border-[#E8E6E0] !bg-white p-5 shadow-[0_8px_30px_rgba(20,35,26,0.035)] transition duration-300 hover:-translate-y-1 hover:!border-[#1D9E75]/30 hover:shadow-[0_18px_40px_rgba(20,35,26,0.09)] sm:p-6"
                >
                  <div className="relative mb-7 flex items-center justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl border !border-[#1D9E75]/15 !bg-[#F0FAF5] !text-[#1D9E75] transition duration-300 group-hover:!bg-[#1D9E75] group-hover:!text-white">
                      <Icon size={21} strokeWidth={2.2} />
                    </div>
                    <span className="font-mono text-[12px] font-bold tracking-[0.12em] !text-[#B4B2A9]">{step.number}</span>
                  </div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.12em] !text-[#1D9E75]">{step.label}</p>
                  <h3 className="mt-2 text-[17px] font-extrabold tracking-[-0.02em] !text-[#14231A]">{step.title}</h3>
                  <p className="mt-2 text-[12.5px] font-medium leading-relaxed !text-[#6b6b64]">{step.copy}</p>
                  <div className="mt-6 h-1 w-10 rounded-full !bg-[#1D9E75]/20 transition-all duration-300 group-hover:w-16 group-hover:!bg-[#1D9E75]" />
                </article>
              );
            })}
          </div>

          <div className="mt-6 flex items-center justify-center gap-2 text-center">
            <CheckCircle2 size={15} className="shrink-0 !text-[#1D9E75]" />
            <p className="text-[11.5px] font-semibold !text-[#6b6b64] sm:text-[12px]">
              One connected record, carried through every step.
            </p>
          </div>
        </div>
      </section>

      <section className="my-2 !bg-[#FAFAF8] py-16 sm:my-0 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-6xl px-5 sm:px-6 lg:px-8">
          <div className="mx-auto mb-10 max-w-lg text-center sm:mb-12">
            <p className="text-[11px] font-extrabold uppercase tracking-[0.14em] !text-[#1D9E75]">Everything on one record</p>
            <h2 className="mt-4 text-[26px] font-extrabold tracking-[-0.02em] !text-[#14231A] sm:text-[30px] md:text-[34px]">
              Built for the whole hospital,<br className="hidden sm:block" /> not one department.
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-6">
            {FEATURES.map((f) => {
              const Icon = f.icon;
              return (
                <div
                  key={f.title}
                  className={`group relative overflow-hidden rounded-2xl border !bg-white p-5 transition hover:!border-[#D3D1C7] hover:shadow-[0_10px_28px_rgba(0,0,0,0.08)] sm:p-6 ${f.ring} ${f.big ? 'sm:col-span-2 lg:col-span-4 lg:row-span-2' : 'lg:col-span-2'
                    }`}
                >
                  <div className="flex items-center justify-between">
                    <div className={`flex h-11 w-11 mb-5 md:mb-4 items-center justify-center rounded-xl ${f.tint}`}>
                      <Icon size={19} />
                    </div>
                    <span className="rounded-full !bg-[#FAFAF8] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.06em] !text-[#B4B2A9]">
                      {f.tag}
                    </span>
                  </div>

                  <h3 className="mt-4 text-[16px] font-extrabold !text-[#14231A] sm:text-[17px]">{f.title}</h3>
                  <p className="mt-1 text-[13px] font-medium !text-[#6b6b64]">{f.copy}</p>

                  <ul className="mt-4 flex flex-col gap-1.5">
                    {f.bullets.map((b) => (
                      <li key={b} className="flex items-start gap-2 text-[12.5px] font-medium leading-relaxed !text-[#5c5c56]">
                        <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full !bg-[#1D9E75]" />
                        {b}
                      </li>
                    ))}
                  </ul>

                  {f.big && (
                    <div className="pointer-events-none absolute -bottom-0 -right-0 hidden min-[700px]:block h-40 w-40 opacity-90 sm:h-48 sm:w-48 md:h-52 md:w-52">
                      <Lottie animationData={careAnimation} loop autoplay />
                    </div>
                  )}
                </div>
              );
            })}

            <div className="rounded-2xl border !border-[#0F766E]/25 !bg-[#0C1A12] p-5 sm:col-span-2 sm:p-6 lg:col-span-6">
              <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                <div className="flex items-center gap-3.5">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl !bg-[#0F766E]/20 !text-[#5DCAA5]">
                    <FileClock size={19} />
                  </div>
                  <div>
                    <h3 className="text-[16px] font-extrabold !text-white sm:text-[17px]">Audit & compliance</h3>
                    <p className="mt-0.5 text-[13px] font-medium !text-[#8fa89a]">Nothing happens off the record.</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {['Actor trails', 'Filterable logs', '7-day trends'].map((t) => (
                    <span key={t} className="rounded-full border !border-white/10 !bg-white/[0.05] px-3 py-1.5 text-[11.5px] font-bold !text-white">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="preview" className="relative my-2 overflow-hidden border-y !border-[#E8E6E0] !bg-[#F3F5F2] py-16 sm:my-0 sm:py-20 lg:py-24">
        <div className="pointer-events-none absolute -right-24 top-10 h-80 w-80 rounded-full !bg-[#1D9E75]/[0.07] blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          <div className="mx-auto mb-10 max-w-2xl text-center sm:mb-14">
            <div className="inline-flex items-center gap-2 rounded-full border !border-[#1D9E75]/15 !bg-white px-3 py-1.5 shadow-sm">
              <span className="h-1.5 w-1.5 rounded-full !bg-[#1D9E75]" />
              <span className="text-[10px] font-bold uppercase tracking-[0.12em] !text-[#1D9E75]">A closer look</span>
            </div>
            <h2 className="mt-5 text-[29px] font-extrabold leading-tight tracking-[-0.035em] !text-[#14231A] sm:text-[38px] lg:text-[44px]">
              See the care, <span className="!text-[#1D9E75]">not the complexity.</span>
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-[13.5px] font-medium leading-relaxed !text-[#6b6b64] sm:text-[14px]">
              A simple view of the work behind every visit. Explore a patient record, an active visit, and a ward at a glance.
            </p>
          </div>

          <div className="grid items-center gap-8 lg:grid-cols-[0.72fr_1.28fr] lg:gap-12">
            <div className="mx-auto max-w-lg lg:mx-0">
              <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] !text-[#1D9E75]">Thoughtfully connected</p>
              <h3 className="mt-3 text-[20px] font-extrabold leading-snug tracking-[-0.025em] !text-[#14231A] sm:text-[26px]">
                The details your team needs, right where they need them.
              </h3>
              <p className="mt-3 text-[13px] font-medium leading-relaxed !text-[#6b6b64] sm:text-[13.5px]">
                Move between the patient story, today&apos;s care, and ward activity without losing the thread.
              </p>

              <div className="mt-6 flex flex-col gap-2.5" role="group" aria-label="Choose a product preview">
                {PRODUCT_PREVIEWS.map((preview, index) => {
                  const isActive = activePreview === preview.id;
                  const PreviewIcon = index === 0 ? UserRound : index === 1 ? ClipboardCheck : BedDouble;
                  const previewCopy = [
                    'A unified view of the patient and their care history.',
                    'Visit notes, observations, and next steps in context.',
                    'A clear snapshot of beds and ward activity.',
                  ][index];

                  return (
                    <button
                      key={preview.id}
                      type="button"
                      onClick={() => setActivePreview(preview.id)}
                      aria-pressed={isActive}
                      className={`flex w-full items-center gap-3 rounded-xl border p-3.5 text-left transition-all duration-200 sm:p-4 ${
                        isActive
                          ? 'border-[#1D9E75]/30 !bg-white shadow-[0_8px_24px_rgba(20,35,26,0.07)]'
                          : 'border-transparent !bg-white/55 hover:border-[#E8E6E0] hover:!bg-white'
                      }`}
                    >
                      <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors ${
                        isActive ? '!bg-[#F0FAF5] !text-[#1D9E75]' : '!bg-[#F3F5F2] !text-[#777970]'
                      }`}>
                        <PreviewIcon size={18} />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-[12.5px] font-extrabold !text-[#14231A] sm:text-[13px]">{preview.label}</span>
                        <span className="mt-0.5 block text-[11px] font-medium leading-relaxed !text-[#777970] sm:text-[11.5px]">{previewCopy}</span>
                      </span>
                      <ArrowUpRight size={15} className={`shrink-0 transition-colors ${isActive ? '!text-[#1D9E75]' : '!text-[#B4B2A9]'}`} />
                    </button>
                  );
                })}
              </div>

              <div className="mt-5 inline-flex items-center gap-2 rounded-full border !border-[#E8E6E0] !bg-white/70 px-3 py-1.5">
                <ShieldCheck size={13} className="!text-[#1D9E75]" />
                <span className="text-[10px] font-semibold !text-[#6b6b64]">Illustrative preview · Demo data only</span>
              </div>
            </div>

            <div className="min-w-0 rounded-[22px] border !border-[#DCE2DC] !bg-white p-2.5 shadow-[0_24px_70px_rgba(20,35,26,0.12)] sm:rounded-[26px] sm:p-3.5">
              <div className="flex h-10 items-center gap-2 border-b !border-[#EEF0EC] px-2 sm:px-3">
                <span className="h-2.5 w-2.5 rounded-full !bg-[#F1B8AC]" />
                <span className="h-2.5 w-2.5 rounded-full !bg-[#E8CA83]" />
                <span className="h-2.5 w-2.5 rounded-full !bg-[#9BCDB3]" />
                <div className="ml-2 flex min-w-0 flex-1 items-center justify-center">
                  <span className="truncate rounded-md !bg-[#F6F7F5] px-3 py-1 text-[9px] font-medium !text-[#93968E] sm:text-[10px]">www.wellflexia.com</span>
                </div>
                <span className="rounded-full !bg-[#F0FAF5] px-2 py-1 text-[8px] font-extrabold uppercase tracking-[0.08em] !text-[#1D9E75] sm:text-[9px]">Demo</span>
              </div>

              <div className="flex min-h-[390px] overflow-hidden rounded-b-[16px] !bg-[#F7F8F6] sm:min-h-[430px]">
                <aside className="hidden w-[58px] shrink-0 flex-col items-center gap-3 border-r !border-[#EAEEE9] !bg-white py-4 sm:flex lg:w-[66px]">
                  <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-xl !bg-[#0C1A12] text-[12px] font-extrabold !text-[#5DCAA5]">w</div>
                  {[LayoutDashboard, UserRound, CalendarDays, BedDouble, FlaskConical].map((Icon, index) => (
                    <div key={index} className={`flex h-8 w-8 items-center justify-center rounded-lg ${index === (activePreview === 'patient' ? 1 : activePreview === 'visit' ? 2 : 3) ? '!bg-[#F0FAF5] !text-[#1D9E75]' : '!text-[#A4A79F]'}`}>
                      <Icon size={15} />
                    </div>
                  ))}
                  <div className="mt-auto flex h-8 w-8 items-center justify-center rounded-lg !text-[#A4A79F]">
                    <Settings2 size={15} />
                  </div>
                </aside>

                <div className="min-w-0 flex-1 p-3.5 sm:p-5 md:p-6">
                  <div className="mb-5 flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <p className="truncate text-[9px] font-bold uppercase tracking-[0.1em] !text-[#8D9289]">Care workspace</p>
                      <h4 className="mt-1 truncate text-[15px] font-extrabold tracking-[-0.02em] !text-[#14231A] sm:text-[18px]">
                        {activePreview === 'patient' ? 'Patient record' : activePreview === 'visit' ? 'Visit workspace' : 'Ward overview'}
                      </h4>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      <div className="hidden h-8 w-36 items-center gap-1.5 rounded-lg border !border-[#E8EAE6] !bg-white px-2.5 sm:flex">
                        <Search size={12} className="!text-[#9A9E96]" />
                        <span className="text-[9px] font-medium !text-[#9A9E96]">Search records</span>
                      </div>
                      <button type="button" aria-label="Notifications preview" className="flex h-8 w-8 items-center justify-center rounded-lg border !border-[#E8EAE6] !bg-white !text-[#7C8178]">
                        <Bell size={14} />
                      </button>
                      <div className="flex h-8 w-8 items-center justify-center rounded-full !bg-[#DDF2E8] text-[10px] font-extrabold !text-[#137653]">JD</div>
                    </div>
                  </div>

                  {activePreview === 'patient' && (
                    <div className="space-y-3.5">
                      <div className="rounded-xl border !border-[#E8EAE6] !bg-white p-3.5 sm:p-4">
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <div className="flex h-11 w-11 items-center justify-center rounded-full !bg-[#EAF4F0] !text-[#1D9E75]">
                              <UserRound size={20} />
                            </div>
                            <div>
                              <h5 className="text-[13px] font-extrabold !text-[#14231A] sm:text-[14px]">Amara Okafor</h5>
                              <p className="mt-0.5 text-[9px] font-medium !text-[#8D9289] sm:text-[10px]">WF-2048 · DOB 14 May 1988</p>
                            </div>
                          </div>
                          <span className="inline-flex items-center gap-1 rounded-full !bg-[#F0FAF5] px-2 py-1 text-[8px] font-bold !text-[#16835E] sm:text-[9px]">
                            <span className="h-1.5 w-1.5 rounded-full !bg-[#1D9E75]" /> Active patient
                          </span>
                        </div>
                        <div className="mt-4 grid grid-cols-3 gap-2 border-t !border-[#F0F1EE] pt-3">
                          {[
                            ['Blood group', 'O+'],
                            ['Last visit', '12 Oct 2026'],
                            ['Care team', '3 members'],
                          ].map(([label, value]) => (
                            <div key={label} className="min-w-0">
                              <p className="truncate text-[8px] font-semibold !text-[#9A9E96] sm:text-[9px]">{label}</p>
                              <p className="mt-1 truncate text-[9px] font-bold !text-[#353B34] sm:text-[10px]">{value}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1.1fr_0.9fr]">
                        <div className="rounded-xl border !border-[#E8EAE6] !bg-white p-3.5 sm:p-4">
                          <div className="flex items-center justify-between">
                            <p className="text-[10px] font-extrabold !text-[#353B34] sm:text-[11px]">Recent visits</p>
                            <span className="text-[8px] font-bold !text-[#1D9E75] sm:text-[9px]">View history</span>
                          </div>
                          <div className="mt-3 space-y-3">
                            {[
                              ['12 Oct', 'General consultation', 'Completed'],
                              ['28 Aug', 'Follow-up visit', 'Completed'],
                            ].map(([date, title, status]) => (
                              <div key={date} className="flex items-center gap-2.5">
                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg !bg-[#F4F6F3] !text-[#7B8279]"><CalendarDays size={13} /></div>
                                <div className="min-w-0 flex-1">
                                  <p className="truncate text-[9px] font-bold !text-[#353B34] sm:text-[10px]">{title}</p>
                                  <p className="mt-0.5 text-[8px] font-medium !text-[#9A9E96]">{date} · {status}</p>
                                </div>
                                <CheckCircle2 size={13} className="!text-[#1D9E75]" />
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="rounded-xl border !border-[#E8EAE6] !bg-white p-3.5 sm:p-4">
                          <p className="text-[10px] font-extrabold !text-[#353B34] sm:text-[11px]">Patient notes</p>
                          <div className="mt-3 rounded-lg !bg-[#FFF9EB] p-2.5">
                            <p className="text-[8px] font-bold uppercase tracking-[0.08em] !text-[#A46A13]">Reminder</p>
                            <p className="mt-1 text-[9px] font-medium leading-relaxed !text-[#685B43]">Review follow-up plan at next visit.</p>
                          </div>
                          <div className="mt-2 flex items-center gap-1.5 text-[8px] font-medium !text-[#8D9289]">
                            <ShieldCheck size={11} className="!text-[#1D9E75]" /> Visible to care team
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activePreview === 'visit' && (
                    <div className="space-y-3.5">
                      <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border !border-[#E8EAE6] !bg-white p-3.5 sm:p-4">
                        <div>
                          <p className="text-[8px] font-bold uppercase tracking-[0.1em] !text-[#8D9289]">Visit · 12 Oct 2026</p>
                          <p className="mt-1 text-[12px] font-extrabold !text-[#14231A] sm:text-[14px]">General consultation</p>
                        </div>
                        <span className="inline-flex items-center gap-1.5 rounded-full !bg-[#FFF6E5] px-2.5 py-1 text-[8px] font-bold !text-[#A96B12] sm:text-[9px]">
                          <span className="h-1.5 w-1.5 rounded-full !bg-[#D99726]" /> In progress
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                        {[
                          ['Blood pressure', '118/76', 'mmHg'],
                          ['Temperature', '36.8', '°C'],
                          ['Pulse', '72', 'bpm'],
                          ['SpO₂', '98', '%'],
                        ].map(([label, value, unit]) => (
                          <div key={label} className="rounded-xl border !border-[#E8EAE6] !bg-white p-3">
                            <p className="truncate text-[8px] font-semibold !text-[#8D9289]">{label}</p>
                            <p className="mt-1.5 text-[14px] font-extrabold !text-[#14231A] sm:text-[16px]">{value}<span className="ml-1 text-[8px] font-semibold !text-[#8D9289]">{unit}</span></p>
                          </div>
                        ))}
                      </div>
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_0.85fr]">
                        <div className="rounded-xl border !border-[#E8EAE6] !bg-white p-3.5 sm:p-4">
                          <div className="flex items-center gap-2">
                            <div className="flex h-7 w-7 items-center justify-center rounded-lg !bg-[#F0FAF5] !text-[#1D9E75]"><ClipboardList size={13} /></div>
                            <p className="text-[10px] font-extrabold !text-[#353B34]">Clinical note</p>
                          </div>
                          <p className="mt-3 text-[9px] font-medium leading-relaxed !text-[#6b6b64] sm:text-[10px]">
                            Patient reports feeling well. Observations recorded and reviewed by the care team.
                          </p>
                          <div className="mt-3 flex items-center gap-1.5 text-[8px] font-semibold !text-[#8D9289]"><CheckCircle2 size={11} className="!text-[#1D9E75]" /> Saved to visit</div>
                        </div>
                        <div className="rounded-xl border !border-[#E8EAE6] !bg-white p-3.5 sm:p-4">
                          <p className="text-[10px] font-extrabold !text-[#353B34]">Next steps</p>
                          <div className="mt-3 space-y-2.5">
                            {['Review care plan', 'Complete visit notes', 'Prepare billing summary'].map((item, index) => (
                              <div key={item} className="flex items-center gap-2 text-[8px] font-semibold !text-[#555B53] sm:text-[9px]">
                                <span className={`flex h-4 w-4 items-center justify-center rounded border ${index === 0 ? 'border-[#1D9E75] !bg-[#F0FAF5] !text-[#1D9E75]' : '!border-[#E4E7E1] !bg-white !text-transparent'}`}>
                                  <Check size={10} />
                                </span>
                                {item}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activePreview === 'ward' && (
                    <div className="space-y-3.5">
                      <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border !border-[#E8EAE6] !bg-white p-3.5 sm:p-4">
                        <div>
                          <p className="text-[8px] font-bold uppercase tracking-[0.1em] !text-[#8D9289]">Inpatient care</p>
                          <p className="mt-1 text-[12px] font-extrabold !text-[#14231A] sm:text-[14px]">Ward A · Bed overview</p>
                        </div>
                        <div className="flex items-center gap-1.5 rounded-lg border !border-[#E8EAE6] px-2.5 py-1.5 text-[8px] font-semibold !text-[#6b6b64]">
                          Today <ChevronDown size={11} />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                        {[
                          ['Total beds', '24', '!text-[#353B34]'],
                          ['Occupied', '18', '!text-[#2563EB]'],
                          ['Available', '4', '!text-[#16835E]'],
                          ['Needs attention', '2', '!text-[#D97706]'],
                        ].map(([label, value, color]) => (
                          <div key={label} className="rounded-xl border !border-[#E8EAE6] !bg-white p-3">
                            <p className="truncate text-[8px] font-semibold !text-[#8D9289]">{label}</p>
                            <p className={`mt-1.5 text-[16px] font-extrabold ${color}`}>{value}</p>
                          </div>
                        ))}
                      </div>
                      <div className="rounded-xl border !border-[#E8EAE6] !bg-white p-3.5 sm:p-4">
                        <div className="mb-3 flex items-center justify-between">
                          <p className="text-[10px] font-extrabold !text-[#353B34] sm:text-[11px]">Bed status</p>
                          <div className="flex items-center gap-2.5 text-[8px] font-medium !text-[#8D9289]">
                            <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full !bg-[#1D9E75]" />Available</span>
                            <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full !bg-[#60A5FA]" />Occupied</span>
                          </div>
                        </div>
                        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                          {[
                            ['A01', 'occupied'], ['A02', 'available'], ['A03', 'occupied'], ['A04', 'attention'],
                            ['A05', 'occupied'], ['A06', 'available'], ['A07', 'occupied'], ['A08', 'occupied'],
                          ].map(([bed, status]) => (
                            <div key={bed} className={`flex min-w-0 items-center gap-1.5 rounded-lg border px-2 py-2 ${status === 'available' ? 'border-[#D6EEE2] !bg-[#F4FBF7]' : status === 'attention' ? 'border-[#F1E4C9] !bg-[#FFFBF2]' : 'border-[#DCEBFA] !bg-[#F5F9FE]'}`}>
                              <Bed size={12} className={`shrink-0 ${status === 'available' ? '!text-[#1D9E75]' : status === 'attention' ? '!text-[#D99726]' : '!text-[#4D8BCB]'}`} />
                              <span className="text-[8px] font-bold !text-[#4B514A]">{bed}</span>
                              <span className="hidden truncate text-[7px] font-medium capitalize !text-[#8D9289] md:inline">{status}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="mt-3 flex items-center justify-between border-t !border-[#E8EAE6] pt-3">
                    <span className="inline-flex items-center gap-1.5 text-[8px] font-semibold !text-[#8D9289] sm:text-[9px]">
                      <Activity size={11} className="!text-[#1D9E75]" /> Connected care workspace
                    </span>
                    <span className="text-[8px] font-medium !text-[#A4A79F] sm:text-[9px]">Illustrative data</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="mobile" className="relative my-2 overflow-hidden !bg-[#0C1A12] py-16 sm:my-0 sm:py-20 lg:py-24">
        <div
          className="pointer-events-none absolute inset-0 opacity-60"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(93,202,165,0.11) 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />
        <div className="pointer-events-none absolute -left-28 top-10 h-80 w-80 rounded-full !bg-[#1D9E75]/20 blur-[110px]" />
        <div className="pointer-events-none absolute -right-28 bottom-0 h-96 w-96 rounded-full !bg-[#2563EB]/10 blur-[120px]" />

        <div className="relative mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border !border-white/10 !bg-white/[0.06] px-3 py-1.5">
              <span className="h-1.5 w-1.5 rounded-full !bg-[#5DCAA5]" />
              <span className="text-[10px] font-bold uppercase tracking-[0.14em] !text-[#8FE0BF]">Care, in your pocket</span>
            </div>
            <h2 className="mt-5 text-[30px] font-extrabold leading-tight tracking-[-0.035em] !text-white sm:text-[38px] lg:text-[44px]">
              Hospital work doesn&apos;t stop at the desktop.
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-[13.5px] font-medium leading-relaxed !text-[#A5B8AD] sm:text-[14px]">
              A responsive workspace keeps essential patient, visit, and organization tools clear on the screens teams carry every day.
            </p>
          </div>

          <div
            className="-mx-5 mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-5 [scrollbar-width:none] sm:mx-0 sm:mt-12 sm:gap-5 sm:px-0 lg:grid lg:grid-cols-3 lg:gap-6 lg:overflow-visible lg:pb-0 [&::-webkit-scrollbar]:hidden"
            aria-label="Wellflexia mobile screen gallery"
          >
            {MOBILE_SHOWCASES.map((screen, index) => (
              <article
                key={screen.image}
                className="group w-[78vw] max-w-[290px] shrink-0 snap-center overflow-hidden rounded-[22px] border !border-white/10 !bg-white/[0.045] p-3.5 transition duration-300 hover:-translate-y-1 hover:!border-[#5DCAA5]/35 hover:!bg-white/[0.07] sm:w-[44vw] sm:max-w-[320px] sm:rounded-[26px] sm:p-5 lg:w-auto lg:max-w-none"
              >
                <div className="relative mx-auto w-full max-w-[250px]">
                  <div className="pointer-events-none absolute inset-x-[15%] bottom-[8%] h-8 rounded-full bg-black/60 blur-xl" />
                  <Image
                    src={screen.image}
                    alt={screen.alt}
                    width={768}
                    height={1152}
                    loading="eager"
                    unoptimized
                    sizes="(min-width: 1024px) 250px, (min-width: 640px) 280px, 78vw"
                    className="relative h-auto w-full select-none drop-shadow-[0_22px_30px_rgba(0,0,0,0.35)] transition-transform duration-500 group-hover:scale-[1.025]"
                  />
                </div>
                <div className="px-1 pb-1 pt-3 sm:px-2 sm:pt-4">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[9px] font-extrabold uppercase tracking-[0.13em] !text-[#69D3A9]">{screen.category}</span>
                    <span className="font-mono text-[10px] font-semibold !text-white/35">0{index + 1}</span>
                  </div>
                  <h3 className="mt-2 text-[15px] font-extrabold tracking-[-0.02em] !text-white sm:text-[16px]">{screen.title}</h3>
                  <p className="mt-1.5 min-h-[40px] text-[11.5px] font-medium leading-relaxed !text-[#A5B8AD] sm:text-[12px]">{screen.copy}</p>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-4 flex items-center justify-center gap-2 text-center text-[10px] font-medium !text-white/45 md:hidden">
            <span className="h-1 w-1 rounded-full !bg-[#5DCAA5]" />
            Swipe to explore the mobile screens
            <span className="h-1 w-1 rounded-full !bg-[#5DCAA5]" />
          </div>
        </div>
      </section>

      <section id="roles" className="my-2 border-y !border-[#E8E6E0] !bg-white py-16 sm:my-0 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-5xl px-5 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-[11px] font-extrabold uppercase tracking-[0.14em] !text-[#1D9E75]">Role-aware, by default</p>
            <h2 className="mt-4 text-[26px] font-extrabold tracking-[-0.02em] !text-[#14231A] sm:text-[30px] md:text-[34px]">
              Everyone sees what their shift needs.
            </h2>
            <p className="mx-auto mt-4 max-w-md text-[13.5px] font-medium leading-relaxed !text-[#6b6b64] sm:text-[14px]">
              Access is checked at the endpoint, not assumed at the login screen. Pick a role to see exactly what it can reach.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-4 lg:grid-cols-[300px_1fr] lg:gap-6">
            <div
              className="-mx-5 flex snap-x snap-mandatory gap-2 overflow-x-auto px-5 pb-1 [&::-webkit-scrollbar]:hidden lg:hidden"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {ROLES.map((r) => {
                const Icon = ROLE_ICONS[r];
                const isActive = r === activeRole;
                const isGuest = r === 'GUEST';
                return (
                  <button
                    key={r}
                    onClick={() => setActiveRole(r)}
                    className={`group flex shrink-0 snap-start items-center gap-2 rounded-full border px-3.5 py-2.5 transition-all duration-200 active:scale-95 ${isActive
                        ? isGuest
                          ? '!border-[#D97706] !bg-[#D97706] shadow-sm shadow-[#D97706]/25'
                          : '!border-[#1D9E75] !bg-[#1D9E75] shadow-sm shadow-[#1D9E75]/25'
                        : '!border-[#E8E6E0] !bg-[#FAFAF8]'
                      }`}
                  >
                    <Icon
                      size={15}
                      strokeWidth={2.5}
                      className={isActive ? '!text-white' : isGuest ? '!text-[#D97706]' : '!text-[#1D9E75]'}
                    />
                    <span className={`whitespace-nowrap text-[12.5px] font-bold tracking-tight ${isActive ? '!text-white' : '!text-[#14231A]'
                      }`}>
                      {r.replace('_', ' ')}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="hidden gap-2.5 lg:grid">
              {ROLES.map((r) => {
                const Icon = ROLE_ICONS[r];
                const isActive = r === activeRole;
                const isGuest = r === 'GUEST';
                return (
                  <button
                    key={r}
                    onClick={() => setActiveRole(r)}
                    className={`group flex w-full items-center gap-3 rounded-md border px-4 py-2.5 text-left transition-all duration-200 ${isActive
                        ? isGuest
                          ? '!border-[#D97706] !bg-[#D97706]'
                          : '!border-[#1D9E75] !bg-[#1D9E75]'
                        : '!border-[#E8E6E0] !bg-[#FAFAF8] hover:!border-[#D3D1C7]'
                      }`}
                  >
                    <div
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md transition-all duration-200 ${isActive
                          ? '!bg-white/20 group-hover:scale-105'
                          : isGuest
                            ? '!bg-[#FFFBEB] group-hover:bg-[#FEF3C7]'
                            : '!bg-white group-hover:bg-[#F0FDF4]'
                        }`}
                    >
                      <Icon
                        size={15}
                        strokeWidth={2.5}
                        className={`transition-all duration-200 ${isActive ? '!text-white' : isGuest ? '!text-[#D97706]' : '!text-[#1D9E75]'
                          } group-hover:scale-105`}
                      />
                    </div>
                    <p
                      className={`m-0 min-w-0 flex-1 text-[13px] font-bold leading-none tracking-tight ${isActive ? '!text-white' : '!text-[#14231A]'
                        }`}
                    >
                      {r.replace('_', ' ')}
                    </p>
                  </button>
                );
              })}
            </div>

            <div className="rounded-2xl border !border-[#E8E6E0] !bg-[#FAFAF8] p-5 sm:p-7">
              <div className="flex items-start gap-3.5">
                <div
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${activeRole === 'GUEST' ? '!bg-[#FFFBEB] !text-[#D97706]' : '!bg-[#F0FAF5] !text-[#1D9E75]'
                    }`}
                >
                  {(() => {
                    const ActiveIcon = ROLE_ICONS[activeRole];
                    return <ActiveIcon size={19} />;
                  })()}
                </div>
                <div>
                  <p className="text-[15px] font-extrabold !text-[#14231A]">{activeRole.replace('_', ' ')}</p>
                  <p className="mt-1 text-[13px] font-medium leading-relaxed !text-[#6b6b64]">
                    {ROLE_DESCRIPTIONS[activeRole]}
                  </p>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-3">
                {DOMAINS.map((d, i) => {
                  const access = ROLE_ACCESS[activeRole][i];
                  const isFull = access === true;
                  const isPartial = access === 'partial';

                  return (
                    <div
                      key={d}
                      className={`flex items-center gap-2 rounded-lg border px-3 py-2 ${isFull
                          ? '!border-[#1D9E75]/20 !bg-[#F0FAF5]'
                          : isPartial
                            ? '!border-[#D97706]/20 !bg-[#FFFBEB]'
                            : '!border-[#E8E6E0] !bg-white'
                        }`}
                    >
                      {isFull ? (
                        <Check size={13} className="!text-[#1D9E75]" />
                      ) : isPartial ? (
                        <Minus size={13} className="!text-[#D97706]" />
                      ) : (
                        <X size={13} className="!text-[#B4B2A9]" />
                      )}
                      <span className={`text-[11.5px] font-semibold ${isFull
                          ? '!text-[#14231A]'
                          : isPartial
                            ? '!text-[#D97706]'
                            : '!text-[#B4B2A9]'
                        }`}>
                        {d}
                      </span>
                      {isPartial && (
                        <span className="ml-0.5 text-[9px] font-bold uppercase tracking-[0.06em] !text-[#D97706]">
                          partial
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="guest" className="my-2 !bg-[#FAFAF8] py-16 sm:my-0 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-6xl px-5 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
            <div>
              <p className="text-[11px] font-extrabold uppercase tracking-[0.14em] !text-[#D97706]">Guest access</p>
              <h2 className="mt-4 text-[26px] font-extrabold tracking-[-0.02em] !text-[#14231A] sm:text-[30px] md:text-[34px]">
                Need to look around first?
              </h2>
              <p className="mt-4 text-[13.5px] font-medium leading-relaxed !text-[#6b6b64] sm:text-[14px]">
                Guest accounts are not a lighter version of a staff account — they are denied by default on every
                endpoint, and opened up only where a screen has been marked safe for guests. Access is requested,
                reviewed, time-boxed, and closes on its own.
              </p>
              <a
                href="/guest-access"
                className="mt-6 inline-flex items-center gap-2 rounded-full !bg-[#0C1A12] px-5 py-2.5 text-[13px] font-bold !text-white transition hover:!bg-[#14231A] active:scale-[0.98]"
              >
                <KeyRound size={14} />
                Request guest access
              </a>
            </div>

            <div className="relative pl-8 sm:pl-10">
              <div className="absolute left-[13px] top-2 bottom-2 w-px !bg-[#D97706]/25 sm:left-[15px]" />
              <div className="flex flex-col gap-6 sm:gap-7">
                {GUEST_STEPS.map((step, i) => (
                  <div key={step.label} className="relative">
                    <div className="absolute -left-8 top-0 flex h-7 w-7 items-center justify-center rounded-full border-2 !border-[#D97706] !bg-white text-[11.5px] font-extrabold !text-[#D97706] sm:-left-10">
                      {i + 1}
                    </div>
                    <div className="rounded-xl border !border-[#E8E6E0] !bg-white px-4 py-3.5 sm:px-5 sm:py-4">
                      <p className="text-[13.5px] font-extrabold !text-[#14231A]">{step.label}</p>
                      <p className="mt-1 text-[12.5px] font-medium leading-relaxed !text-[#6b6b64]">{step.copy}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="security" className="my-2 border-t !border-[#E8E6E0] !bg-white py-16 sm:my-0 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-6xl px-5 sm:px-6 lg:px-8">
          <div className="mx-auto mb-10 max-w-lg text-center sm:mb-12">
            <p className="text-[11px] font-extrabold uppercase tracking-[0.14em] !text-[#1D9E75]">Underneath it all</p>
            <h2 className="mt-4 text-[24px] font-extrabold tracking-[-0.02em] !text-[#14231A] sm:text-[28px]">
              Security that doesn&apos;t ask to be trusted.
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {SECURITY.map((s) => {
              const Icon = s.icon;
              return (
                <div
                  key={s.label}
                  className={
                    s.accent
                      ? 'rounded-2xl border !border-[#1D9E75]/30 !bg-[#0C1A12] p-5 sm:p-6'
                      : 'rounded-2xl border !border-[#E8E6E0] !bg-[#FAFAF8] p-5 sm:p-6'
                  }
                >
                  <div className={`flex h-10 w-10 mb-8 items-center justify-center rounded-lg ${s.accent ? '!text-[#5DCAA5]' : '!text-[#5DCAA5]'}`}>
                    <Icon size={22} strokeWidth={2.5} />
                  </div>
                  <p className={`mt-3.5 text-[14px] font-extrabold ${s.accent ? '!text-white' : '!text-[#14231A]'}`}>{s.label}</p>
                  <p className={`mt-1 text-[12.5px] font-medium leading-relaxed ${s.accent ? '!text-[#8fa89a]' : '!text-[#6b6b64]'}`}>{s.copy}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="relative my-2 overflow-hidden !bg-[#0C1A12] py-16 sm:my-0 sm:py-20 lg:py-24">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px)',
            backgroundSize: '22px 22px',
          }}
        />
        <div className="pointer-events-none absolute left-1/2 top-0 h-64 w-64 -translate-x-1/2 rounded-full !bg-[#1D9E75]/15 blur-[100px]" />

        <div className="relative mx-auto max-w-4xl px-5 sm:px-6">
          <div className="flex flex-col items-center gap-6 lg:flex-row lg:gap-12">
            <div className="flex-1 text-center lg:text-left">
              <h2 className="text-[28px] font-extrabold tracking-[-0.02em] !text-white sm:text-[32px] md:text-[36px]">
                Ready to see it <span className="italic !text-[#5DCAA5]">running</span>?
              </h2>
              <p className="mt-3 text-[14px] font-medium !text-[#8fa89a] sm:text-[14px] max-w-sm mx-auto lg:mx-0">
                <span className="font-bold !text-[#5DCAA5]">No sprints required</span> — our platform is already in motion.
                Sign in if you&apos;re on staff, or request guest access for a first look.
              </p>
              <div className="mt-6 flex flex-row items-stretch justify-center gap-2 sm:gap-3 lg:justify-start">
                <a
                  href="/login"
                  className="inline-flex min-h-11 min-w-0 flex-1 items-center justify-center gap-1.5 rounded-full !bg-[#1D9E75] px-2.5 py-2.5 text-[11.5px] font-bold !text-white transition hover:!bg-[#1a8a68] active:scale-[0.98] sm:min-h-12 sm:w-auto sm:flex-none sm:gap-2 sm:px-6 sm:py-3 sm:text-[14px]"
                >
                  Sign in
                  <ArrowRight size={15} />
                </a>
                <a
                  href="/guest-access"
                  className="inline-flex min-h-11 min-w-0 flex-1 items-center justify-center gap-1.5 rounded-full border !border-white/15 !bg-white/[0.04] px-2.5 py-2.5 text-[10.5px] font-bold leading-tight !text-white transition hover:!bg-white/[0.09] active:scale-[0.98] sm:min-h-12 sm:w-auto sm:flex-none sm:gap-2 sm:px-6 sm:py-3 sm:text-[14px]"
                >
                  Request guest access
                </a>
              </div>
            </div>

            <div className="relative flex-shrink-0 w-40 h-40 sm:w-48 sm:h-48 md:w-56 md:h-56 lg:w-64 lg:h-64 -mt-2 sm:mt-0">
              <div className="absolute inset-0 rounded-full !bg-[#1D9E75]/5 blur-2xl" />
              <div className="relative h-full w-full animate-[floatSlow_6s_ease-in-out_infinite]">
                <Lottie animationData={runAnimation} loop autoplay />
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="!bg-[#0C1A12] pb-8 sm:pb-10">
        <div className="mx-auto max-w-6xl px-5 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-8 border-t !border-white/10 pt-10 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <div className="flex items-center gap-2.5">
                <span className="text-[20px] font-bold italic tracking-[-0.02em] !text-white sm:text-[22px]">
                  well<span className="!text-[#1D9E75] underline decoration-[#1D9E75]/30 underline-offset-4">flex</span>ia !
                </span>
              </div>
              <p className="mt-3 max-w-xs text-[12.5px] font-medium leading-relaxed !text-[#5a7a6a]">
                Hospital operations, run as connected services — patients, visits, theatre, billing, and audit,
                on one platform.
              </p>
            </div>

            <div className="flex gap-10 sm:gap-12">
              <div className="flex flex-col gap-2.5">
                <p className="text-[11px] font-extrabold uppercase tracking-[0.08em] !text-[#3B6D11]">Platform</p>
                <a href="#platform" className="text-[12.5px] font-medium !text-[#8fa89a] hover:!text-white">Patient journey</a>
                <a href="#preview" className="text-[12.5px] font-medium !text-[#8fa89a] hover:!text-white">Product preview</a>
                <a href="#mobile" className="text-[12.5px] font-medium !text-[#8fa89a] hover:!text-white">Mobile experience</a>
                <a href="#roles" className="text-[12.5px] font-medium !text-[#8fa89a] hover:!text-white">Roles</a>
                <a href="#security" className="text-[12.5px] font-medium !text-[#8fa89a] hover:!text-white">Security</a>
              </div>
              <div className="flex flex-col gap-2.5">
                <p className="text-[11px] font-extrabold uppercase tracking-[0.08em] !text-[#3B6D11]">Access</p>
                <a href="/login" className="text-[12.5px] font-medium !text-[#8fa89a] hover:!text-white">Sign in</a>
                <a href="/guest-access" className="text-[12.5px] font-medium !text-[#8fa89a] hover:!text-white">Request guest access</a>
              </div>
            </div>
          </div>

          <div className="mt-10 flex flex-col gap-3 border-t !border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-[11.5px] font-medium !text-[#3B6D11]">© {new Date().getFullYear()} wellflexia. Built for real hospital operations.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}