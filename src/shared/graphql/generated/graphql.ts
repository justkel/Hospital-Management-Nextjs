/* eslint-disable @typescript-eslint/no-explicit-any */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  DateTime: { input: any; output: any; }
};

export type Address = {
  __typename?: 'Address';
  addressLine1: Scalars['String']['output'];
  city: Scalars['String']['output'];
  country: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  organization: Organization;
  organizationId: Scalars['ID']['output'];
  ownerId: Scalars['ID']['output'];
  ownerType: AddressOwnerType;
  state: Scalars['String']['output'];
};

export enum AddressOwnerType {
  Organization = 'ORGANIZATION',
  Patient = 'PATIENT',
  Staff = 'STAFF'
}

export type AuditLog = {
  __typename?: 'AuditLog';
  action: Scalars['String']['output'];
  actorDescription?: Maybe<Scalars['String']['output']>;
  actorId?: Maybe<Scalars['String']['output']>;
  actorType?: Maybe<Scalars['String']['output']>;
  appName: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  entity: Scalars['String']['output'];
  entityId?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  metadata?: Maybe<Scalars['String']['output']>;
  organizationId: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type AuthResponse = {
  __typename?: 'AuthResponse';
  accessToken: Scalars['String']['output'];
  refreshToken?: Maybe<Scalars['String']['output']>;
};

export type BillingCatalogueCategory = {
  __typename?: 'BillingCatalogueCategory';
  code: Scalars['String']['output'];
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  items?: Maybe<Array<GlobalBillingCatalogueItem>>;
  name: Scalars['String']['output'];
  organizationId?: Maybe<Scalars['ID']['output']>;
};

/** Blood group of the patient */
export enum BloodGroup {
  AbNeg = 'AB_NEG',
  AbPos = 'AB_POS',
  ANeg = 'A_NEG',
  APos = 'A_POS',
  BNeg = 'B_NEG',
  BPos = 'B_POS',
  ONeg = 'O_NEG',
  OPos = 'O_POS'
}

export type CreateAddressInput = {
  addressLine1: Scalars['String']['input'];
  city: Scalars['String']['input'];
  country: Scalars['String']['input'];
  state: Scalars['String']['input'];
};

export type CreateBillingCategoryInput = {
  code: Scalars['String']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
};

export type CreateBillingItemInput = {
  categoryId: Scalars['ID']['input'];
  code: Scalars['String']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
};

export type CreateOrganizationInput = {
  address?: InputMaybe<CreateAddressInput>;
  code?: InputMaybe<Scalars['String']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  phoneNumber?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<OrganizationStatus>;
  website?: InputMaybe<Scalars['String']['input']>;
};

export type CreatePatientInput = {
  addresses?: InputMaybe<Array<CreateAddressInput>>;
  allergies?: InputMaybe<Array<Scalars['String']['input']>>;
  bloodGroup?: InputMaybe<BloodGroup>;
  dateOfBirth?: InputMaybe<Scalars['String']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  emergency: Scalars['Boolean']['input'];
  extraDetails?: InputMaybe<Scalars['String']['input']>;
  fullName?: InputMaybe<Scalars['String']['input']>;
  gender: Scalars['String']['input'];
  nextOfKinName?: InputMaybe<Scalars['String']['input']>;
  nextOfKinPhone?: InputMaybe<Scalars['String']['input']>;
  phoneNumber?: InputMaybe<Scalars['String']['input']>;
  secondaryPhoneNumber?: InputMaybe<Scalars['String']['input']>;
};

export type CreatePatientResult = {
  __typename?: 'CreatePatientResult';
  matches?: Maybe<Array<DuplicatePatientMatch>>;
  patient: Patient;
  warning?: Maybe<Scalars['String']['output']>;
};

export type CreateStaffInput = {
  email: Scalars['String']['input'];
  fullName: Scalars['String']['input'];
  phoneNumber?: InputMaybe<Scalars['String']['input']>;
  roles: Array<StaffRole>;
};

export type CreateVisitInput = {
  patientId: Scalars['ID']['input'];
  visitType: VisitType;
};

export type CreateVisitVitalInput = {
  bloodPressure?: InputMaybe<Scalars['String']['input']>;
  heartRate?: InputMaybe<Scalars['Int']['input']>;
  height?: InputMaybe<Scalars['Float']['input']>;
  notes?: InputMaybe<Scalars['String']['input']>;
  respiratoryRate?: InputMaybe<Scalars['Int']['input']>;
  spo2?: InputMaybe<Scalars['Int']['input']>;
  temperature?: InputMaybe<Scalars['Float']['input']>;
  visitId: Scalars['ID']['input'];
  weight?: InputMaybe<Scalars['Float']['input']>;
};

export type DuplicatePatientMatch = {
  __typename?: 'DuplicatePatientMatch';
  confidence: Scalars['Float']['output'];
  fullName: Scalars['String']['output'];
  patientId: Scalars['String']['output'];
  patientNumber: Scalars['String']['output'];
};

export type GlobalBillingCatalogueItem = {
  __typename?: 'GlobalBillingCatalogueItem';
  code: Scalars['String']['output'];
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  organizationId?: Maybe<Scalars['ID']['output']>;
};

export type LoginAuthResponse = {
  __typename?: 'LoginAuthResponse';
  accessToken: Scalars['String']['output'];
  forcePasswordChange: Scalars['Boolean']['output'];
  refreshToken?: Maybe<Scalars['String']['output']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  cloneGlobalCategoryToOrganization: BillingCatalogueCategory;
  createBillingCategory: BillingCatalogueCategory;
  createBillingItem: GlobalBillingCatalogueItem;
  createOrganization: Organization;
  createPatient: CreatePatientResult;
  createStaff: Staff;
  createVisit: Visit;
  createVisitVital: VisitVital;
  refreshToken: AuthResponse;
  staffLogin: LoginAuthResponse;
  updateBillingCategory: BillingCatalogueCategory;
  updateOrganizationStatus: Organization;
  updatePatient: Patient;
  updatePatientStatus: Patient;
  updateStaff: Staff;
  updateStaffPassword: Scalars['Boolean']['output'];
  updateStaffRoles: Staff;
  updateStaffStatus: Staff;
  updateVisitVital: VisitVital;
};


export type MutationCloneGlobalCategoryToOrganizationArgs = {
  categoryId: Scalars['String']['input'];
  organizationId: Scalars['String']['input'];
};


export type MutationCreateBillingCategoryArgs = {
  data: CreateBillingCategoryInput;
};


export type MutationCreateBillingItemArgs = {
  data: CreateBillingItemInput;
};


export type MutationCreateOrganizationArgs = {
  data: CreateOrganizationInput;
};


export type MutationCreatePatientArgs = {
  data: CreatePatientInput;
};


export type MutationCreateStaffArgs = {
  data: CreateStaffInput;
};


export type MutationCreateVisitArgs = {
  data: CreateVisitInput;
};


export type MutationCreateVisitVitalArgs = {
  data: CreateVisitVitalInput;
};


export type MutationStaffLoginArgs = {
  input: StaffLoginInput;
};


export type MutationUpdateBillingCategoryArgs = {
  data: UpdateBillingCategoryInput;
};


export type MutationUpdateOrganizationStatusArgs = {
  id: Scalars['String']['input'];
  status: OrganizationStatus;
};


export type MutationUpdatePatientArgs = {
  data: UpdatePatientInput;
};


export type MutationUpdatePatientStatusArgs = {
  data: UpdatePatientStatusInput;
};


export type MutationUpdateStaffArgs = {
  data: UpdateStaffInput;
};


export type MutationUpdateStaffPasswordArgs = {
  input: UpdateStaffPasswordInput;
};


export type MutationUpdateStaffRolesArgs = {
  data: UpdateStaffRolesInput;
};


export type MutationUpdateStaffStatusArgs = {
  data: UpdateStaffStatusInput;
};


export type MutationUpdateVisitVitalArgs = {
  data: UpdateVisitVitalInput;
};

export type Organization = {
  __typename?: 'Organization';
  address?: Maybe<Address>;
  code?: Maybe<Scalars['String']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  organizationNumber: Scalars['String']['output'];
  phoneNumber?: Maybe<Scalars['String']['output']>;
  status: OrganizationStatus;
  website?: Maybe<Scalars['String']['output']>;
};

/** Status of the organization */
export enum OrganizationStatus {
  Active = 'ACTIVE',
  Inactive = 'INACTIVE'
}

export type PaginatedStaff = {
  __typename?: 'PaginatedStaff';
  items: Array<Staff>;
  page: Scalars['Int']['output'];
  pageCount: Scalars['Int']['output'];
  total: Scalars['Int']['output'];
};

export type Patient = {
  __typename?: 'Patient';
  addresses?: Maybe<Array<Maybe<Address>>>;
  allergies?: Maybe<Array<Scalars['String']['output']>>;
  bloodGroup?: Maybe<BloodGroup>;
  createdByStaffId?: Maybe<Scalars['ID']['output']>;
  dateOfBirth?: Maybe<Scalars['String']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  emergency: Scalars['Boolean']['output'];
  extraDetails?: Maybe<Scalars['String']['output']>;
  fullName?: Maybe<Scalars['String']['output']>;
  gender: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  likelyDuplicatePatientIds?: Maybe<Array<Scalars['ID']['output']>>;
  nextOfKinName?: Maybe<Scalars['String']['output']>;
  nextOfKinPhone?: Maybe<Scalars['String']['output']>;
  organization: Organization;
  organizationId: Scalars['ID']['output'];
  patientNumber: Scalars['String']['output'];
  phoneNumber?: Maybe<Scalars['String']['output']>;
  secondaryPhoneNumber?: Maybe<Scalars['String']['output']>;
  status: PatientStatus;
  userCode: Scalars['Float']['output'];
  userType: UserType;
};

export type PatientPaginationInput = {
  limit: Scalars['Float']['input'];
  page: Scalars['Float']['input'];
  status?: InputMaybe<PatientStatus>;
};

export type PatientPaginationResult = {
  __typename?: 'PatientPaginationResult';
  items: Array<Patient>;
  page: Scalars['Int']['output'];
  pageCount: Scalars['Int']['output'];
  total: Scalars['Int']['output'];
};

/** Status of the patient */
export enum PatientStatus {
  Active = 'ACTIVE',
  Deceased = 'DECEASED',
  Discharged = 'DISCHARGED',
  Inactive = 'INACTIVE',
  Pending = 'PENDING',
  Suspended = 'SUSPENDED'
}

export type Query = {
  __typename?: 'Query';
  adminOnly: Scalars['String']['output'];
  billingCategoryById: BillingCatalogueCategory;
  getAuditLogs: Array<AuditLog>;
  globalBillingCategories: Array<BillingCatalogueCategory>;
  health: Scalars['String']['output'];
  organization: Organization;
  organizationBillingCategories: Array<BillingCatalogueCategory>;
  organizations: Array<Organization>;
  patientById: Patient;
  patientVisitHistory: Array<Visit>;
  patients: PatientPaginationResult;
  searchPatient: Array<Patient>;
  searchStaff: Array<Staff>;
  secretRoute: Scalars['String']['output'];
  staffById: Staff;
  staffByRole: Array<Staff>;
  staffs: PaginatedStaff;
  visit: Visit;
  visitVitals: Array<VisitVital>;
  visits: VisitPaginationResult;
  whoAmI: WhoAmIDto;
};


export type QueryBillingCategoryByIdArgs = {
  categoryId: Scalars['String']['input'];
};


export type QueryOrganizationArgs = {
  id: Scalars['String']['input'];
};


export type QueryPatientByIdArgs = {
  id: Scalars['String']['input'];
};


export type QueryPatientVisitHistoryArgs = {
  patientId: Scalars['String']['input'];
};


export type QueryPatientsArgs = {
  pagination: PatientPaginationInput;
};


export type QuerySearchPatientArgs = {
  query: Scalars['String']['input'];
};


export type QuerySearchStaffArgs = {
  query: Scalars['String']['input'];
};


export type QueryStaffByIdArgs = {
  id: Scalars['String']['input'];
};


export type QueryStaffByRoleArgs = {
  role: StaffRole;
};


export type QueryStaffsArgs = {
  limit?: Scalars['Int']['input'];
  page?: Scalars['Int']['input'];
};


export type QueryVisitArgs = {
  id: Scalars['String']['input'];
};


export type QueryVisitVitalsArgs = {
  visitId: Scalars['String']['input'];
};


export type QueryVisitsArgs = {
  pagination: VisitPaginationInput;
};

export type Staff = {
  __typename?: 'Staff';
  email: Scalars['String']['output'];
  fullName: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  organization: Organization;
  organizationId: Scalars['ID']['output'];
  phoneNumber?: Maybe<Scalars['String']['output']>;
  roles: Array<StaffRole>;
  status: StaffStatus;
  userCode: Scalars['Float']['output'];
  userType: UserType;
};

export type StaffLoginInput = {
  password: Scalars['String']['input'];
  userCode: Scalars['Float']['input'];
};

/** Roles assigned to staff members */
export enum StaffRole {
  Admin = 'ADMIN',
  Doctor = 'DOCTOR',
  LabTech = 'LAB_TECH',
  Nurse = 'NURSE',
  Pharmacist = 'PHARMACIST',
  Receptionist = 'RECEPTIONIST'
}

/** Status of the staff member */
export enum StaffStatus {
  Active = 'ACTIVE',
  Inactive = 'INACTIVE',
  Pending = 'PENDING',
  Suspended = 'SUSPENDED'
}

export type UpdateBillingCategoryInput = {
  categoryId: Scalars['ID']['input'];
  code?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};

export type UpdatePatientInput = {
  addresses?: InputMaybe<Array<CreateAddressInput>>;
  allergies?: InputMaybe<Array<Scalars['String']['input']>>;
  bloodGroup?: InputMaybe<BloodGroup>;
  extraDetails?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['String']['input'];
  nextOfKinName?: InputMaybe<Scalars['String']['input']>;
  nextOfKinPhone?: InputMaybe<Scalars['String']['input']>;
  phoneNumber?: InputMaybe<Scalars['String']['input']>;
};

export type UpdatePatientStatusInput = {
  id: Scalars['String']['input'];
  organizationId: Scalars['String']['input'];
  status: PatientStatus;
};

export type UpdateStaffInput = {
  fullName?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  phoneNumber?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateStaffPasswordInput = {
  currentPassword: Scalars['String']['input'];
  newPassword: Scalars['String']['input'];
};

export type UpdateStaffRolesInput = {
  roles: Array<StaffRole>;
  staffId: Scalars['ID']['input'];
};

export type UpdateStaffStatusInput = {
  staffId: Scalars['String']['input'];
  status: StaffStatus;
};

export type UpdateVisitVitalInput = {
  bloodPressure?: InputMaybe<Scalars['String']['input']>;
  heartRate?: InputMaybe<Scalars['Int']['input']>;
  height?: InputMaybe<Scalars['Float']['input']>;
  notes?: InputMaybe<Scalars['String']['input']>;
  respiratoryRate?: InputMaybe<Scalars['Int']['input']>;
  spo2?: InputMaybe<Scalars['Int']['input']>;
  temperature?: InputMaybe<Scalars['Float']['input']>;
  vitalId: Scalars['ID']['input'];
  weight?: InputMaybe<Scalars['Float']['input']>;
};

/** Type of user */
export enum UserType {
  Admin = 'ADMIN',
  Patient = 'PATIENT',
  Staff = 'STAFF'
}

export type Visit = {
  __typename?: 'Visit';
  attendingStaffId?: Maybe<Scalars['ID']['output']>;
  closedAt?: Maybe<Scalars['DateTime']['output']>;
  id: Scalars['ID']['output'];
  organization: Organization;
  organizationId: Scalars['ID']['output'];
  patient: Patient;
  patientId: Scalars['ID']['output'];
  status: VisitStatus;
  visitDateTime: Scalars['DateTime']['output'];
  visitType: VisitType;
};

export type VisitPaginationInput = {
  limit: Scalars['Int']['input'];
  page: Scalars['Int']['input'];
  status?: InputMaybe<VisitStatus>;
  visitType?: InputMaybe<VisitType>;
};

export type VisitPaginationResult = {
  __typename?: 'VisitPaginationResult';
  items: Array<Visit>;
  page: Scalars['Int']['output'];
  pageCount: Scalars['Int']['output'];
  total: Scalars['Int']['output'];
};

/** Current status of a visit */
export enum VisitStatus {
  Admitted = 'ADMITTED',
  Cancelled = 'CANCELLED',
  Closed = 'CLOSED',
  Discharged = 'DISCHARGED',
  Open = 'OPEN'
}

/** Type of patient visit */
export enum VisitType {
  Admission = 'ADMISSION',
  Consultation = 'CONSULTATION',
  Daycare = 'DAYCARE',
  Emergency = 'EMERGENCY',
  FollowUp = 'FOLLOW_UP',
  Opd = 'OPD',
  Surgery = 'SURGERY',
  Telemedicine = 'TELEMEDICINE'
}

export type VisitVital = {
  __typename?: 'VisitVital';
  bloodPressure?: Maybe<Scalars['String']['output']>;
  bmi?: Maybe<Scalars['Float']['output']>;
  heartRate?: Maybe<Scalars['Float']['output']>;
  height?: Maybe<Scalars['Float']['output']>;
  id: Scalars['ID']['output'];
  notes?: Maybe<Scalars['String']['output']>;
  recordedByStaffId: Scalars['ID']['output'];
  respiratoryRate?: Maybe<Scalars['Float']['output']>;
  spo2?: Maybe<Scalars['Float']['output']>;
  temperature?: Maybe<Scalars['Float']['output']>;
  visitId: Scalars['ID']['output'];
  weight?: Maybe<Scalars['Float']['output']>;
};

export type WhoAmIDto = {
  __typename?: 'WhoAmIDto';
  email: Scalars['String']['output'];
  roles: Array<Scalars['String']['output']>;
};

export type StaffLoginMutationVariables = Exact<{
  input: StaffLoginInput;
}>;


export type StaffLoginMutation = { __typename?: 'Mutation', staffLogin: { __typename?: 'LoginAuthResponse', accessToken: string, refreshToken?: string | null } };

export type RefreshTokenMutationVariables = Exact<{ [key: string]: never; }>;


export type RefreshTokenMutation = { __typename?: 'Mutation', refreshToken: { __typename?: 'AuthResponse', accessToken: string, refreshToken?: string | null } };

export type WhoAmIQueryVariables = Exact<{ [key: string]: never; }>;


export type WhoAmIQuery = { __typename?: 'Query', whoAmI: { __typename?: 'WhoAmIDto', email: string, roles: Array<string> } };

export type GetAllStaffQueryVariables = Exact<{
  page?: Scalars['Int']['input'];
  limit?: Scalars['Int']['input'];
}>;


export type GetAllStaffQuery = { __typename?: 'Query', staffs: { __typename?: 'PaginatedStaff', total: number, page: number, pageCount: number, items: Array<{ __typename?: 'Staff', id: string, fullName: string, email: string, userCode: number, userType: UserType, roles: Array<StaffRole>, status: StaffStatus, phoneNumber?: string | null, organizationId: string }> } };

export type GetStaffByRoleQueryVariables = Exact<{
  role: StaffRole;
}>;


export type GetStaffByRoleQuery = { __typename?: 'Query', staffByRole: Array<{ __typename?: 'Staff', id: string, fullName: string, email: string, userCode: number, userType: UserType, roles: Array<StaffRole>, status: StaffStatus, phoneNumber?: string | null, organizationId: string }> };

export type CreateStaffMutationVariables = Exact<{
  data: CreateStaffInput;
}>;


export type CreateStaffMutation = { __typename?: 'Mutation', createStaff: { __typename?: 'Staff', id: string, fullName: string, email: string, userCode: number, userType: UserType, roles: Array<StaffRole>, phoneNumber?: string | null, organizationId: string } };

export type GetStaffByIdQueryVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type GetStaffByIdQuery = { __typename?: 'Query', staffById: { __typename?: 'Staff', id: string, fullName: string, email: string, phoneNumber?: string | null, roles: Array<StaffRole>, userCode: number, status: StaffStatus } };

export type SearchStaffQueryVariables = Exact<{
  query: Scalars['String']['input'];
}>;


export type SearchStaffQuery = { __typename?: 'Query', searchStaff: Array<{ __typename?: 'Staff', id: string, fullName: string, email: string, phoneNumber?: string | null, roles: Array<StaffRole>, userCode: number }> };

export type UpdateStaffMutationVariables = Exact<{
  data: UpdateStaffInput;
}>;


export type UpdateStaffMutation = { __typename?: 'Mutation', updateStaff: { __typename?: 'Staff', id: string, fullName: string, email: string, phoneNumber?: string | null, roles: Array<StaffRole> } };

export type UpdateStaffRolesMutationVariables = Exact<{
  data: UpdateStaffRolesInput;
}>;


export type UpdateStaffRolesMutation = { __typename?: 'Mutation', updateStaffRoles: { __typename?: 'Staff', id: string, fullName: string, email: string, roles: Array<StaffRole> } };

export type UpdateStaffStatusMutationVariables = Exact<{
  data: UpdateStaffStatusInput;
}>;


export type UpdateStaffStatusMutation = { __typename?: 'Mutation', updateStaffStatus: { __typename?: 'Staff', id: string, fullName: string, email: string, userCode: number, roles: Array<StaffRole>, status: StaffStatus, organizationId: string } };

export type UpdateStaffPasswordMutationVariables = Exact<{
  input: UpdateStaffPasswordInput;
}>;


export type UpdateStaffPasswordMutation = { __typename?: 'Mutation', updateStaffPassword: boolean };

export type CreatePatientMutationVariables = Exact<{
  data: CreatePatientInput;
}>;


export type CreatePatientMutation = { __typename?: 'Mutation', createPatient: { __typename?: 'CreatePatientResult', warning?: string | null, patient: { __typename?: 'Patient', id: string, patientNumber: string, fullName?: string | null, gender: string, phoneNumber?: string | null, email?: string | null, bloodGroup?: BloodGroup | null, emergency: boolean }, matches?: Array<{ __typename?: 'DuplicatePatientMatch', patientId: string, patientNumber: string, fullName: string, confidence: number }> | null } };

export type GetAllPatientsQueryVariables = Exact<{
  pagination: PatientPaginationInput;
}>;


export type GetAllPatientsQuery = { __typename?: 'Query', patients: { __typename?: 'PatientPaginationResult', total: number, page: number, pageCount: number, items: Array<{ __typename?: 'Patient', id: string, patientNumber: string, fullName?: string | null, gender: string, phoneNumber?: string | null, email?: string | null, bloodGroup?: BloodGroup | null, emergency: boolean, status: PatientStatus }> } };

export type SearchPatientQueryVariables = Exact<{
  query: Scalars['String']['input'];
}>;


export type SearchPatientQuery = { __typename?: 'Query', searchPatient: Array<{ __typename?: 'Patient', id: string, fullName?: string | null, email?: string | null, phoneNumber?: string | null, gender: string, patientNumber: string, status: PatientStatus, emergency: boolean }> };

export type GetPatientByIdQueryVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type GetPatientByIdQuery = { __typename?: 'Query', patientById: { __typename?: 'Patient', id: string, fullName?: string | null, dateOfBirth?: string | null, gender: string, phoneNumber?: string | null, secondaryPhoneNumber?: string | null, email?: string | null, patientNumber: string, userCode: number, status: PatientStatus, bloodGroup?: BloodGroup | null, allergies?: Array<string> | null, emergency: boolean, extraDetails?: string | null, nextOfKinName?: string | null, nextOfKinPhone?: string | null, createdByStaffId?: string | null, likelyDuplicatePatientIds?: Array<string> | null, addresses?: Array<{ __typename?: 'Address', addressLine1: string, city: string, state: string, country: string } | null> | null } };

export type UpdatePatientMutationVariables = Exact<{
  data: UpdatePatientInput;
}>;


export type UpdatePatientMutation = { __typename?: 'Mutation', updatePatient: { __typename?: 'Patient', id: string, userCode: number } };

export type CreateVisitMutationVariables = Exact<{
  data: CreateVisitInput;
}>;


export type CreateVisitMutation = { __typename?: 'Mutation', createVisit: { __typename?: 'Visit', id: string, patientId: string, status: VisitStatus } };

export type FindAllVisitsQueryVariables = Exact<{
  pagination: VisitPaginationInput;
}>;


export type FindAllVisitsQuery = { __typename?: 'Query', visits: { __typename?: 'VisitPaginationResult', total: number, page: number, pageCount: number, items: Array<{ __typename?: 'Visit', id: string, patientId: string, visitType: VisitType, status: VisitStatus, visitDateTime: any, attendingStaffId?: string | null }> } };

export type GetPatientVisitHistoryQueryVariables = Exact<{
  patientId: Scalars['String']['input'];
}>;


export type GetPatientVisitHistoryQuery = { __typename?: 'Query', patientVisitHistory: Array<{ __typename?: 'Visit', id: string, visitType: VisitType, status: VisitStatus, visitDateTime: any, attendingStaffId?: string | null }> };

export type GetVisitByIdQueryVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type GetVisitByIdQuery = { __typename?: 'Query', visit: { __typename?: 'Visit', id: string, visitType: VisitType, status: VisitStatus, visitDateTime: any, closedAt?: any | null, attendingStaffId?: string | null, patient: { __typename?: 'Patient', id: string, fullName?: string | null, email?: string | null, phoneNumber?: string | null } } };


export const StaffLoginDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"StaffLogin"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"StaffLoginInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"staffLogin"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accessToken"}},{"kind":"Field","name":{"kind":"Name","value":"refreshToken"}}]}}]}}]} as unknown as DocumentNode<StaffLoginMutation, StaffLoginMutationVariables>;
export const RefreshTokenDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RefreshToken"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"refreshToken"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accessToken"}},{"kind":"Field","name":{"kind":"Name","value":"refreshToken"}}]}}]}}]} as unknown as DocumentNode<RefreshTokenMutation, RefreshTokenMutationVariables>;
export const WhoAmIDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"WhoAmI"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"whoAmI"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"roles"}}]}}]}}]} as unknown as DocumentNode<WhoAmIQuery, WhoAmIQueryVariables>;
export const GetAllStaffDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetAllStaff"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"page"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},"defaultValue":{"kind":"IntValue","value":"1"}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},"defaultValue":{"kind":"IntValue","value":"25"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"staffs"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"page"},"value":{"kind":"Variable","name":{"kind":"Name","value":"page"}}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"userCode"}},{"kind":"Field","name":{"kind":"Name","value":"userType"}},{"kind":"Field","name":{"kind":"Name","value":"roles"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"phoneNumber"}},{"kind":"Field","name":{"kind":"Name","value":"organizationId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"page"}},{"kind":"Field","name":{"kind":"Name","value":"pageCount"}}]}}]}}]} as unknown as DocumentNode<GetAllStaffQuery, GetAllStaffQueryVariables>;
export const GetStaffByRoleDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetStaffByRole"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"role"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"StaffRole"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"staffByRole"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"role"},"value":{"kind":"Variable","name":{"kind":"Name","value":"role"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"userCode"}},{"kind":"Field","name":{"kind":"Name","value":"userType"}},{"kind":"Field","name":{"kind":"Name","value":"roles"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"phoneNumber"}},{"kind":"Field","name":{"kind":"Name","value":"organizationId"}}]}}]}}]} as unknown as DocumentNode<GetStaffByRoleQuery, GetStaffByRoleQueryVariables>;
export const CreateStaffDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateStaff"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateStaffInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createStaff"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"userCode"}},{"kind":"Field","name":{"kind":"Name","value":"userType"}},{"kind":"Field","name":{"kind":"Name","value":"roles"}},{"kind":"Field","name":{"kind":"Name","value":"phoneNumber"}},{"kind":"Field","name":{"kind":"Name","value":"organizationId"}}]}}]}}]} as unknown as DocumentNode<CreateStaffMutation, CreateStaffMutationVariables>;
export const GetStaffByIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetStaffById"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"staffById"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"phoneNumber"}},{"kind":"Field","name":{"kind":"Name","value":"roles"}},{"kind":"Field","name":{"kind":"Name","value":"userCode"}},{"kind":"Field","name":{"kind":"Name","value":"status"}}]}}]}}]} as unknown as DocumentNode<GetStaffByIdQuery, GetStaffByIdQueryVariables>;
export const SearchStaffDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"SearchStaff"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"query"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"searchStaff"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"query"},"value":{"kind":"Variable","name":{"kind":"Name","value":"query"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"phoneNumber"}},{"kind":"Field","name":{"kind":"Name","value":"roles"}},{"kind":"Field","name":{"kind":"Name","value":"userCode"}}]}}]}}]} as unknown as DocumentNode<SearchStaffQuery, SearchStaffQueryVariables>;
export const UpdateStaffDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateStaff"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateStaffInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateStaff"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"phoneNumber"}},{"kind":"Field","name":{"kind":"Name","value":"roles"}}]}}]}}]} as unknown as DocumentNode<UpdateStaffMutation, UpdateStaffMutationVariables>;
export const UpdateStaffRolesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateStaffRoles"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateStaffRolesInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateStaffRoles"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"roles"}}]}}]}}]} as unknown as DocumentNode<UpdateStaffRolesMutation, UpdateStaffRolesMutationVariables>;
export const UpdateStaffStatusDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateStaffStatus"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateStaffStatusInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateStaffStatus"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"userCode"}},{"kind":"Field","name":{"kind":"Name","value":"roles"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"organizationId"}}]}}]}}]} as unknown as DocumentNode<UpdateStaffStatusMutation, UpdateStaffStatusMutationVariables>;
export const UpdateStaffPasswordDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateStaffPassword"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateStaffPasswordInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateStaffPassword"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}]}]}}]} as unknown as DocumentNode<UpdateStaffPasswordMutation, UpdateStaffPasswordMutationVariables>;
export const CreatePatientDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreatePatient"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreatePatientInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createPatient"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"patient"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"patientNumber"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}},{"kind":"Field","name":{"kind":"Name","value":"gender"}},{"kind":"Field","name":{"kind":"Name","value":"phoneNumber"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"bloodGroup"}},{"kind":"Field","name":{"kind":"Name","value":"emergency"}}]}},{"kind":"Field","name":{"kind":"Name","value":"warning"}},{"kind":"Field","name":{"kind":"Name","value":"matches"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"patientId"}},{"kind":"Field","name":{"kind":"Name","value":"patientNumber"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}},{"kind":"Field","name":{"kind":"Name","value":"confidence"}}]}}]}}]}}]} as unknown as DocumentNode<CreatePatientMutation, CreatePatientMutationVariables>;
export const GetAllPatientsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetAllPatients"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"PatientPaginationInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"patients"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"pagination"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"patientNumber"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}},{"kind":"Field","name":{"kind":"Name","value":"gender"}},{"kind":"Field","name":{"kind":"Name","value":"phoneNumber"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"bloodGroup"}},{"kind":"Field","name":{"kind":"Name","value":"emergency"}},{"kind":"Field","name":{"kind":"Name","value":"status"}}]}},{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"page"}},{"kind":"Field","name":{"kind":"Name","value":"pageCount"}}]}}]}}]} as unknown as DocumentNode<GetAllPatientsQuery, GetAllPatientsQueryVariables>;
export const SearchPatientDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"SearchPatient"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"query"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"searchPatient"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"query"},"value":{"kind":"Variable","name":{"kind":"Name","value":"query"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"phoneNumber"}},{"kind":"Field","name":{"kind":"Name","value":"gender"}},{"kind":"Field","name":{"kind":"Name","value":"patientNumber"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"emergency"}}]}}]}}]} as unknown as DocumentNode<SearchPatientQuery, SearchPatientQueryVariables>;
export const GetPatientByIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetPatientById"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"patientById"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}},{"kind":"Field","name":{"kind":"Name","value":"dateOfBirth"}},{"kind":"Field","name":{"kind":"Name","value":"gender"}},{"kind":"Field","name":{"kind":"Name","value":"phoneNumber"}},{"kind":"Field","name":{"kind":"Name","value":"secondaryPhoneNumber"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"patientNumber"}},{"kind":"Field","name":{"kind":"Name","value":"userCode"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"bloodGroup"}},{"kind":"Field","name":{"kind":"Name","value":"allergies"}},{"kind":"Field","name":{"kind":"Name","value":"emergency"}},{"kind":"Field","name":{"kind":"Name","value":"extraDetails"}},{"kind":"Field","name":{"kind":"Name","value":"nextOfKinName"}},{"kind":"Field","name":{"kind":"Name","value":"nextOfKinPhone"}},{"kind":"Field","name":{"kind":"Name","value":"createdByStaffId"}},{"kind":"Field","name":{"kind":"Name","value":"likelyDuplicatePatientIds"}},{"kind":"Field","name":{"kind":"Name","value":"addresses"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"addressLine1"}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"country"}}]}}]}}]}}]} as unknown as DocumentNode<GetPatientByIdQuery, GetPatientByIdQueryVariables>;
export const UpdatePatientDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdatePatient"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdatePatientInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updatePatient"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userCode"}}]}}]}}]} as unknown as DocumentNode<UpdatePatientMutation, UpdatePatientMutationVariables>;
export const CreateVisitDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateVisit"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateVisitInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createVisit"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"patientId"}},{"kind":"Field","name":{"kind":"Name","value":"status"}}]}}]}}]} as unknown as DocumentNode<CreateVisitMutation, CreateVisitMutationVariables>;
export const FindAllVisitsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"FindAllVisits"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"VisitPaginationInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"visits"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"pagination"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"patientId"}},{"kind":"Field","name":{"kind":"Name","value":"visitType"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"visitDateTime"}},{"kind":"Field","name":{"kind":"Name","value":"attendingStaffId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"page"}},{"kind":"Field","name":{"kind":"Name","value":"pageCount"}}]}}]}}]} as unknown as DocumentNode<FindAllVisitsQuery, FindAllVisitsQueryVariables>;
export const GetPatientVisitHistoryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetPatientVisitHistory"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"patientId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"patientVisitHistory"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"patientId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"patientId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"visitType"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"visitDateTime"}},{"kind":"Field","name":{"kind":"Name","value":"attendingStaffId"}}]}}]}}]} as unknown as DocumentNode<GetPatientVisitHistoryQuery, GetPatientVisitHistoryQueryVariables>;
export const GetVisitByIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetVisitById"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"visit"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"visitType"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"visitDateTime"}},{"kind":"Field","name":{"kind":"Name","value":"closedAt"}},{"kind":"Field","name":{"kind":"Name","value":"patient"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"phoneNumber"}}]}},{"kind":"Field","name":{"kind":"Name","value":"attendingStaffId"}}]}}]}}]} as unknown as DocumentNode<GetVisitByIdQuery, GetVisitByIdQueryVariables>;