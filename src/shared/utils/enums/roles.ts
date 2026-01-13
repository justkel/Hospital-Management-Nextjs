import { StaffRole } from '@/shared/graphql/generated/graphql';

export enum Roles {
  ADMIN = 'ADMIN',
  DOCTOR = 'DOCTOR',
  NURSE = 'NURSE',
  RECEPTIONIST = 'RECEPTIONIST',
  PHARMACIST = 'PHARMACIST',
  LAB_TECH = 'LAB_TECH',
}

export type RoleStyle = {
  bg: string;
  text: string;
  ring?: string;
};

export const ROLE_STYLES: Record<StaffRole, RoleStyle> = {
  ADMIN: {
    bg: 'bg-red-100',
    text: 'text-red-700',
    ring: 'ring-red-300',
  },
  DOCTOR: {
    bg: 'bg-blue-100',
    text: 'text-blue-700',
    ring: 'ring-blue-300',
  },
  NURSE: {
    bg: 'bg-emerald-100',
    text: 'text-emerald-700',
    ring: 'ring-emerald-300',
  },
  RECEPTIONIST: {
    bg: 'bg-amber-100',
    text: 'text-amber-700',
    ring: 'ring-amber-300',
  },
  PHARMACIST: {
    bg: 'bg-purple-100',
    text: 'text-purple-700',
    ring: 'ring-purple-300',
  },
  LAB_TECH: {
    bg: 'bg-cyan-100',
    text: 'text-cyan-700',
    ring: 'ring-cyan-300',
  },
};
