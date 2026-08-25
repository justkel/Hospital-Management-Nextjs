'use client';

import { useState } from 'react';
import Lottie from 'lottie-react';
import {
  ArrowRight,
  ArrowUpRight,
  Bed,
  BedDouble,
  CheckCircle2,
  ClipboardList,
  FileClock,
  FlaskConical,
  Gauge,
  KeyRound,
  Lock,
  Menu,
  Receipt,
  ShieldCheck,
  Timer,
  UserRound,
  X,
  Check,
  HeartPulse,
  Pill,
  Stethoscope,
  LucideIcon,
} from 'lucide-react';

import heroAnimation from '@/animations/health1.json';
import careAnimation from '@/animations/doc-pat1.json';
import runAnimation from '@/animations/run1.json';

const SERVICES = [
  { name: 'Main', role: 'Operational core', detail: 'Patients, visits, theatre, wards, billing — the record of truth.' },
  { name: 'Auth', role: 'Identity layer', detail: 'Credentials, sessions, token rotation, guest-access checks.' },
  { name: 'Audit', role: 'Compliance layer', detail: 'Every actor, every action, queryable and filterable.' },
  { name: 'Notification', role: 'Messaging layer', detail: 'Event-driven email for staff, resets, and reminders.' },
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
    icon: Receipt,
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
  BILLING_OFFICER: Receipt,
  GUEST: KeyRound,
};

