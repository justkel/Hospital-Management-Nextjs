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
  DateTime: { input: string; output: string; }
  JSON: { input: Record<string, unknown>; output: Record<string, unknown>; }
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

export enum AuditDateFilter {
  Custom = 'CUSTOM',
  ThisMonth = 'THIS_MONTH',
  ThisWeek = 'THIS_WEEK',
  Today = 'TODAY'
}

export enum AuditDistinctField {
  Action = 'ACTION',
  ActorId = 'ACTOR_ID',
  Entity = 'ENTITY'
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
  metadata?: Maybe<Scalars['JSON']['output']>;
  organizationId: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type AuditPaginationInput = {
  action?: InputMaybe<Scalars['String']['input']>;
  actorId?: InputMaybe<Scalars['String']['input']>;
  dateFilter?: InputMaybe<AuditDateFilter>;
  endDate?: InputMaybe<Scalars['DateTime']['input']>;
  entity?: InputMaybe<Scalars['String']['input']>;
  limit: Scalars['Float']['input'];
  page: Scalars['Float']['input'];
  startDate?: InputMaybe<Scalars['DateTime']['input']>;
};

export type AuditPaginationResult = {
  __typename?: 'AuditPaginationResult';
  items: Array<AuditLog>;
  page: Scalars['Int']['output'];
  pageCount: Scalars['Int']['output'];
  total: Scalars['Int']['output'];
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

/** Billing calculation type */
export enum BillingType {
  Fixed = 'FIXED',
  Manual = 'MANUAL',
  PerDay = 'PER_DAY',
  PerUnit = 'PER_UNIT'
}

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

export type ChargeCatalog = {
  __typename?: 'ChargeCatalog';
  billingType: BillingType;
  catalogueItem: GlobalBillingCatalogueItem;
  catalogueItemId: Scalars['ID']['output'];
  category: BillingCatalogueCategory;
  categoryId: Scalars['ID']['output'];
  code: Scalars['String']['output'];
  currency: Scalars['String']['output'];
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  isActive: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  organizationId: Scalars['ID']['output'];
  unitPrice: Scalars['Float']['output'];
};

export type ChargeCatalogPaginationInput = {
  limit: Scalars['Int']['input'];
  page: Scalars['Int']['input'];
  search?: InputMaybe<Scalars['String']['input']>;
};

export type ChargeCatalogPaginationResult = {
  __typename?: 'ChargeCatalogPaginationResult';
  items: Array<ChargeCatalog>;
  page: Scalars['Int']['output'];
  pageCount: Scalars['Int']['output'];
  total: Scalars['Int']['output'];
};

export enum ChargeDomain {
  Administrative = 'ADMINISTRATIVE',
  Admission = 'ADMISSION',
  Bed = 'BED',
  Consultation = 'CONSULTATION',
  Consumable = 'CONSUMABLE',
  Dental = 'DENTAL',
  Diagnosis = 'DIAGNOSIS',
  Emergency = 'EMERGENCY',
  Equipment = 'EQUIPMENT',
  Icu = 'ICU',
  Lab = 'LAB',
  Maternity = 'MATERNITY',
  MentalHealth = 'MENTAL_HEALTH',
  Nursing = 'NURSING',
  Other = 'OTHER',
  Pharmacy = 'PHARMACY',
  Physiotherapy = 'PHYSIOTHERAPY',
  Procedure = 'PROCEDURE',
  Radiology = 'RADIOLOGY',
  Registration = 'REGISTRATION',
  Surgery = 'SURGERY',
  Vitals = 'VITALS'
}

export type ChargeDomainCatalogMapping = {
  __typename?: 'ChargeDomainCatalogMapping';
  chargeCatalog: ChargeCatalog;
  chargeCatalogId: Scalars['ID']['output'];
  chargeDomain: ChargeDomain;
  id: Scalars['ID']['output'];
  organization: Organization;
  organizationId: Scalars['ID']['output'];
};

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

export type CreateChargeCatalogInput = {
  billingType: BillingType;
  catalogueItemId: Scalars['ID']['input'];
  categoryId: Scalars['ID']['input'];
  code: Scalars['String']['input'];
  currency?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  unitPrice: Scalars['Float']['input'];
};

export type CreateLabRequestInput = {
  chargeCatalogIds: Array<Scalars['ID']['input']>;
  confirmDuplicate?: InputMaybe<Scalars['Boolean']['input']>;
  duplicateReason?: InputMaybe<Scalars['String']['input']>;
  priority?: InputMaybe<LabPriority>;
  visitId: Scalars['ID']['input'];
};

export type CreateLabRequestResponse = {
  __typename?: 'CreateLabRequestResponse';
  duplicates?: Maybe<Array<DuplicateWarning>>;
  labRequest?: Maybe<LabRequest>;
  previousRequests?: Maybe<Array<DuplicateWarning>>;
  requiresConfirmation?: Maybe<Scalars['Boolean']['output']>;
  success: Scalars['Boolean']['output'];
};

export type CreateLabResultInput = {
  chargeCatalogId: Scalars['ID']['input'];
  items: Array<CreateLabResultItemInput>;
  labRequestId: Scalars['ID']['input'];
  testName: Scalars['String']['input'];
};

export type CreateLabResultItemInput = {
  interpretation?: InputMaybe<Scalars['String']['input']>;
  parameter: Scalars['String']['input'];
  referenceRange?: InputMaybe<Scalars['String']['input']>;
  unit?: InputMaybe<Scalars['String']['input']>;
  value: Scalars['String']['input'];
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

export type CreateVisitChargeInput = {
  chargeCatalogId: Scalars['ID']['input'];
  chargeDomain?: InputMaybe<ChargeDomain>;
  chargeType: VisitChargeType;
  notes?: InputMaybe<Scalars['String']['input']>;
  overrideReason?: InputMaybe<Scalars['String']['input']>;
  quantity?: Scalars['Int']['input'];
  visitId: Scalars['ID']['input'];
};

export type CreateVisitComplaintInput = {
  code?: InputMaybe<Scalars['String']['input']>;
  complaint: Scalars['String']['input'];
  visitId: Scalars['ID']['input'];
};

export type CreateVisitDiagnosisInput = {
  chargeCatalogId?: InputMaybe<Scalars['ID']['input']>;
  diagnosis: Scalars['String']['input'];
  diagnosisCode?: InputMaybe<Scalars['String']['input']>;
  notes?: InputMaybe<Scalars['String']['input']>;
  visitId: Scalars['ID']['input'];
};

export type CreateVisitInput = {
  patientId: Scalars['ID']['input'];
  visitType: VisitType;
};

export type CreateVisitVitalInput = {
  bloodPressure?: InputMaybe<Scalars['String']['input']>;
  chargeCatalogId?: InputMaybe<Scalars['ID']['input']>;
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

export type DuplicateWarning = {
  __typename?: 'DuplicateWarning';
  chargeCatalogId: Scalars['ID']['output'];
  createdAt: Scalars['DateTime']['output'];
  name: Scalars['String']['output'];
};

export type GlobalBillingCatalogueItem = {
  __typename?: 'GlobalBillingCatalogueItem';
  category?: Maybe<BillingCatalogueCategory>;
  code: Scalars['String']['output'];
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  organizationId?: Maybe<Scalars['ID']['output']>;
};

/** Priority of the lab request */
export enum LabPriority {
  Routine = 'ROUTINE',
  Stat = 'STAT',
  Urgent = 'URGENT'
}

export type LabRequest = {
  __typename?: 'LabRequest';
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  organization: Organization;
  organizationId: Scalars['ID']['output'];
  priority: LabPriority;
  requestedByStaffId: Scalars['ID']['output'];
  status: LabRequestStatus;
  tests: Array<LabRequestTest>;
  updatedAt: Scalars['DateTime']['output'];
  visit: Visit;
  visitId: Scalars['ID']['output'];
};

export type LabRequestPaginationInput = {
  limit: Scalars['Int']['input'];
  page: Scalars['Int']['input'];
  priority?: InputMaybe<LabPriority>;
  status?: InputMaybe<LabRequestStatus>;
};

export type LabRequestPaginationResult = {
  __typename?: 'LabRequestPaginationResult';
  items: Array<LabRequest>;
  page: Scalars['Int']['output'];
  pageCount: Scalars['Int']['output'];
  total: Scalars['Int']['output'];
};

/** Current status of the lab request */
export enum LabRequestStatus {
  Cancelled = 'CANCELLED',
  Completed = 'COMPLETED',
  InProgress = 'IN_PROGRESS',
  Pending = 'PENDING'
}

export type LabRequestTest = {
  __typename?: 'LabRequestTest';
  chargeCatalogId: Scalars['ID']['output'];
  testName: Scalars['String']['output'];
};

export type LabResult = {
  __typename?: 'LabResult';
  id: Scalars['ID']['output'];
  performedByStaffId: Scalars['ID']['output'];
  testName: Scalars['String']['output'];
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
  completeLabRequest: LabRequest;
  createBillingCategory: BillingCatalogueCategory;
  createBillingItem: GlobalBillingCatalogueItem;
  createChargeCatalog: ChargeCatalog;
  createLabRequest: CreateLabRequestResponse;
  createLabResult: LabResult;
  createOrganization: Organization;
  createPatient: CreatePatientResult;
  createStaff: Staff;
  createVisit: Visit;
  createVisitCharge: VisitCharge;
  createVisitComplaint: VisitComplaint;
  createVisitDiagnosis: VisitDiagnosis;
  createVisitVital: VisitVital;
  logout: Scalars['Boolean']['output'];
  refreshToken: AuthResponse;
  staffLogin: LoginAuthResponse;
  startLabRequest: LabRequest;
  syncChargeDomainMapping: Array<ChargeDomainCatalogMapping>;
  updateBillingCategory: BillingCatalogueCategory;
  updateChargeCatalog: ChargeCatalog;
  updateLabRequest: CreateLabRequestResponse;
  updateOrganizationStatus: Organization;
  updatePatient: Patient;
  updatePatientStatus: Patient;
  updateStaff: Staff;
  updateStaffPassword: Scalars['Boolean']['output'];
  updateStaffRoles: Staff;
  updateStaffStatus: Staff;
  updateVisitComplaint: VisitComplaint;
  updateVisitDiagnosis: VisitDiagnosis;
  updateVisitVital: VisitVital;
};


export type MutationCloneGlobalCategoryToOrganizationArgs = {
  categoryId: Scalars['String']['input'];
};


export type MutationCompleteLabRequestArgs = {
  labRequestId: Scalars['ID']['input'];
};


export type MutationCreateBillingCategoryArgs = {
  data: CreateBillingCategoryInput;
};


export type MutationCreateBillingItemArgs = {
  data: CreateBillingItemInput;
};


export type MutationCreateChargeCatalogArgs = {
  data: CreateChargeCatalogInput;
};


export type MutationCreateLabRequestArgs = {
  data: CreateLabRequestInput;
};


export type MutationCreateLabResultArgs = {
  data: CreateLabResultInput;
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


export type MutationCreateVisitChargeArgs = {
  data: CreateVisitChargeInput;
};


export type MutationCreateVisitComplaintArgs = {
  data: CreateVisitComplaintInput;
};


export type MutationCreateVisitDiagnosisArgs = {
  data: CreateVisitDiagnosisInput;
};


export type MutationCreateVisitVitalArgs = {
  data: CreateVisitVitalInput;
};


export type MutationStaffLoginArgs = {
  input: StaffLoginInput;
};


export type MutationStartLabRequestArgs = {
  labRequestId: Scalars['ID']['input'];
};


export type MutationSyncChargeDomainMappingArgs = {
  data: SyncChargeDomainMappingInput;
};


export type MutationUpdateBillingCategoryArgs = {
  data: UpdateBillingCategoryInput;
};


export type MutationUpdateChargeCatalogArgs = {
  data: UpdateChargeCatalogInput;
};


export type MutationUpdateLabRequestArgs = {
  data: UpdateLabRequestInput;
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


export type MutationUpdateVisitComplaintArgs = {
  data: UpdateVisitComplaintInput;
};


export type MutationUpdateVisitDiagnosisArgs = {
  data: UpdateVisitDiagnosisInput;
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
  auditLogs: AuditPaginationResult;
  billingCategoryById: BillingCatalogueCategory;
  catalogsByChargeDomain: Array<ChargeDomainCatalogMapping>;
  chargeDomainMappings: Array<ChargeDomainCatalogMapping>;
  getAuditDistinctValues: Array<Scalars['String']['output']>;
  getAuditLogById: AuditLog;
  getAuditLogs: Array<AuditLog>;
  globalBillingCategories: Array<BillingCatalogueCategory>;
  health: Scalars['String']['output'];
  labRequestById: LabRequest;
  labRequests: LabRequestPaginationResult;
  labRequestsByVisit: Array<LabRequest>;
  labResultsByLabRequest: Array<LabResult>;
  organization: Organization;
  organizationBillingCategories: Array<BillingCatalogueCategory>;
  organizationChargeCatalogs: ChargeCatalogPaginationResult;
  organizationChargeItems: Array<GlobalBillingCatalogueItem>;
  organizations: Array<Organization>;
  patientById: Patient;
  patientVisitHistory: Array<Visit>;
  patients: PatientPaginationResult;
  searchPatient: Array<Patient>;
  searchStaff: Array<Staff>;
  staffById: Staff;
  staffByRole: Array<Staff>;
  staffs: PaginatedStaff;
  visit: Visit;
  visitChargeExistsByDomain: Scalars['Boolean']['output'];
  visitComplaintById: VisitComplaint;
  visitComplaints: Array<VisitComplaint>;
  visitDiagnoses: Array<VisitDiagnosis>;
  visitDiagnosisById: VisitDiagnosis;
  visitVitals: Array<VisitVital>;
  visits: VisitPaginationResult;
  visitsByPatientUserCode: Array<Visit>;
  whoAmI: WhoAmIDto;
};


export type QueryAuditLogsArgs = {
  pagination: AuditPaginationInput;
};


export type QueryBillingCategoryByIdArgs = {
  categoryId: Scalars['String']['input'];
};


export type QueryCatalogsByChargeDomainArgs = {
  chargeDomain: ChargeDomain;
};


export type QueryGetAuditDistinctValuesArgs = {
  field: AuditDistinctField;
};


export type QueryGetAuditLogByIdArgs = {
  id: Scalars['String']['input'];
};


export type QueryLabRequestByIdArgs = {
  id: Scalars['ID']['input'];
};


export type QueryLabRequestsArgs = {
  pagination: LabRequestPaginationInput;
};


export type QueryLabRequestsByVisitArgs = {
  visitId: Scalars['ID']['input'];
};


export type QueryLabResultsByLabRequestArgs = {
  labRequestId: Scalars['ID']['input'];
};


export type QueryOrganizationArgs = {
  id: Scalars['String']['input'];
};


export type QueryOrganizationChargeCatalogsArgs = {
  pagination: ChargeCatalogPaginationInput;
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


export type QueryVisitChargeExistsByDomainArgs = {
  chargeDomain: ChargeDomain;
  visitId: Scalars['String']['input'];
};


export type QueryVisitComplaintByIdArgs = {
  id: Scalars['ID']['input'];
};


export type QueryVisitComplaintsArgs = {
  visitId: Scalars['ID']['input'];
};


export type QueryVisitDiagnosesArgs = {
  visitId: Scalars['ID']['input'];
};


export type QueryVisitDiagnosisByIdArgs = {
  id: Scalars['ID']['input'];
};


export type QueryVisitVitalsArgs = {
  visitId: Scalars['String']['input'];
};


export type QueryVisitsArgs = {
  pagination: VisitPaginationInput;
};


export type QueryVisitsByPatientUserCodeArgs = {
  userCode: Scalars['Int']['input'];
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

export type SyncChargeDomainMappingInput = {
  chargeCatalogIds: Array<Scalars['ID']['input']>;
  chargeDomain: ChargeDomain;
};

export type UpdateBillingCategoryInput = {
  categoryId: Scalars['ID']['input'];
  code?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateChargeCatalogInput = {
  billingType?: InputMaybe<BillingType>;
  chargeCatalogId: Scalars['ID']['input'];
  code?: InputMaybe<Scalars['String']['input']>;
  currency?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  unitPrice?: InputMaybe<Scalars['Float']['input']>;
};

export type UpdateLabRequestInput = {
  chargeCatalogIds: Array<Scalars['ID']['input']>;
  confirmDuplicate?: InputMaybe<Scalars['Boolean']['input']>;
  duplicateReason?: InputMaybe<Scalars['String']['input']>;
  labRequestId: Scalars['ID']['input'];
  priority?: InputMaybe<LabPriority>;
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

export type UpdateVisitComplaintInput = {
  complaint: Scalars['String']['input'];
  complaintId: Scalars['ID']['input'];
};

export type UpdateVisitDiagnosisInput = {
  diagnosis: Scalars['String']['input'];
  diagnosisCode?: InputMaybe<Scalars['String']['input']>;
  diagnosisId: Scalars['ID']['input'];
  notes?: InputMaybe<Scalars['String']['input']>;
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

export type VisitCharge = {
  __typename?: 'VisitCharge';
  chargeCatalog: ChargeCatalog;
  chargeCatalogId: Scalars['ID']['output'];
  chargeDomain?: Maybe<ChargeDomain>;
  chargeName: Scalars['String']['output'];
  chargeType: VisitChargeType;
  createdBy: Staff;
  createdByStaffId: Scalars['ID']['output'];
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  notes?: Maybe<Scalars['String']['output']>;
  organization: Organization;
  organizationId: Scalars['ID']['output'];
  overrideReason?: Maybe<Scalars['String']['output']>;
  quantity: Scalars['Float']['output'];
  status: VisitChargeStatus;
  totalAmount?: Maybe<Scalars['Float']['output']>;
  unitPrice: Scalars['Float']['output'];
  visit: Visit;
  visitId: Scalars['ID']['output'];
};

export enum VisitChargeStatus {
  Billed = 'BILLED',
  Cancelled = 'CANCELLED',
  Pending = 'PENDING',
  Waived = 'WAIVED'
}

export enum VisitChargeType {
  Fixed = 'FIXED',
  Variable = 'VARIABLE'
}

export type VisitComplaint = {
  __typename?: 'VisitComplaint';
  code?: Maybe<Scalars['String']['output']>;
  complaint: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  recordedByStaffId: Scalars['ID']['output'];
  updatedAt: Scalars['DateTime']['output'];
  visitId: Scalars['ID']['output'];
};

export type VisitDiagnosis = {
  __typename?: 'VisitDiagnosis';
  createdAt: Scalars['DateTime']['output'];
  diagnosedByStaffId: Scalars['ID']['output'];
  diagnosis: Scalars['String']['output'];
  diagnosisCode?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  notes?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['DateTime']['output'];
  visitId: Scalars['ID']['output'];
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


export type FindAllVisitsQuery = { __typename?: 'Query', visits: { __typename?: 'VisitPaginationResult', total: number, page: number, pageCount: number, items: Array<{ __typename?: 'Visit', id: string, visitType: VisitType, status: VisitStatus, visitDateTime: string, attendingStaffId?: string | null, patient: { __typename?: 'Patient', id: string, fullName?: string | null, email?: string | null, phoneNumber?: string | null } }> } };

export type GetPatientVisitHistoryQueryVariables = Exact<{
  patientId: Scalars['String']['input'];
}>;


export type GetPatientVisitHistoryQuery = { __typename?: 'Query', patientVisitHistory: Array<{ __typename?: 'Visit', id: string, visitType: VisitType, status: VisitStatus, visitDateTime: string, attendingStaffId?: string | null }> };

export type GetVisitByIdQueryVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type GetVisitByIdQuery = { __typename?: 'Query', visit: { __typename?: 'Visit', id: string, visitType: VisitType, status: VisitStatus, visitDateTime: string, closedAt?: string | null, attendingStaffId?: string | null, patient: { __typename?: 'Patient', id: string, fullName?: string | null, email?: string | null, phoneNumber?: string | null } } };

export type GetGlobalBillingCategoriesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetGlobalBillingCategoriesQuery = { __typename?: 'Query', globalBillingCategories: Array<{ __typename?: 'BillingCatalogueCategory', id: string, code: string, name: string, description?: string | null, organizationId?: string | null, items?: Array<{ __typename?: 'GlobalBillingCatalogueItem', id: string, code: string, name: string, description?: string | null, organizationId?: string | null }> | null }> };

export type GetOrganizationBillingCategoriesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetOrganizationBillingCategoriesQuery = { __typename?: 'Query', organizationBillingCategories: Array<{ __typename?: 'BillingCatalogueCategory', id: string, code: string, name: string, description?: string | null, organizationId?: string | null, items?: Array<{ __typename?: 'GlobalBillingCatalogueItem', id: string, code: string, name: string, description?: string | null, organizationId?: string | null }> | null }> };

export type GetBillingCategoryByIdQueryVariables = Exact<{
  categoryId: Scalars['String']['input'];
}>;


export type GetBillingCategoryByIdQuery = { __typename?: 'Query', billingCategoryById: { __typename?: 'BillingCatalogueCategory', id: string, code: string, name: string, description?: string | null, organizationId?: string | null, items?: Array<{ __typename?: 'GlobalBillingCatalogueItem', id: string, code: string, name: string, description?: string | null, organizationId?: string | null }> | null } };

export type CreateBillingCategoryMutationVariables = Exact<{
  data: CreateBillingCategoryInput;
}>;


export type CreateBillingCategoryMutation = { __typename?: 'Mutation', createBillingCategory: { __typename?: 'BillingCatalogueCategory', id: string, code: string, name: string, description?: string | null, organizationId?: string | null } };

export type UpdateBillingCategoryMutationVariables = Exact<{
  data: UpdateBillingCategoryInput;
}>;


export type UpdateBillingCategoryMutation = { __typename?: 'Mutation', updateBillingCategory: { __typename?: 'BillingCatalogueCategory', id: string, code: string, name: string, description?: string | null, organizationId?: string | null } };

export type CreateBillingItemMutationVariables = Exact<{
  data: CreateBillingItemInput;
}>;


export type CreateBillingItemMutation = { __typename?: 'Mutation', createBillingItem: { __typename?: 'GlobalBillingCatalogueItem', id: string, code: string, name: string, description?: string | null, organizationId?: string | null } };

export type CloneGlobalCategoryToOrganizationMutationVariables = Exact<{
  categoryId: Scalars['String']['input'];
}>;


export type CloneGlobalCategoryToOrganizationMutation = { __typename?: 'Mutation', cloneGlobalCategoryToOrganization: { __typename?: 'BillingCatalogueCategory', id: string, code: string, name: string, description?: string | null, organizationId?: string | null, items?: Array<{ __typename?: 'GlobalBillingCatalogueItem', id: string, code: string, name: string, description?: string | null, organizationId?: string | null }> | null } };

export type OrganizationChargeItemsQueryVariables = Exact<{ [key: string]: never; }>;


export type OrganizationChargeItemsQuery = { __typename?: 'Query', organizationChargeItems: Array<{ __typename?: 'GlobalBillingCatalogueItem', id: string, code: string, name: string, description?: string | null, organizationId?: string | null, category?: { __typename?: 'BillingCatalogueCategory', id: string, code: string, name: string, description?: string | null } | null }> };

export type OrganizationChargeCatalogsQueryVariables = Exact<{
  pagination: ChargeCatalogPaginationInput;
}>;


export type OrganizationChargeCatalogsQuery = { __typename?: 'Query', organizationChargeCatalogs: { __typename?: 'ChargeCatalogPaginationResult', total: number, page: number, pageCount: number, items: Array<{ __typename?: 'ChargeCatalog', id: string, code: string, name: string, unitPrice: number, billingType: BillingType, currency: string, isActive: boolean, description?: string | null, category: { __typename?: 'BillingCatalogueCategory', id: string, name: string, code: string }, catalogueItem: { __typename?: 'GlobalBillingCatalogueItem', id: string, name: string, code: string } }> } };

export type CreateChargeCatalogMutationVariables = Exact<{
  data: CreateChargeCatalogInput;
}>;


export type CreateChargeCatalogMutation = { __typename?: 'Mutation', createChargeCatalog: { __typename?: 'ChargeCatalog', id: string, code: string, name: string, unitPrice: number, billingType: BillingType, currency: string, isActive: boolean, description?: string | null, category: { __typename?: 'BillingCatalogueCategory', id: string, name: string }, catalogueItem: { __typename?: 'GlobalBillingCatalogueItem', id: string, name: string, code: string } } };

export type UpdateChargeCatalogMutationVariables = Exact<{
  data: UpdateChargeCatalogInput;
}>;


export type UpdateChargeCatalogMutation = { __typename?: 'Mutation', updateChargeCatalog: { __typename?: 'ChargeCatalog', id: string, code: string, name: string, unitPrice: number, billingType: BillingType, currency: string, isActive: boolean, description?: string | null, categoryId: string, catalogueItemId: string, category: { __typename?: 'BillingCatalogueCategory', id: string, name: string, code: string } } };

export type CreateVisitVitalMutationVariables = Exact<{
  data: CreateVisitVitalInput;
}>;


export type CreateVisitVitalMutation = { __typename?: 'Mutation', createVisitVital: { __typename?: 'VisitVital', id: string, visitId: string, temperature?: number | null, bloodPressure?: string | null, heartRate?: number | null, respiratoryRate?: number | null, spo2?: number | null, weight?: number | null, height?: number | null, bmi?: number | null, notes?: string | null, recordedByStaffId: string } };

export type UpdateVisitVitalMutationVariables = Exact<{
  data: UpdateVisitVitalInput;
}>;


export type UpdateVisitVitalMutation = { __typename?: 'Mutation', updateVisitVital: { __typename?: 'VisitVital', id: string, visitId: string, temperature?: number | null, bloodPressure?: string | null, heartRate?: number | null, respiratoryRate?: number | null, spo2?: number | null, weight?: number | null, height?: number | null, bmi?: number | null, notes?: string | null, recordedByStaffId: string } };

export type VisitVitalsQueryVariables = Exact<{
  visitId: Scalars['String']['input'];
}>;


export type VisitVitalsQuery = { __typename?: 'Query', visitVitals: Array<{ __typename?: 'VisitVital', id: string, temperature?: number | null, bloodPressure?: string | null, heartRate?: number | null, respiratoryRate?: number | null, spo2?: number | null, weight?: number | null, height?: number | null, bmi?: number | null, notes?: string | null, recordedByStaffId: string }> };

export type ChargeDomainMappingsQueryVariables = Exact<{ [key: string]: never; }>;


export type ChargeDomainMappingsQuery = { __typename?: 'Query', chargeDomainMappings: Array<{ __typename?: 'ChargeDomainCatalogMapping', id: string, organizationId: string, chargeDomain: ChargeDomain, chargeCatalogId: string, chargeCatalog: { __typename?: 'ChargeCatalog', id: string, name: string, billingType: BillingType, code: string, unitPrice: number, isActive: boolean } }> };

export type SyncChargeDomainMappingMutationVariables = Exact<{
  data: SyncChargeDomainMappingInput;
}>;


export type SyncChargeDomainMappingMutation = { __typename?: 'Mutation', syncChargeDomainMapping: Array<{ __typename?: 'ChargeDomainCatalogMapping', id: string, organizationId: string, chargeDomain: ChargeDomain, chargeCatalogId: string, chargeCatalog: { __typename?: 'ChargeCatalog', id: string, name: string, billingType: BillingType, unitPrice: number, code: string, isActive: boolean } }> };

export type GetAuditDistinctValuesQueryVariables = Exact<{
  field: AuditDistinctField;
}>;


export type GetAuditDistinctValuesQuery = { __typename?: 'Query', getAuditDistinctValues: Array<string> };

export type GetAuditLogByIdQueryVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type GetAuditLogByIdQuery = { __typename?: 'Query', getAuditLogById: { __typename?: 'AuditLog', id: string, organizationId: string, actorId?: string | null, actorType?: string | null, actorDescription?: string | null, action: string, entity: string, appName: string, metadata?: Record<string, unknown> | null, createdAt: string } };

export type GetAuditLogsQueryVariables = Exact<{
  pagination: AuditPaginationInput;
}>;


export type GetAuditLogsQuery = { __typename?: 'Query', auditLogs: { __typename?: 'AuditPaginationResult', total: number, page: number, pageCount: number, items: Array<{ __typename?: 'AuditLog', id: string, actorId?: string | null, actorType?: string | null, action: string, entity: string, appName: string, createdAt: string }> } };

export type CatalogsByChargeDomainQueryVariables = Exact<{
  chargeDomain: ChargeDomain;
}>;


export type CatalogsByChargeDomainQuery = { __typename?: 'Query', catalogsByChargeDomain: Array<{ __typename?: 'ChargeDomainCatalogMapping', id: string, chargeDomain: ChargeDomain, chargeCatalogId: string, organizationId: string, chargeCatalog: { __typename?: 'ChargeCatalog', id: string, name: string, description?: string | null, unitPrice: number, currency: string } }> };

export type VisitChargeExistsByDomainQueryVariables = Exact<{
  visitId: Scalars['String']['input'];
  chargeDomain: ChargeDomain;
}>;


export type VisitChargeExistsByDomainQuery = { __typename?: 'Query', visitChargeExistsByDomain: boolean };

export type VisitComplaintsQueryVariables = Exact<{
  visitId: Scalars['ID']['input'];
}>;


export type VisitComplaintsQuery = { __typename?: 'Query', visitComplaints: Array<{ __typename?: 'VisitComplaint', id: string, visitId: string, complaint: string, code?: string | null, recordedByStaffId: string, createdAt: string, updatedAt: string }> };

export type VisitComplaintByIdQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type VisitComplaintByIdQuery = { __typename?: 'Query', visitComplaintById: { __typename?: 'VisitComplaint', id: string, visitId: string, complaint: string, code?: string | null, recordedByStaffId: string, createdAt: string, updatedAt: string } };

export type CreateVisitComplaintMutationVariables = Exact<{
  data: CreateVisitComplaintInput;
}>;


export type CreateVisitComplaintMutation = { __typename?: 'Mutation', createVisitComplaint: { __typename?: 'VisitComplaint', id: string, visitId: string, complaint: string, code?: string | null, recordedByStaffId: string, createdAt: string, updatedAt: string } };

export type CreateVisitChargeMutationVariables = Exact<{
  data: CreateVisitChargeInput;
}>;


export type CreateVisitChargeMutation = { __typename?: 'Mutation', createVisitCharge: { __typename?: 'VisitCharge', id: string, visitId: string, quantity: number, unitPrice: number } };

export type UpdateVisitComplaintMutationVariables = Exact<{
  data: UpdateVisitComplaintInput;
}>;


export type UpdateVisitComplaintMutation = { __typename?: 'Mutation', updateVisitComplaint: { __typename?: 'VisitComplaint', id: string, complaint: string, code?: string | null, visitId: string, createdAt: string, updatedAt: string } };

export type LogoutMutationVariables = Exact<{ [key: string]: never; }>;


export type LogoutMutation = { __typename?: 'Mutation', logout: boolean };

export type VisitDiagnosesQueryVariables = Exact<{
  visitId: Scalars['ID']['input'];
}>;


export type VisitDiagnosesQuery = { __typename?: 'Query', visitDiagnoses: Array<{ __typename?: 'VisitDiagnosis', id: string, visitId: string, diagnosisCode?: string | null, diagnosis: string, notes?: string | null, diagnosedByStaffId: string, createdAt: string, updatedAt: string }> };

export type VisitDiagnosisByIdQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type VisitDiagnosisByIdQuery = { __typename?: 'Query', visitDiagnosisById: { __typename?: 'VisitDiagnosis', id: string, visitId: string, diagnosisCode?: string | null, diagnosis: string, notes?: string | null, diagnosedByStaffId: string, createdAt: string, updatedAt: string } };

export type CreateVisitDiagnosisMutationVariables = Exact<{
  data: CreateVisitDiagnosisInput;
}>;


export type CreateVisitDiagnosisMutation = { __typename?: 'Mutation', createVisitDiagnosis: { __typename?: 'VisitDiagnosis', id: string, visitId: string, diagnosisCode?: string | null, diagnosis: string, notes?: string | null, diagnosedByStaffId: string, createdAt: string, updatedAt: string } };

export type UpdateVisitDiagnosisMutationVariables = Exact<{
  data: UpdateVisitDiagnosisInput;
}>;


export type UpdateVisitDiagnosisMutation = { __typename?: 'Mutation', updateVisitDiagnosis: { __typename?: 'VisitDiagnosis', id: string, visitId: string, diagnosisCode?: string | null, diagnosis: string, notes?: string | null, diagnosedByStaffId: string, createdAt: string, updatedAt: string } };

export type GetVisitsByPatientUserCodeQueryVariables = Exact<{
  userCode: Scalars['Int']['input'];
}>;


export type GetVisitsByPatientUserCodeQuery = { __typename?: 'Query', visitsByPatientUserCode: Array<{ __typename?: 'Visit', id: string, status: VisitStatus, visitType: VisitType, visitDateTime: string, patient: { __typename?: 'Patient', id: string, fullName?: string | null, userCode: number, patientNumber: string, email?: string | null, phoneNumber?: string | null, gender: string } }> };

export type CreateLabRequestMutationVariables = Exact<{
  data: CreateLabRequestInput;
}>;


export type CreateLabRequestMutation = { __typename?: 'Mutation', createLabRequest: { __typename?: 'CreateLabRequestResponse', success: boolean, requiresConfirmation?: boolean | null, duplicates?: Array<{ __typename?: 'DuplicateWarning', chargeCatalogId: string, name: string, createdAt: string }> | null, previousRequests?: Array<{ __typename?: 'DuplicateWarning', chargeCatalogId: string, name: string, createdAt: string }> | null, labRequest?: { __typename?: 'LabRequest', id: string, visitId: string, priority: LabPriority, status: LabRequestStatus, requestedByStaffId: string, organizationId: string, createdAt: string, updatedAt: string, tests: Array<{ __typename?: 'LabRequestTest', chargeCatalogId: string, testName: string }> } | null } };

export type FindAllLabRequestsQueryVariables = Exact<{
  pagination: LabRequestPaginationInput;
}>;


export type FindAllLabRequestsQuery = { __typename?: 'Query', labRequests: { __typename?: 'LabRequestPaginationResult', total: number, page: number, pageCount: number, items: Array<{ __typename?: 'LabRequest', id: string, priority: LabPriority, status: LabRequestStatus, createdAt: string, tests: Array<{ __typename?: 'LabRequestTest', chargeCatalogId: string, testName: string }>, visit: { __typename?: 'Visit', id: string, visitType: VisitType, visitDateTime: string } }> } };

export type UpdateLabRequestMutationVariables = Exact<{
  data: UpdateLabRequestInput;
}>;


export type UpdateLabRequestMutation = { __typename?: 'Mutation', updateLabRequest: { __typename?: 'CreateLabRequestResponse', success: boolean, requiresConfirmation?: boolean | null, duplicates?: Array<{ __typename?: 'DuplicateWarning', chargeCatalogId: string, name: string, createdAt: string }> | null, previousRequests?: Array<{ __typename?: 'DuplicateWarning', chargeCatalogId: string, name: string, createdAt: string }> | null, labRequest?: { __typename?: 'LabRequest', id: string, visitId: string, priority: LabPriority, status: LabRequestStatus, requestedByStaffId: string, organizationId: string, createdAt: string, updatedAt: string, tests: Array<{ __typename?: 'LabRequestTest', chargeCatalogId: string, testName: string }> } | null } };

export type StartLabRequestMutationVariables = Exact<{
  labRequestId: Scalars['ID']['input'];
}>;


export type StartLabRequestMutation = { __typename?: 'Mutation', startLabRequest: { __typename?: 'LabRequest', id: string, visitId: string, priority: LabPriority, status: LabRequestStatus, createdAt: string, updatedAt: string } };

export type CompleteLabRequestMutationVariables = Exact<{
  labRequestId: Scalars['ID']['input'];
}>;


export type CompleteLabRequestMutation = { __typename?: 'Mutation', completeLabRequest: { __typename?: 'LabRequest', id: string, visitId: string, priority: LabPriority, status: LabRequestStatus, createdAt: string, updatedAt: string } };

export type FindLabRequestsByVisitQueryVariables = Exact<{
  visitId: Scalars['ID']['input'];
}>;


export type FindLabRequestsByVisitQuery = { __typename?: 'Query', labRequestsByVisit: Array<{ __typename?: 'LabRequest', id: string, visitId: string, priority: LabPriority, status: LabRequestStatus, requestedByStaffId: string, organizationId: string, createdAt: string, updatedAt: string, tests: Array<{ __typename?: 'LabRequestTest', chargeCatalogId: string, testName: string }> }> };

export type FindLabRequestByIdQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type FindLabRequestByIdQuery = { __typename?: 'Query', labRequestById: { __typename?: 'LabRequest', id: string, visitId: string, priority: LabPriority, status: LabRequestStatus, requestedByStaffId: string, organizationId: string, createdAt: string, updatedAt: string, tests: Array<{ __typename?: 'LabRequestTest', chargeCatalogId: string, testName: string }>, visit: { __typename?: 'Visit', id: string, visitType: VisitType, visitDateTime: string } } };


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
export const FindAllVisitsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"FindAllVisits"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"VisitPaginationInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"visits"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"pagination"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"patient"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"phoneNumber"}}]}},{"kind":"Field","name":{"kind":"Name","value":"visitType"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"visitDateTime"}},{"kind":"Field","name":{"kind":"Name","value":"attendingStaffId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"page"}},{"kind":"Field","name":{"kind":"Name","value":"pageCount"}}]}}]}}]} as unknown as DocumentNode<FindAllVisitsQuery, FindAllVisitsQueryVariables>;
export const GetPatientVisitHistoryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetPatientVisitHistory"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"patientId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"patientVisitHistory"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"patientId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"patientId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"visitType"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"visitDateTime"}},{"kind":"Field","name":{"kind":"Name","value":"attendingStaffId"}}]}}]}}]} as unknown as DocumentNode<GetPatientVisitHistoryQuery, GetPatientVisitHistoryQueryVariables>;
export const GetVisitByIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetVisitById"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"visit"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"visitType"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"visitDateTime"}},{"kind":"Field","name":{"kind":"Name","value":"closedAt"}},{"kind":"Field","name":{"kind":"Name","value":"patient"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"phoneNumber"}}]}},{"kind":"Field","name":{"kind":"Name","value":"attendingStaffId"}}]}}]}}]} as unknown as DocumentNode<GetVisitByIdQuery, GetVisitByIdQueryVariables>;
export const GetGlobalBillingCategoriesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetGlobalBillingCategories"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"globalBillingCategories"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"organizationId"}},{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"organizationId"}}]}}]}}]}}]} as unknown as DocumentNode<GetGlobalBillingCategoriesQuery, GetGlobalBillingCategoriesQueryVariables>;
export const GetOrganizationBillingCategoriesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetOrganizationBillingCategories"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"organizationBillingCategories"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"organizationId"}},{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"organizationId"}}]}}]}}]}}]} as unknown as DocumentNode<GetOrganizationBillingCategoriesQuery, GetOrganizationBillingCategoriesQueryVariables>;
export const GetBillingCategoryByIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetBillingCategoryById"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"categoryId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"billingCategoryById"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"categoryId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"categoryId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"organizationId"}},{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"organizationId"}}]}}]}}]}}]} as unknown as DocumentNode<GetBillingCategoryByIdQuery, GetBillingCategoryByIdQueryVariables>;
export const CreateBillingCategoryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateBillingCategory"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateBillingCategoryInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createBillingCategory"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"organizationId"}}]}}]}}]} as unknown as DocumentNode<CreateBillingCategoryMutation, CreateBillingCategoryMutationVariables>;
export const UpdateBillingCategoryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateBillingCategory"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateBillingCategoryInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateBillingCategory"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"organizationId"}}]}}]}}]} as unknown as DocumentNode<UpdateBillingCategoryMutation, UpdateBillingCategoryMutationVariables>;
export const CreateBillingItemDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateBillingItem"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateBillingItemInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createBillingItem"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"organizationId"}}]}}]}}]} as unknown as DocumentNode<CreateBillingItemMutation, CreateBillingItemMutationVariables>;
export const CloneGlobalCategoryToOrganizationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CloneGlobalCategoryToOrganization"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"categoryId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cloneGlobalCategoryToOrganization"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"categoryId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"categoryId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"organizationId"}},{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"organizationId"}}]}}]}}]}}]} as unknown as DocumentNode<CloneGlobalCategoryToOrganizationMutation, CloneGlobalCategoryToOrganizationMutationVariables>;
export const OrganizationChargeItemsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"OrganizationChargeItems"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"organizationChargeItems"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"organizationId"}},{"kind":"Field","name":{"kind":"Name","value":"category"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}}]}}]}}]} as unknown as DocumentNode<OrganizationChargeItemsQuery, OrganizationChargeItemsQueryVariables>;
export const OrganizationChargeCatalogsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"OrganizationChargeCatalogs"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ChargeCatalogPaginationInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"organizationChargeCatalogs"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"pagination"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"unitPrice"}},{"kind":"Field","name":{"kind":"Name","value":"billingType"}},{"kind":"Field","name":{"kind":"Name","value":"currency"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"category"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"code"}}]}},{"kind":"Field","name":{"kind":"Name","value":"catalogueItem"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"code"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"page"}},{"kind":"Field","name":{"kind":"Name","value":"pageCount"}}]}}]}}]} as unknown as DocumentNode<OrganizationChargeCatalogsQuery, OrganizationChargeCatalogsQueryVariables>;
export const CreateChargeCatalogDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateChargeCatalog"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateChargeCatalogInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createChargeCatalog"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"unitPrice"}},{"kind":"Field","name":{"kind":"Name","value":"billingType"}},{"kind":"Field","name":{"kind":"Name","value":"currency"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"category"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"catalogueItem"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"code"}}]}}]}}]}}]} as unknown as DocumentNode<CreateChargeCatalogMutation, CreateChargeCatalogMutationVariables>;
export const UpdateChargeCatalogDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateChargeCatalog"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateChargeCatalogInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateChargeCatalog"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"unitPrice"}},{"kind":"Field","name":{"kind":"Name","value":"billingType"}},{"kind":"Field","name":{"kind":"Name","value":"currency"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"categoryId"}},{"kind":"Field","name":{"kind":"Name","value":"catalogueItemId"}},{"kind":"Field","name":{"kind":"Name","value":"category"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"code"}}]}}]}}]}}]} as unknown as DocumentNode<UpdateChargeCatalogMutation, UpdateChargeCatalogMutationVariables>;
export const CreateVisitVitalDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateVisitVital"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateVisitVitalInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createVisitVital"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"visitId"}},{"kind":"Field","name":{"kind":"Name","value":"temperature"}},{"kind":"Field","name":{"kind":"Name","value":"bloodPressure"}},{"kind":"Field","name":{"kind":"Name","value":"heartRate"}},{"kind":"Field","name":{"kind":"Name","value":"respiratoryRate"}},{"kind":"Field","name":{"kind":"Name","value":"spo2"}},{"kind":"Field","name":{"kind":"Name","value":"weight"}},{"kind":"Field","name":{"kind":"Name","value":"height"}},{"kind":"Field","name":{"kind":"Name","value":"bmi"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}},{"kind":"Field","name":{"kind":"Name","value":"recordedByStaffId"}}]}}]}}]} as unknown as DocumentNode<CreateVisitVitalMutation, CreateVisitVitalMutationVariables>;
export const UpdateVisitVitalDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateVisitVital"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateVisitVitalInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateVisitVital"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"visitId"}},{"kind":"Field","name":{"kind":"Name","value":"temperature"}},{"kind":"Field","name":{"kind":"Name","value":"bloodPressure"}},{"kind":"Field","name":{"kind":"Name","value":"heartRate"}},{"kind":"Field","name":{"kind":"Name","value":"respiratoryRate"}},{"kind":"Field","name":{"kind":"Name","value":"spo2"}},{"kind":"Field","name":{"kind":"Name","value":"weight"}},{"kind":"Field","name":{"kind":"Name","value":"height"}},{"kind":"Field","name":{"kind":"Name","value":"bmi"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}},{"kind":"Field","name":{"kind":"Name","value":"recordedByStaffId"}}]}}]}}]} as unknown as DocumentNode<UpdateVisitVitalMutation, UpdateVisitVitalMutationVariables>;
export const VisitVitalsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"VisitVitals"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"visitId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"visitVitals"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"visitId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"visitId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"temperature"}},{"kind":"Field","name":{"kind":"Name","value":"bloodPressure"}},{"kind":"Field","name":{"kind":"Name","value":"heartRate"}},{"kind":"Field","name":{"kind":"Name","value":"respiratoryRate"}},{"kind":"Field","name":{"kind":"Name","value":"spo2"}},{"kind":"Field","name":{"kind":"Name","value":"weight"}},{"kind":"Field","name":{"kind":"Name","value":"height"}},{"kind":"Field","name":{"kind":"Name","value":"bmi"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}},{"kind":"Field","name":{"kind":"Name","value":"recordedByStaffId"}}]}}]}}]} as unknown as DocumentNode<VisitVitalsQuery, VisitVitalsQueryVariables>;
export const ChargeDomainMappingsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ChargeDomainMappings"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"chargeDomainMappings"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"organizationId"}},{"kind":"Field","name":{"kind":"Name","value":"chargeDomain"}},{"kind":"Field","name":{"kind":"Name","value":"chargeCatalogId"}},{"kind":"Field","name":{"kind":"Name","value":"chargeCatalog"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"billingType"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"unitPrice"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}}]}}]}}]}}]} as unknown as DocumentNode<ChargeDomainMappingsQuery, ChargeDomainMappingsQueryVariables>;
export const SyncChargeDomainMappingDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SyncChargeDomainMapping"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SyncChargeDomainMappingInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"syncChargeDomainMapping"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"organizationId"}},{"kind":"Field","name":{"kind":"Name","value":"chargeDomain"}},{"kind":"Field","name":{"kind":"Name","value":"chargeCatalogId"}},{"kind":"Field","name":{"kind":"Name","value":"chargeCatalog"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"billingType"}},{"kind":"Field","name":{"kind":"Name","value":"unitPrice"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}}]}}]}}]}}]} as unknown as DocumentNode<SyncChargeDomainMappingMutation, SyncChargeDomainMappingMutationVariables>;
export const GetAuditDistinctValuesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetAuditDistinctValues"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"field"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"AuditDistinctField"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getAuditDistinctValues"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"field"},"value":{"kind":"Variable","name":{"kind":"Name","value":"field"}}}]}]}}]} as unknown as DocumentNode<GetAuditDistinctValuesQuery, GetAuditDistinctValuesQueryVariables>;
export const GetAuditLogByIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetAuditLogById"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getAuditLogById"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"organizationId"}},{"kind":"Field","name":{"kind":"Name","value":"actorId"}},{"kind":"Field","name":{"kind":"Name","value":"actorType"}},{"kind":"Field","name":{"kind":"Name","value":"actorDescription"}},{"kind":"Field","name":{"kind":"Name","value":"action"}},{"kind":"Field","name":{"kind":"Name","value":"entity"}},{"kind":"Field","name":{"kind":"Name","value":"appName"}},{"kind":"Field","name":{"kind":"Name","value":"metadata"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]}}]} as unknown as DocumentNode<GetAuditLogByIdQuery, GetAuditLogByIdQueryVariables>;
export const GetAuditLogsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetAuditLogs"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"AuditPaginationInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"auditLogs"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"pagination"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"actorId"}},{"kind":"Field","name":{"kind":"Name","value":"actorType"}},{"kind":"Field","name":{"kind":"Name","value":"action"}},{"kind":"Field","name":{"kind":"Name","value":"entity"}},{"kind":"Field","name":{"kind":"Name","value":"appName"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"page"}},{"kind":"Field","name":{"kind":"Name","value":"pageCount"}}]}}]}}]} as unknown as DocumentNode<GetAuditLogsQuery, GetAuditLogsQueryVariables>;
export const CatalogsByChargeDomainDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"CatalogsByChargeDomain"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"chargeDomain"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ChargeDomain"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"catalogsByChargeDomain"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"chargeDomain"},"value":{"kind":"Variable","name":{"kind":"Name","value":"chargeDomain"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"chargeDomain"}},{"kind":"Field","name":{"kind":"Name","value":"chargeCatalogId"}},{"kind":"Field","name":{"kind":"Name","value":"organizationId"}},{"kind":"Field","name":{"kind":"Name","value":"chargeCatalog"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"unitPrice"}},{"kind":"Field","name":{"kind":"Name","value":"currency"}}]}}]}}]}}]} as unknown as DocumentNode<CatalogsByChargeDomainQuery, CatalogsByChargeDomainQueryVariables>;
export const VisitChargeExistsByDomainDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"VisitChargeExistsByDomain"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"visitId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"chargeDomain"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ChargeDomain"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"visitChargeExistsByDomain"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"visitId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"visitId"}}},{"kind":"Argument","name":{"kind":"Name","value":"chargeDomain"},"value":{"kind":"Variable","name":{"kind":"Name","value":"chargeDomain"}}}]}]}}]} as unknown as DocumentNode<VisitChargeExistsByDomainQuery, VisitChargeExistsByDomainQueryVariables>;
export const VisitComplaintsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"VisitComplaints"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"visitId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"visitComplaints"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"visitId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"visitId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"visitId"}},{"kind":"Field","name":{"kind":"Name","value":"complaint"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"recordedByStaffId"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<VisitComplaintsQuery, VisitComplaintsQueryVariables>;
export const VisitComplaintByIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"VisitComplaintById"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"visitComplaintById"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"visitId"}},{"kind":"Field","name":{"kind":"Name","value":"complaint"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"recordedByStaffId"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<VisitComplaintByIdQuery, VisitComplaintByIdQueryVariables>;
export const CreateVisitComplaintDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateVisitComplaint"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateVisitComplaintInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createVisitComplaint"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"visitId"}},{"kind":"Field","name":{"kind":"Name","value":"complaint"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"recordedByStaffId"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<CreateVisitComplaintMutation, CreateVisitComplaintMutationVariables>;
export const CreateVisitChargeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateVisitCharge"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateVisitChargeInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createVisitCharge"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"visitId"}},{"kind":"Field","name":{"kind":"Name","value":"quantity"}},{"kind":"Field","name":{"kind":"Name","value":"unitPrice"}}]}}]}}]} as unknown as DocumentNode<CreateVisitChargeMutation, CreateVisitChargeMutationVariables>;
export const UpdateVisitComplaintDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateVisitComplaint"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateVisitComplaintInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateVisitComplaint"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"complaint"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"visitId"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<UpdateVisitComplaintMutation, UpdateVisitComplaintMutationVariables>;
export const LogoutDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"Logout"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"logout"}}]}}]} as unknown as DocumentNode<LogoutMutation, LogoutMutationVariables>;
export const VisitDiagnosesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"VisitDiagnoses"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"visitId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"visitDiagnoses"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"visitId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"visitId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"visitId"}},{"kind":"Field","name":{"kind":"Name","value":"diagnosisCode"}},{"kind":"Field","name":{"kind":"Name","value":"diagnosis"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}},{"kind":"Field","name":{"kind":"Name","value":"diagnosedByStaffId"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<VisitDiagnosesQuery, VisitDiagnosesQueryVariables>;
export const VisitDiagnosisByIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"VisitDiagnosisById"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"visitDiagnosisById"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"visitId"}},{"kind":"Field","name":{"kind":"Name","value":"diagnosisCode"}},{"kind":"Field","name":{"kind":"Name","value":"diagnosis"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}},{"kind":"Field","name":{"kind":"Name","value":"diagnosedByStaffId"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<VisitDiagnosisByIdQuery, VisitDiagnosisByIdQueryVariables>;
export const CreateVisitDiagnosisDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateVisitDiagnosis"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateVisitDiagnosisInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createVisitDiagnosis"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"visitId"}},{"kind":"Field","name":{"kind":"Name","value":"diagnosisCode"}},{"kind":"Field","name":{"kind":"Name","value":"diagnosis"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}},{"kind":"Field","name":{"kind":"Name","value":"diagnosedByStaffId"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<CreateVisitDiagnosisMutation, CreateVisitDiagnosisMutationVariables>;
export const UpdateVisitDiagnosisDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateVisitDiagnosis"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateVisitDiagnosisInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateVisitDiagnosis"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"visitId"}},{"kind":"Field","name":{"kind":"Name","value":"diagnosisCode"}},{"kind":"Field","name":{"kind":"Name","value":"diagnosis"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}},{"kind":"Field","name":{"kind":"Name","value":"diagnosedByStaffId"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<UpdateVisitDiagnosisMutation, UpdateVisitDiagnosisMutationVariables>;
export const GetVisitsByPatientUserCodeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetVisitsByPatientUserCode"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userCode"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"visitsByPatientUserCode"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"userCode"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userCode"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"visitType"}},{"kind":"Field","name":{"kind":"Name","value":"visitDateTime"}},{"kind":"Field","name":{"kind":"Name","value":"patient"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}},{"kind":"Field","name":{"kind":"Name","value":"userCode"}},{"kind":"Field","name":{"kind":"Name","value":"patientNumber"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"phoneNumber"}},{"kind":"Field","name":{"kind":"Name","value":"gender"}}]}}]}}]}}]} as unknown as DocumentNode<GetVisitsByPatientUserCodeQuery, GetVisitsByPatientUserCodeQueryVariables>;
export const CreateLabRequestDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateLabRequest"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateLabRequestInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createLabRequest"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"requiresConfirmation"}},{"kind":"Field","name":{"kind":"Name","value":"duplicates"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"chargeCatalogId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"previousRequests"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"chargeCatalogId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"labRequest"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"visitId"}},{"kind":"Field","name":{"kind":"Name","value":"tests"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"chargeCatalogId"}},{"kind":"Field","name":{"kind":"Name","value":"testName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"priority"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"requestedByStaffId"}},{"kind":"Field","name":{"kind":"Name","value":"organizationId"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]}}]} as unknown as DocumentNode<CreateLabRequestMutation, CreateLabRequestMutationVariables>;
export const FindAllLabRequestsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"FindAllLabRequests"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"LabRequestPaginationInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"labRequests"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"pagination"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"priority"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"tests"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"chargeCatalogId"}},{"kind":"Field","name":{"kind":"Name","value":"testName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"visit"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"visitType"}},{"kind":"Field","name":{"kind":"Name","value":"visitDateTime"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"page"}},{"kind":"Field","name":{"kind":"Name","value":"pageCount"}}]}}]}}]} as unknown as DocumentNode<FindAllLabRequestsQuery, FindAllLabRequestsQueryVariables>;
export const UpdateLabRequestDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateLabRequest"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateLabRequestInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateLabRequest"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"requiresConfirmation"}},{"kind":"Field","name":{"kind":"Name","value":"duplicates"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"chargeCatalogId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"previousRequests"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"chargeCatalogId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"labRequest"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"visitId"}},{"kind":"Field","name":{"kind":"Name","value":"priority"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"tests"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"chargeCatalogId"}},{"kind":"Field","name":{"kind":"Name","value":"testName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"requestedByStaffId"}},{"kind":"Field","name":{"kind":"Name","value":"organizationId"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]}}]} as unknown as DocumentNode<UpdateLabRequestMutation, UpdateLabRequestMutationVariables>;
export const StartLabRequestDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"StartLabRequest"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"labRequestId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"startLabRequest"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"labRequestId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"labRequestId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"visitId"}},{"kind":"Field","name":{"kind":"Name","value":"priority"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<StartLabRequestMutation, StartLabRequestMutationVariables>;
export const CompleteLabRequestDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CompleteLabRequest"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"labRequestId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"completeLabRequest"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"labRequestId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"labRequestId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"visitId"}},{"kind":"Field","name":{"kind":"Name","value":"priority"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<CompleteLabRequestMutation, CompleteLabRequestMutationVariables>;
export const FindLabRequestsByVisitDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"FindLabRequestsByVisit"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"visitId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"labRequestsByVisit"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"visitId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"visitId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"visitId"}},{"kind":"Field","name":{"kind":"Name","value":"priority"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"tests"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"chargeCatalogId"}},{"kind":"Field","name":{"kind":"Name","value":"testName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"requestedByStaffId"}},{"kind":"Field","name":{"kind":"Name","value":"organizationId"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<FindLabRequestsByVisitQuery, FindLabRequestsByVisitQueryVariables>;
export const FindLabRequestByIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"FindLabRequestById"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"labRequestById"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"visitId"}},{"kind":"Field","name":{"kind":"Name","value":"priority"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"tests"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"chargeCatalogId"}},{"kind":"Field","name":{"kind":"Name","value":"testName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"requestedByStaffId"}},{"kind":"Field","name":{"kind":"Name","value":"organizationId"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"visit"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"visitType"}},{"kind":"Field","name":{"kind":"Name","value":"visitDateTime"}}]}}]}}]}}]} as unknown as DocumentNode<FindLabRequestByIdQuery, FindLabRequestByIdQueryVariables>;