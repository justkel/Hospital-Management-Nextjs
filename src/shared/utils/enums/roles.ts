import { StaffRole } from '@/shared/graphql/generated/graphql';

export const Roles = {
  ADMIN: StaffRole.Admin,
  DOCTOR: StaffRole.Doctor,
  NURSE: StaffRole.Nurse,
  RECEPTIONIST: StaffRole.Receptionist,
  PHARMACIST: StaffRole.Pharmacist,
  LAB_TECH: StaffRole.LabTech,
  BILLING_OFFICER: StaffRole.BillingOfficer,
  GUEST: StaffRole.Guest,
} as const;

export type Roles = (typeof Roles)[keyof typeof Roles];

export type RoleStyle = {
  bg: string;
  text: string;
  ring?: string;
};

export const ROLE_STYLES: Record<Roles, RoleStyle> = {
  [Roles.ADMIN]: {
    bg: 'bg-red-100',
    text: 'text-red-700',
    ring: 'ring-red-300',
  },

  [Roles.DOCTOR]: {
    bg: 'bg-blue-100',
    text: 'text-blue-700',
    ring: 'ring-blue-300',
  },

  [Roles.NURSE]: {
    bg: 'bg-emerald-100',
    text: 'text-emerald-700',
    ring: 'ring-emerald-300',
  },

  [Roles.RECEPTIONIST]: {
    bg: 'bg-amber-100',
    text: 'text-amber-700',
    ring: 'ring-amber-300',
  },

  [Roles.PHARMACIST]: {
    bg: 'bg-purple-100',
    text: 'text-purple-700',
    ring: 'ring-purple-300',
  },

  [Roles.LAB_TECH]: {
    bg: 'bg-cyan-100',
    text: 'text-cyan-700',
    ring: 'ring-cyan-300',
  },

  [Roles.BILLING_OFFICER]: {
    bg: 'bg-indigo-100',
    text: 'text-indigo-700',
    ring: 'ring-indigo-300',
  },

  [Roles.GUEST]: {
    bg: 'bg-slate-100',
    text: 'text-slate-700',
    ring: 'ring-slate-300',
  },
};