const ROLE_ACCESS: Record<string, boolean[]> = {
  ADMIN: [true, true, true, true, true, true],
  DOCTOR: [true, true, true, false, true, false],
  NURSE: [true, true, true, false, false, false],
  PHARMACIST: [true, true, false, false, false, false],
  RECEPTIONIST: [true, true, false, false, false, false],
  LAB_TECH: [false, false, false, false, true, false],
  BILLING_OFFICER: [false, false, false, true, false, false],
  GUEST: [true, true, true, true, true, false],
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
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6 sm:py-4 lg:px-8">
          <div className="flex items-center gap-2 sm:gap-2.5">
            <span className="text-[20px] font-bold italic tracking-[-0.02em] !text-[#14231A] sm:text-[22px]">
              well<span className="!text-[#1D9E75] underline decoration-[#1D9E75]/30 underline-offset-4">flex</span>ia !
            </span>
          </div>

          <nav className="hidden items-center gap-6 lg:flex xl:gap-8">
            <a href="#platform" className="text-[13px] font-semibold !text-[#5c5c56] transition hover:!text-[#14231A]">Platform</a>
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
          <div className="border-t !border-[#E8E6E0] px-4 py-4 sm:hidden">
            <div className="flex flex-col gap-3">
              <a href="#platform" className="text-[13px] font-semibold !text-[#5c5c56]">Platform</a>
              <a href="#roles" className="text-[13px] font-semibold !text-[#5c5c56]">Roles</a>
              <a href="#security" className="text-[13px] font-semibold !text-[#5c5c56]">Security</a>
              <a href="#guest" className="text-[13px] font-semibold !text-[#5c5c56]">Guest access</a>
              <div className="mt-2 flex flex-col gap-2">
                <a href="/login" className="rounded-full border !border-[#E8E6E0] px-4 py-2.5 text-center text-[13px] font-semibold !text-[#14231A]">Sign in</a>
                <a href="/guest-access" className="rounded-full !bg-[#0C1A12] px-4 py-2.5 text-center text-[13px] font-semibold !text-white">Request guest access</a>
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

        <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-4 pb-14 pt-14 sm:px-6 sm:pb-16 sm:pt-20 md:pt-24 lg:grid-cols-[1.05fr_0.95fr] lg:gap-8 lg:px-8 lg:pb-20 lg:pt-24 xl:gap-14">
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

            <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row lg:justify-start">
              <a
                href="/login"
                className="inline-flex w-full items-center justify-center gap-2 rounded-full !bg-[#1D9E75] px-4 py-3 text-[13px] font-bold !text-white transition hover:!bg-[#1a8a68] active:scale-[0.98] sm:w-auto sm:px-6 sm:text-[14px]"
              >
                Sign in
                <ArrowRight size={14} className="sm:size-[15px]" />
              </a>
              <a
                href="/guest-access"
                className="inline-flex w-full items-center justify-center gap-2 rounded-full border !border-white/15 !bg-white/[0.04] px-4 py-3 text-[13px] font-bold !text-white transition hover:!bg-white/[0.09] active:scale-[0.98] sm:w-auto sm:px-6 sm:text-[14px]"
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

      <section id="platform" className="border-b !border-[#E8E6E0] !bg-white py-14 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-12 max-w-lg text-center sm:mb-16">
            <div className="inline-flex items-center gap-2 rounded-full !bg-[#F0FAF5] px-3 py-1">
              <span className="h-1.5 w-1.5 rounded-full !bg-[#1D9E75]" />
              <span className="text-[10px] font-bold uppercase tracking-[0.12em] !text-[#1D9E75]">Architecture</span>
            </div>
            <h2 className="mt-3 text-[28px] font-extrabold tracking-[-0.02em] !text-[#14231A] sm:text-[32px]">
              One gateway. <span className="!text-[#1D9E75]">Five services.</span>
            </h2>
            <p className="mt-3 text-[14px] font-medium !text-[#6b6b64] max-w-sm mx-auto">
              Every request flows through a single entry point, then routes to the right service.
            </p>
          </div>

          <div className="relative mx-auto flex max-w-xs flex-col items-center">
            <div className="w-full max-w-[220px] rounded-2xl border-2 !border-[#1D9E75] !bg-[#F0FAF5] px-5 py-4 shadow-[0_4px_16px_rgba(29,158,117,0.12)]">
              <p className="text-center text-[14px] font-extrabold !text-[#14231A]">Gateway</p>
              <p className="mt-0.5 text-center text-[10.5px] font-semibold uppercase tracking-[0.06em] !text-[#1D9E75]">Public entry point</p>
            </div>
            <div className="relative h-8 w-px">
              <div className="absolute inset-0 !bg-gradient-to-b !from-[#1D9E75]/30 !to-[#1D9E75]/10" />
            </div>
          </div>

          <div className="relative mx-auto mt-0 hidden max-w-5xl md:block">
            <div className="relative mx-auto h-px w-[86%]">
              <div className="absolute inset-0 !bg-gradient-to-r !from-transparent !via-[#1D9E75]/30 !to-transparent" />
              <div className="absolute left-[10%] top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full !bg-[#1D9E75]/20" />
              <div className="absolute left-[30%] top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full !bg-[#1D9E75]/30" />
              <div className="absolute left-[50%] top-1/2 h-2 w-2 -translate-y-1/2 rounded-full !bg-[#1D9E75]/40" />
              <div className="absolute left-[70%] top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full !bg-[#1D9E75]/30" />
              <div className="absolute right-[10%] top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full !bg-[#1D9E75]/20" />
            </div>
          </div>

          <div className="mx-auto mt-6 grid max-w-5xl grid-cols-1 gap-4 sm:grid-cols-2 md:mt-0 md:grid-cols-4 md:gap-4">
            {SERVICES.map((s, index) => (
              <div key={s.name} className="flex flex-col items-center">
                <div className="hidden h-5 w-px !bg-[#1D9E75]/25 md:block" />
                <div className="group h-full w-full rounded-xl border !border-[#E8E6E0] !bg-[#FAFAF8] p-4 transition-all duration-300 hover:!border-[#1D9E75]/40 hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] hover:-translate-y-0.5">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-[14px] font-extrabold !text-[#14231A] group-hover:!text-[#1D9E75] transition-colors">
                        {s.name}
                      </p>
                      <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.08em] !text-[#B4B2A9]">
                        {s.role}
                      </p>
                    </div>
                    <span className="flex h-6 w-6 items-center justify-center rounded-full !bg-[#F0FAF5] text-[10px] font-bold !text-[#1D9E75]">
                      {index + 1}
                    </span>
                  </div>
                  <p className="mt-3 text-[12.5px] font-medium leading-relaxed !text-[#6b6b64] group-hover:!text-[#5c5c56] transition-colors">
                    {s.detail}
                  </p>
                  <div className="mt-3 h-0.5 w-8 rounded-full !bg-[#1D9E75]/20 group-hover:!bg-[#1D9E75]/60 transition-all group-hover:w-12" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="!bg-[#FAFAF8] py-14 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-10 max-w-lg text-center sm:mb-12">
            <p className="text-[11px] font-extrabold uppercase tracking-[0.14em] !text-[#1D9E75]">Everything on one record</p>
            <h2 className="mt-2 text-[26px] font-extrabold tracking-[-0.02em] !text-[#14231A] sm:text-[30px] md:text-[34px]">
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

      <section id="roles" className="border-y !border-[#E8E6E0] !bg-white py-14 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-[11px] font-extrabold uppercase tracking-[0.14em] !text-[#1D9E75]">Role-aware, by default</p>
            <h2 className="mt-2 text-[26px] font-extrabold tracking-[-0.02em] !text-[#14231A] sm:text-[30px] md:text-[34px]">
              Everyone sees what their shift needs.
            </h2>
            <p className="mx-auto mt-4 max-w-md text-[13.5px] font-medium leading-relaxed !text-[#6b6b64] sm:text-[14px]">
              Access is checked at the endpoint, not assumed at the login screen. Pick a role to see exactly what it can reach.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-4 lg:grid-cols-[300px_1fr] lg:gap-6">
            <div
              className="-mx-4 flex snap-x snap-mandatory gap-2 overflow-x-auto px-4 pb-1 [&::-webkit-scrollbar]:hidden lg:hidden"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >              {ROLES.map((r) => {
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
                  const allowed = ROLE_ACCESS[activeRole][i];
                  return (
                    <div
                      key={d}
                      className={`flex items-center gap-2 rounded-lg border px-3 py-2 ${allowed ? '!border-[#1D9E75]/20 !bg-[#F0FAF5]' : '!border-[#E8E6E0] !bg-white'
                        }`}
                    >
                      {allowed ? (
                        <Check size={13} className="!text-[#1D9E75]" />
                      ) : (
                        <X size={13} className="!text-[#B4B2A9]" />
                      )}
                      <span className={`text-[11.5px] font-semibold ${allowed ? '!text-[#14231A]' : '!text-[#B4B2A9]'}`}>
                        {d}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="guest" className="!bg-[#FAFAF8] py-14 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
            <div>
              <p className="text-[11px] font-extrabold uppercase tracking-[0.14em] !text-[#D97706]">Guest access</p>
              <h2 className="mt-2 text-[26px] font-extrabold tracking-[-0.02em] !text-[#14231A] sm:text-[30px] md:text-[34px]">
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

      <section id="security" className="border-t !border-[#E8E6E0] !bg-white py-14 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-10 max-w-lg text-center sm:mb-12">
            <p className="text-[11px] font-extrabold uppercase tracking-[0.14em] !text-[#1D9E75]">Underneath it all</p>
            <h2 className="mt-2 text-[24px] font-extrabold tracking-[-0.02em] !text-[#14231A] sm:text-[28px]">
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

      <section className="relative overflow-hidden !bg-[#0C1A12] py-16 sm:py-20">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px)',
            backgroundSize: '22px 22px',
          }}
        />
        <div className="pointer-events-none absolute left-1/2 top-0 h-64 w-64 -translate-x-1/2 rounded-full !bg-[#1D9E75]/15 blur-[100px]" />

        <div className="relative mx-auto max-w-4xl px-4 sm:px-6">
          <div className="flex flex-col items-center gap-6 lg:flex-row lg:gap-12">
            <div className="flex-1 text-center lg:text-left">
              <h2 className="text-[28px] font-extrabold tracking-[-0.02em] !text-white sm:text-[32px] md:text-[36px]">
                Ready to see it <span className="italic !text-[#5DCAA5]">running</span>?
              </h2>
              <p className="mt-3 text-[14px] font-medium !text-[#8fa89a] sm:text-[14px] max-w-sm mx-auto lg:mx-0">
                <span className="font-bold !text-[#5DCAA5]">No sprints required</span> — our platform is already in motion.
                Sign in if you&apos;re on staff, or request guest access for a first look.
              </p>
              <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row lg:justify-start">
                <a
                  href="/login"
                  className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-full !bg-[#1D9E75] px-6 py-3 text-[14px] font-bold !text-white transition hover:!bg-[#1a8a68] active:scale-[0.98]"
                >
                  Sign in
                  <ArrowRight size={15} />
                </a>
                <a
                  href="/guest-access"
                  className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-full border !border-white/15 !bg-white/[0.04] px-6 py-3 text-[14px] font-bold !text-white transition hover:!bg-white/[0.09] active:scale-[0.98]"
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
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-8 border-t !border-white/10 pt-10 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <div className="flex items-center gap-2.5">
                <span className="text-[20px] font-bold italic tracking-[-0.02em] !text-white sm:text-[22px]">
                  well<span className="!text-[#1D9E75] font-extrabold">flex</span>ia !
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
                <a href="#platform" className="text-[12.5px] font-medium !text-[#8fa89a] hover:!text-white">Architecture</a>
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